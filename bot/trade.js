const log = require('npmlog');
const Decimal = require('decimal.js');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT, BOT_CHECK_BALANCE_TIMER } = require('../config');
const { sleep, assetInstance } = require('../modules/utils');
const server = new Stellar.Server(HORIZON_ENDPOINT);
const { showAssetCode, getUpWallets, showWallets } = require('../modules/wallet');
const fetchOffers = require('../modules/fetcherOffers');
const deleteOfferOp = require('../modules/deleteOfferOperation');
const { submitTransaction } = require('../modules/transaction');
const filterOffers = require('../modules/filterOffers');

const startTime = Date.now();

function operationsTradeWallet(actualOffers, wallet, walletTrade){ // eslint-disable-line max-statements, complexity

  const prevSameOffers = filterOffers(actualOffers, wallet.asset, walletTrade.asset);
  const bnNewOfferAmount = new Decimal(wallet.balance);
  const ops = [];

  if(prevSameOffers.length > 0){

    const lastOffer = prevSameOffers[0];

    if(prevSameOffers.length > 1){

      const lastOffersCurrentToRemove = [...prevSameOffers].splice(1, prevSameOffers.length);

      lastOffersCurrentToRemove.forEach(lastOfferCurrentToRemove => ops.push(deleteOfferOp(lastOfferCurrentToRemove) ) );

    }

    const bnLastOfferAmount = new Decimal(lastOffer.amount);

    if(bnLastOfferAmount.equals(bnNewOfferAmount) || lastOffer.selling.asset.isNative() ){

      log.info('offer', `NothingChangeOffer|Selling:${showAssetCode(wallet.asset)}|Buying:${showAssetCode(lastOffer.buying.asset)}|Balance:${wallet.balance}`); // eslint-disable-line max-len

    } else{

      log.info('offer', `UpdateOffer|Selling:${showAssetCode(wallet.asset)}|Buying:${showAssetCode(lastOffer.buying.asset)}|Score:${wallet.balance - lastOffer.amount}`); // eslint-disable-line max-len

      ops.push(Stellar.Operation.manageOffer({
        selling: wallet.asset,
        buying: walletTrade.asset,
        amount: wallet.balance,
        price: '1',
        offerId: lastOffer.id
      }) );

    }

  } else if(bnNewOfferAmount.isPositive() && !bnNewOfferAmount.isZero() ){

    log.info('offer', `NewOffer|Selling:${showAssetCode(wallet.asset)}|Buying:${showAssetCode(walletTrade.asset)}|Balance:${wallet.balance}`);

    ops.push(Stellar.Operation.createPassiveOffer({
      selling: wallet.asset,
      buying: walletTrade.asset,
      amount: wallet.balance,
      price: '1',
      offerId: 0
    }) );

  } else{

    log.info('offer', `TrustNewAsset:${showAssetCode(wallet.asset)}|Balance:${wallet.balance}`);

  }

  return ops;

}

function updateOffers(wallets, actualOffers){

  if(wallets.length === 0){

    log.info('updateOffers', `No upWallet|DeleteActualOffers:${actualOffers.length}`);

    return actualOffers.map(deleteOfferOp);

  }

  return wallets.reduce( (accWallet, wallet) => {

    const walletsTrade = wallets.filter(otherWallet => otherWallet !== wallet);
    const updateOrCreateOps = walletsTrade.reduce( (accWalletTrade, walletTrade) => accWalletTrade.concat(operationsTradeWallet(actualOffers, wallet, walletTrade) ), []); // eslint-disable-line max-len

    return accWallet.concat(updateOrCreateOps);

  }, []);

}

async function loopTrade(botAccount, botPair){

  const newAccount = await server.loadAccount(botAccount.id);
  const actualOffers = await fetchOffers(newAccount);

  actualOffers.forEach( (actualOffer) => {

    actualOffer.buying.asset = assetInstance(actualOffer.buying);
    actualOffer.selling.asset = assetInstance(actualOffer.selling);

  });

  newAccount.balances.forEach( (balance) => {

    balance.asset = assetInstance(balance);

  });

  const upWallets = getUpWallets(newAccount.balances);

  log.info('offer', `Offers:${actualOffers.length}|upWallets:${upWallets.length}|Balance:${showWallets(newAccount)}|Time:${(Date.now() - startTime) / 1000}`); // eslint-disable-line max-len

  const operations = updateOffers(newAccount.balances, actualOffers);

  if(operations.length > 0){

    await submitTransaction(operations, newAccount, botPair);

  }

  await sleep(BOT_CHECK_BALANCE_TIMER);

  return loopTrade(newAccount, botPair);

}

module.exports = {
  loopTrade, updateOffers
};
