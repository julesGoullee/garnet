/* eslint-disable no-process-env */

const dataAccounts = require('../data/accounts.json');

module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  HORIZON_ENDPOINT: process.env.HORIZON || 'https://horizon-testnet.stellar.org',
  BOT_CHECK_BALANCE_TIMER: process.env.BOT_CHECK_BALANCE_TIMER || 5000,
  ORACLE_CHECK_PRICE_TIMER: process.env.ORACLE_CHECK_PRICE_TIMER || 50000,
  SEED: process.env.SEED || dataAccounts.bot.seed,
  DB_HOST: process.env.DB_HOST || '127.0.0.1'
};
