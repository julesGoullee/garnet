/* eslint-disable no-process-env */

module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  HORIZON_ENDPOINT: 'https://horizon-testnet.stellar.org',
  BOT_CHECK_BALANCE_TIMER: process.env.BOT_CHECK_BALANCE_TIMER || 5000
};
