const StellarSdk = require('stellar-sdk');
const log = require('npmlog');
const { HORIZON_ENDPOINT } = require('../config');

const server = new StellarSdk.Server(HORIZON_ENDPOINT);

function sleep(time){

  return new Promise(resolve => setTimeout(resolve, time) );

}

function showBalance(account){

  return account.balances.map(wallet => wallet.asset_code ? `${wallet.asset_code} - ${wallet.balance} ` : ` XLM:${wallet.balance} `); // eslint-disable-line no-confusing-arrow, max-len

}

function bulkOperations(transactionBuilder, operations){

  operations.forEach(operation => transactionBuilder.addOperation(operation) );

}

function getTransactionUrl(transactionRes){

  return transactionRes._links.transaction.href; // eslint-disable-line no-underscore-dangle

}

async function payment(sellerAccount, sellerPair, buyPair, amount, asset){ // eslint-disable-line max-params

  log.info('payment', `sellerPair:${sellerPair.accountId()}|asset:${asset.code}|Amount:${amount}|BuyPair:${buyPair.accountId()}`);

  const paymentOp = StellarSdk.Operation.payment({
    destination: buyPair.accountId(),
    asset,
    amount
  });

  const transaction = new StellarSdk.TransactionBuilder(sellerAccount).addOperation(paymentOp).build();

  transaction.sign(sellerPair);

  const transactionRes = await server.submitTransaction(transaction);

  log.info('payment', `transactionPayment|Url:${getTransactionUrl(transactionRes)}`);

}

function deleteOfferOp(offer){

  const assetSelling = new StellarSdk.Asset(offer.selling.asset_code, offer.selling.asset_issuer);
  const assetBuying = new StellarSdk.Asset(offer.buying.asset_code, offer.buying.asset_issuer);

  log.info('offer', `Delete|assetSelling:${assetSelling.code}-${assetSelling.issuer}|assetBuying:${assetBuying.code}-${assetBuying.issuer}|LastAmount:${offer.amount}`); // eslint-disable-line max-len

  return StellarSdk.Operation.manageOffer({
    selling: assetSelling,
    buying: assetBuying,
    amount: '0',
    price: '1',
    offerId: offer.id
  });

}

async function trustAssets(trusterAccount, trusterPair, assets){

  const transactionBuilder = new StellarSdk.TransactionBuilder(trusterAccount);
  const changeTrustOps = assets.map(asset => StellarSdk.Operation.changeTrust({ asset }) );

  bulkOperations(transactionBuilder, changeTrustOps);

  const transaction = transactionBuilder.build();

  transaction.sign(trusterPair);

  const transactionRes = await server.submitTransaction(transaction);

  log.info('trustAssets', `Url:${getTransactionUrl(transactionRes)}`); // eslint-disable-line no-underscore-dangle

}

module.exports = {
  sleep,
  showBalance,
  bulkOperations,
  getTransactionUrl,
  payment,
  deleteOfferOp,
  trustAssets
};
