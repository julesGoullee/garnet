const log = require('npmlog');
const Decimal = require('decimal.js');

function getUpWallets(wallets){

  return wallets.reduce( (acc, wallet) => {

    const bnBalance = new Decimal(wallet.balance);

    if(bnBalance.isPositive() && !bnBalance.isZero() && wallet.asset_type !== 'native'){

      log.info('upWallet', `${wallet.asset_code} - ${wallet.asset_issuer}|Balance:${wallet.balance}`);
      acc.push(wallet);

    }

    return acc;

  }, []);

}

function showWallets(account){

  return account.balances.map(wallet => wallet.asset_code ? `${wallet.asset_code} - ${wallet.balance} ` : ` XLM:${wallet.balance} `); // eslint-disable-line no-confusing-arrow, max-len

}

module.exports = {
  getUpWallets,
  showWallets
};
