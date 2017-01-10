const log = require('npmlog');
const Decimal = require('decimal.js');
const { assetUid } = require('../modules/asset');

function showWallets(account){

  return account.balances.map(wallet => `${assetUid(wallet.asset)}|Balance:${wallet.balance}`); // eslint-disable-line no-confusing-arrow, max-len

}

function getUpWallets(wallets){

  return wallets.reduce( (acc, wallet) => {

    const bnBalance = new Decimal(wallet.balance);

    if(bnBalance.isPositive() && !bnBalance.isZero() ){

      log.info('upWallet', `${assetUid(wallet.asset)}|Balance:${wallet.balance}`);
      acc.push(wallet);

    }

    return acc;

  }, []);

}

module.exports = {
  showWallets,
  getUpWallets
};
