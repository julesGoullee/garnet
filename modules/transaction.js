const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT, SERVER_CONFIG } = require('../config');
const server = new Stellar.Server(HORIZON_ENDPOINT, SERVER_CONFIG);

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

  await server.submitTransaction(transaction)
    .then(transactionRes => log.info('transaction', `Url:${getTransactionUrl(transactionRes)}`) )
    .catch(err => log.error('submitTransaction', err.extras) );

  return true;

}

async function submitTransactionSeries(operations, account, pair){

  if(operations.length === 0){

    log.info('transactionSeries', 'No operations');

    return false;

  }

  log.info('transaction', `SendOperations:${operations.length}|AccountId:${account.id}`);

  let sequenceNumber = account.sequence;
  let transAccount = new Stellar.Account(pair.accountId(), sequenceNumber);

  while(operations.length > 0){

    sequenceNumber = transAccount.sequence.toString();
    transAccount = new Stellar.Account(pair.accountId(), sequenceNumber);

    const transactionBuilder = new Stellar.TransactionBuilder(transAccount);
    const transaction = transactionBuilder.addOperation(operations.pop() ).build();

    transaction.sign(pair);

    await server.submitTransaction(transaction)
      .then(transactionRes => log.info('transactionSeries', `Url:${getTransactionUrl(transactionRes)}`) )
      .catch(err => log.error('submitTransactionSeries', err.extras) );

  }

  return true;

}

module.exports = {
  bulkOperations,
  getTransactionUrl,
  submitTransaction,
  submitTransactionSeries
};
