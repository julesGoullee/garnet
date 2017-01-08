const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT } = require('../config');
const server = new Stellar.Server(HORIZON_ENDPOINT);

function bulkOperations(transactionBuilder, operations){

  operations.forEach(operation => transactionBuilder.addOperation(operation) );

}

function getTransactionUrl(transactionRes){

  return transactionRes._links.transaction.href; // eslint-disable-line no-underscore-dangle

}

async function submitTransaction(operations, account, pair){

  if(operations.length === 0){

    log.info('submitTransaction', 'No operations');

    return false;

  }

  log.info('transaction', `SendOperations:${operations.length}|AccountId:${account.id}`);

  const transactionBuilder = new Stellar.TransactionBuilder(account);

  bulkOperations(transactionBuilder, operations);
  const transaction = transactionBuilder.build();

  transaction.sign(pair);

  const transactionRes = await server.submitTransaction(transaction);

  log.info('transaction', `Url:${getTransactionUrl(transactionRes)}`);

  return true;

}

module.exports = {
  bulkOperations,
  getTransactionUrl,
  submitTransaction
};
