const StellarSdk = require('stellar-sdk');
const log = require('npmlog');
const { HORIZON_ENDPOINT } = require('../config');

const server = new StellarSdk.Server(HORIZON_ENDPOINT);

function showBalance(account){

  return account.balances.map(wallet => wallet.asset_code ? `${wallet.asset_code} - ${wallet.balance} ` : ` XLM:${wallet.balance} `);

}

async function payment(sellerAccount, sellerPair, buyPair, amount, asset){

  log.info('payment', `sellerPair:${sellerPair.accountId()}|asset:${asset.code}|Amount:${amount}|BuyPair:${buyPair.accountId()}`);

  const paymentOp = StellarSdk.Operation.payment({
    destination: buyPair.accountId(),
    asset,
    amount
  });

  const transaction = new StellarSdk.TransactionBuilder(sellerAccount).addOperation(paymentOp).build();

  transaction.sign(sellerPair);

  const transactionRes = await server.submitTransaction(transaction);

  log.info('payment', `transactionPayment|Url:${transactionRes._links.transaction.href}`);

}

function bulkOperations(transaction, operations){

  operations.forEach(operation => transaction.addOperation(operation) );

}

async function trustAssets(trusterAccount, trusterPair, assets){

  const transactionBuilder = new StellarSdk.TransactionBuilder(trusterAccount);
  const changeTrustOps = assets.map(asset => StellarSdk.Operation.changeTrust({ asset }) );

  bulkOperations(transactionBuilder, changeTrustOps);

  const transaction = transactionBuilder.build();

  transaction.sign(trusterPair);

  const transactionRes = await server.submitTransaction(transaction);

  log.info('trustAssets', `Url:${transactionRes._links.transaction.href}`);

}

module.exports = {
  showBalance,
  payment,
  trustAssets
};
