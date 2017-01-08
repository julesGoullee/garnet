require('./../config/globalConfig');
const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT } = require('../config');
const dataAccounts = require('../data/accounts.json');
const { loopTrade } = require('./trade');

const server = new Stellar.Server(HORIZON_ENDPOINT);

async function loadAccount(){

  const botPair = Stellar.Keypair.fromSeed(dataAccounts.bot.seed);
  const botAccount = await server.loadAccount(dataAccounts.bot.accountId);

  log.info('loadAccount', `BotAccountId:${dataAccounts.bot.accountId}`);
  loopTrade(botAccount, botPair).catch(err => log.info('loopTrade', err) );

}

loadAccount().then( () => {

}).catch(err => log.info('loadAccount', err) );
