const log = require('npmlog');
const BigNumber = require('bignumber.js');
const { assetUid } = require('../modules/asset');

function showWallets(account){

  return account.balances.map(wallet => `${assetUid(wallet.asset)}|Balance:${wallet.balance}`); // eslint-disable-line no-confusing-arrow, max-len

}

function getUpWallets(wallets){

  return wallets.reduce( (acc, wallet) => {

    const bnBalance = new BigNumber(wallet.balance);

    if(!bnBalance.isNegative() && !bnBalance.isZero() ){

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
