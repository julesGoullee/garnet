const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT, SERVER_CONFIG } = require('../config');
const server = new Stellar.Server(HORIZON_ENDPOINT, SERVER_CONFIG);
const { assetInstance } = require('../modules/asset');

async function loadAccountFromSeed(seed){

  const pair = Stellar.Keypair.fromSeed(seed);
  const accountId = pair.accountId();
  const account = await server.loadAccount(accountId).catch(err => log.error('loadAccount', err) );

  log.info('loadAccount', `BotAccountId:${accountId}`);

  return {
    pair,
    account
  };

}

function patchAccount(account){

  account.balances.forEach( (balance) => {

    balance.asset = assetInstance(balance);

  });

  return account;

}

async function loadAccount(accountId){

  const account = await server.loadAccount(accountId);

  log.info('loadAccount', `AccountId:${accountId}`);

  return patchAccount(account);

}

module.exports = {
  loadAccount, loadAccountFromSeed, patchAccount
};
