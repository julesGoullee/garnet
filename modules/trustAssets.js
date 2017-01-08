const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT } = require('../config');
const server = new Stellar.Server(HORIZON_ENDPOINT);
const { bulkOperations, getTransactionUrl } = require('./transaction');

module.exports = async function trustAssets(trusterAccount, trusterPair, assets){

  const transactionBuilder = new Stellar.TransactionBuilder(trusterAccount);
  const changeTrustOps = assets.map(asset => Stellar.Operation.changeTrust({ asset }) );

  bulkOperations(transactionBuilder, changeTrustOps);

  const transaction = transactionBuilder.build();

  transaction.sign(trusterPair);

  const transactionRes = await server.submitTransaction(transaction);

  log.info('trustAssets', `Url:${getTransactionUrl(transactionRes)}`); // eslint-disable-line no-underscore-dangle

};
