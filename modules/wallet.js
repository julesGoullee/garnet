const log = require('npmlog');
const Decimal = require('decimal.js');

function showAssetCode(asset){

  return asset.isNative() ? 'XLM_NATIVE' : `${asset.code} - ${asset.issuer}`;

}


function showWallets(account){

  return account.balances.map(wallet => `${showAssetCode(wallet.asset)}|Balance:${wallet.balance}`); // eslint-disable-line no-confusing-arrow, max-len

}

function getUpWallets(wallets){

  return wallets.reduce( (acc, wallet) => {

    const bnBalance = new Decimal(wallet.balance);

    if(bnBalance.isPositive() && !bnBalance.isZero() ){

      log.info('upWallet', `${showAssetCode(wallet.asset)}|Balance:${wallet.balance}`);
      acc.push(wallet);

    }

    return acc;

  }, []);

}

module.exports = {
  showAssetCode,
  showWallets,
  getUpWallets
};
