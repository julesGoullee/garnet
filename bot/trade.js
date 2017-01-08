const log = require('npmlog');
const Decimal = require('decimal.js');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT, BOT_CHECK_BALANCE_TIMER } = require('../config');
const { sleep } = require('../modules/utils');
const server = new Stellar.Server(HORIZON_ENDPOINT);
const { getUpWallets, showWallets } = require('../modules/wallet');
const fetchOffers = require('../modules/fetcherOffers');
const deleteOfferOp = require('../modules/deleteOfferOperation');
const { submitTransaction } = require('../modules/transaction');
const filterOffers = require('../modules/filterOffers');

const startTime = Date.now();

function operationsTradeWallet(actualOffers, wallet, walletTrade, asset){ // eslint-disable-line max-statements

  const assetTrade = new Stellar.Asset(walletTrade.asset_code, walletTrade.asset_issuer);
  const prevSameOffers = filterOffers(actualOffers, asset, assetTrade);
  const bnNewOfferAmount = new Decimal(wallet.balance);

  const ops = [];

  if(prevSameOffers.length > 0){

    const lastOffer = prevSameOffers[0];

    if(prevSameOffers.length > 1){

      const lastOffersCurrentToRemove = [...prevSameOffers].splice(1, prevSameOffers.length);

      lastOffersCurrentToRemove.forEach(lastOfferCurrentToRemove => ops.push(deleteOfferOp(lastOfferCurrentToRemove) ) );

    }

    const bnLastOfferAmount = new Decimal(lastOffer.amount);

    if(bnLastOfferAmount.equals(bnNewOfferAmount) ){

      log.info('offer', `NothingChangeOffer|Selling:${asset.code}-${asset.issuer}|Buying:${lastOffer.buying.asset_code}-${lastOffer.buying.asset_issuer}|Balance:${wallet.balance}`); // eslint-disable-line max-len

    } else{

      log.info('offer', `UpdateOffer|Selling:${asset.code}-${asset.issuer}|Buying:${lastOffer.buying.asset_code}-${lastOffer.buying.asset_issuer}|Score:${wallet.balance - lastOffer.amount}`); // eslint-disable-line max-len

      ops.push(Stellar.Operation.manageOffer({
        selling: asset,
        buying: assetTrade,
        amount: wallet.balance,
        price: '1',
        offerId: lastOffer.id
      }) );

    }

  } else if(bnNewOfferAmount.isPositive() && !bnNewOfferAmount.isZero() && wallet.asset_type !== 'native'){

    log.info('offer', `NewOffer|Selling:${asset.code}-${asset.issuer}|Buying:${assetTrade.code}-${assetTrade.issuer}|Balance:${wallet.balance}`); // eslint-disable-line max-len

    ops.push(Stellar.Operation.createPassiveOffer({
      selling: asset,
      buying: assetTrade,
      amount: wallet.balance,
      price: '1',
      offerId: 0
    }) );

  } else{

    log.info('offer', `TrustNewAsset:${asset.code}-${asset.issuer}|Balance:${wallet.balance}`);

  }

  return ops;

}

function updateOffers(wallets, actualOffers){

  const walletsWithoutNative = wallets.filter(otherWallet => otherWallet.asset_type !== 'native');

  if(walletsWithoutNative.length === 0){

    log.info('updateOffers', `No upWallet|DeleteActualOffers:${actualOffers.length}`);

    return actualOffers.map(deleteOfferOp);

  }

  return walletsWithoutNative.reduce( (accWallet, wallet) => {

    const asset = new Stellar.Asset(wallet.asset_code, wallet.asset_issuer);

    const walletsTrade = walletsWithoutNative.filter(otherWallet => otherWallet !== wallet);

    const updateOrCreateOps = walletsTrade.reduce( (accWalletTrade, walletTrade) => accWalletTrade.concat(operationsTradeWallet(actualOffers, wallet, walletTrade, asset) ), []); // eslint-disable-line max-len

    return accWallet.concat(updateOrCreateOps);

  }, []);

}

async function loopTrade(botAccount, botPair){

  const newAccount = await server.loadAccount(botAccount.id);

  const actualOffers = await fetchOffers(newAccount);
  const wallets = newAccount.balances;
  const upWallets = getUpWallets(newAccount.balances);

  log.info('offer', `Offers:${actualOffers.length}|upWallets:${upWallets.length}|Balance:${showWallets(newAccount)}|Time:${(Date.now() - startTime) / 1000}`); // eslint-disable-line max-len

  const operations = updateOffers(wallets, actualOffers);

  if(operations.length > 0){

    await submitTransaction(operations, newAccount, botPair);

  }

  await sleep(BOT_CHECK_BALANCE_TIMER);

  return loopTrade(newAccount, botPair);

}

module.exports = {
  loopTrade, updateOffers
};
