const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT } = require('../config');
const server = new Stellar.Server(HORIZON_ENDPOINT);
const { getTransactionUrl } = require('./transaction');

module.exports = async function payment(sellerAccount, sellerPair, buyPair, amount, asset){ // eslint-disable-line max-params

  log.info('payment', `sellerPair:${sellerPair.accountId()}|asset:${asset.code}|Amount:${amount}|BuyPair:${buyPair.accountId()}`);

  const paymentOp = Stellar.Operation.payment({
    destination: buyPair.accountId(),
    asset,
    amount
  });

  const transaction = new Stellar.TransactionBuilder(sellerAccount).addOperation(paymentOp).build();

  transaction.sign(sellerPair);

  const transactionRes = await server.submitTransaction(transaction);

  log.info('payment', `transactionPayment|Url:${getTransactionUrl(transactionRes)}`);

};
