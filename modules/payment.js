const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT, SERVER_CONFIG } = require('../config');
const server = new Stellar.Server(HORIZON_ENDPOINT, SERVER_CONFIG);
const { getTransactionUrl } = require('./transaction');
const { assetUid } = require('../modules/asset');

module.exports = async function payment(sellerAccount, sellerPair, buyPair, amount, asset){ // eslint-disable-line max-params

  log.info('payment', `Seller:${sellerPair.accountId()}|asset:${assetUid(asset)}|Amount:${amount}|BuyPair:${buyPair.accountId()}`);

  const paymentOp = Stellar.Operation.payment({
    destination: buyPair.accountId(),
    asset,
    amount
  });

  const transaction = new Stellar.TransactionBuilder(sellerAccount).addOperation(paymentOp).build();

  transaction.sign(sellerPair);

  await server.submitTransaction(transaction)
    .then(transactionRes => log.info('payment', `transactionPayment|Url:${getTransactionUrl(transactionRes)}`) )
    .catch(err => log.error('submitTransaction', err.extras) );

  return true;

};
