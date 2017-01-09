const log = require('npmlog');
const { DB_HOST } = require('../config');
const redis = require('redis');
const client = redis.createClient({ host: DB_HOST });
const Decimal = require('decimal.js');

function magicChoice(balance, bnRate, bnPerc, bnMin){

  const bnBalance = new Decimal(balance);
  const amountPerc = bnPerc.mul(bnBalance);
  const amountMin = bnBalance.sub(bnMin);

  if(amountPerc.greaterThan(amountMin) && amountPerc.isPositive() && !amountPerc.isZero() ){

    return {
      amount: amountPerc,
      rate: bnRate
    };

  } else if(amountMin.isPositive() && !amountMin.isZero() ){

    return {
      amount: amountMin,
      rate: bnRate
    };

  }

  log.info('getRate', `NoTrade|bgMin:${bnMin}|bgPerc${bnPerc}|Rate:${bnRate.toString()}|Balance:${balance}`);

  return false;

}

module.exports = async function rate(wallet, walletTrade){ // eslint-disable-line max-statements, complexity

  const key = `${wallet.asset.isNative() ? 'NATIVE-' : ''}${wallet.asset.getCode()}:${walletTrade.asset.isNative() ? 'NATIVE-' : ''}${walletTrade.asset.getCode()}`; // eslint-disable-line max-len
  const rateRes = await client.hmgetAsync(key, 'rate');

  if(typeof rateRes[0] !== 'string'){

    log.error('getRate', `NoRate:${key}|Balance:${wallet.balance}`);

    return false;

  }

  const bnRate = new Decimal(rateRes[0]);
  const assetKey = `${wallet.asset.isNative() ? 'NATIVE-' : ''}${wallet.asset.getCode()}`;
  const assetRes = await client.hmgetAsync(assetKey, 'min', 'perc');

  if(assetRes.length < 2 || typeof assetRes[0] !== 'string' || assetRes[0].length < 1 || typeof assetRes[1] !== 'string' || assetRes[1].length < 1){

    log.error('getRate', `NoAssetKey|Rate:${bnRate.toString()}|Balance:${wallet.balance}|AssetKey:${assetKey}`);

    return false;

  }

  const bnMin = new Decimal(assetRes[0]);
  const bnPerc = new Decimal(assetRes[1]);

  if(bnRate.isNaN() || bnPerc.isNaN() ){

    log.error('getRate', `bgMin or bgPerc NaN|bgMin:${bnMin}|bgPerc${bnPerc}|Rate:${bnRate.toString()}|Balance:${wallet.balance}|assetKey:${assetKey}`); // eslint-disable-line max-len

    return false;

  }

  return magicChoice(wallet.balance, bnRate, bnPerc, bnMin);

};
