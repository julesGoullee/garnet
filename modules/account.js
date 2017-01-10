const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT } = require('../config');
const server = new Stellar.Server(HORIZON_ENDPOINT);
const { assetInstance } = require('../modules/utils');

async function loadAccountFromSeed(seed){

  const botPair = Stellar.Keypair.fromSeed(seed);
  const accountId = botPair.accountId();
  const botAccount = await server.loadAccount(accountId);

  log.info('loadAccount', `BotAccountId:${accountId}`);

  return {
    botPair,
    botAccount
  };

}

async function loadAccount(accountId){

  const account = await server.loadAccount(accountId);

  log.info('loadAccount', `AccountId:${accountId}`);

  return patchAccount(account);

}

function patchAccount(account){

  account.balances.forEach( (balance) => {

    balance.asset = assetInstance(balance);

  });

  return account;

}

module.exports = { loadAccount, loadAccountFromSeed, patchAccount };
