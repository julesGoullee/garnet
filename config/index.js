/* eslint-disable no-process-env */

module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  HORIZON_ENDPOINT: process.env.HORIZON || 'https://horizon-testnet.stellar.org',
  SERVER_CONFIG: { allowHttp: true },
  BOT_CHECK_BALANCE_TIMER: process.env.BOT_CHECK_BALANCE_TIMER || 5,
  ORACLE_CHECK_PRICE_TIMER: process.env.ORACLE_CHECK_PRICE_TIMER || 5,
  TRANSACTION_MAX_TIME: 7000,
  DB_HOST: process.env.DB_HOST || '127.0.0.1'
};
