const log = require('npmlog');
const Decimal = require('decimal.js');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT, BOT_CHECK_BALANCE_TIMER } = require('../config');
const { sleep } = require('../modules/utils');
const server = new Stellar.Server(HORIZON_ENDPOINT);
const dataAccounts = require('../data/accounts.json');
const { getUpWallets, showWallets } = require('../modules/wallet');
const fetchOffers = require('../modules/fetcherOffers');
const deleteOfferOp = require('../modules/deleteOfferOperation');
const { submitTransaction } = require('../modules/transaction');

const startTime = Date.now();

function filterOffers(offers, assetSelling, assetBuying){

  return offers.filter(offer => assetSelling.issuer === offer.selling.asset_issuer &&
  assetSelling.code === offer.selling.asset_code &&
  assetBuying.issuer === offer.buying.asset_issuer &&
  assetBuying.code === offer.buying.asset_code);

}

function updateOffers(upWallets, actualOffers){

  if(upWallets.length === 0){

    log.info('updateOffers', `No upWallet|DeleteActualOffers:${actualOffers.length}`);

    return actualOffers.map(deleteOfferOp);

  }

  let ops = upWallets.reduce( (acc, upWallet) => {

    const asset = new Stellar.Asset(upWallet.asset_code, upWallet.asset_issuer);
    const othersAssetsData = dataAccounts.issuers.filter(issuer => issuer.account.accountId !== asset.issuer || issuer.asset !== asset.code);

    return acc.concat(othersAssetsData.reduce( (acc, otherAssetData) => {

      const otherAsset = new Stellar.Asset(otherAssetData.asset, otherAssetData.account.accountId);
      const lastOffers = filterOffers(actualOffers, asset, otherAsset);

      if(lastOffers.length > 0){

        const lastOffer = lastOffers[0];

        if(lastOffers.length > 1){

          const lastOffersCurrentToRemove = [...lastOffers].splice(1, lastOffers.length);

          acc.concat(lastOffersCurrentToRemove.map(deleteOfferOp) );

        }

        actualOffers = actualOffers.filter(actualOffer => lastOffers.find(findLastOffer => findLastOffer.id !== actualOffer.id) );

        const bnLastOfferAmount = new Decimal(lastOffer.amount);
        const bnNewOfferAmount = new Decimal(upWallet.balance);

        if(bnLastOfferAmount.equals(bnNewOfferAmount) ){

          log.info('offer', `NothingChangeOffer|Selling:${asset.code}-${asset.issuer}|Buying:${lastOffer.buying.asset_code}-${lastOffer.buying.asset_issuer}|Balance:${upWallet.balance}`); // eslint-disable-line max-len

        } else{

          log.info('offer', `UpdateOffer|Selling:${asset.code}-${asset.issuer}|Buying:${lastOffer.buying.asset_code}-${lastOffer.buying.asset_issuer}|Score:${upWallet.balance - lastOffer.amount}`); // eslint-disable-line max-len

          return acc.concat(Stellar.Operation.manageOffer({
            selling: asset,
            buying: otherAsset,
            amount: upWallet.balance,
            price: '1',
            offerId: lastOffer.id
          }) );

        }

        return acc;

      }

      log.info('offer', `NewOffer|Selling:${asset.code}-${asset.issuer}|Buying:${otherAsset.code}-${otherAsset.issuer}|Balance:${upWallet.balance}`); // eslint-disable-line max-len

      return acc.concat(Stellar.Operation.createPassiveOffer({
        selling: asset,
        buying: otherAsset,
        amount: upWallet.balance,
        price: '1',
        offerId: 0
      }) );

    }, []) );

  }, []);

  if(actualOffers.length > 0){

    ops = ops.concat(actualOffers.map(deleteOfferOp) );

  }

  return ops;

}

async function loopTrade(botAccount, botPair){

  const newAccount = await server.loadAccount(botAccount.id);

  const actualOffers = await fetchOffers(newAccount);

  log.info('offer', `Offers:${actualOffers.length}|Balance:${showWallets(newAccount)}|Time:${(Date.now() - startTime) / 1000}`);

  const upWallets = getUpWallets(newAccount.balances);

  const operations = updateOffers(upWallets, actualOffers);

  if(operations.length > 0){

    await submitTransaction(operations, newAccount, botPair);

  }

  await sleep(BOT_CHECK_BALANCE_TIMER);

  return loopTrade(newAccount, botPair);

}

module.exports = { loopTrade };
