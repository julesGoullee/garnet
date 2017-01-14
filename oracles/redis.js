const Decimal = require('decimal.js');
const log = require('npmlog');
const { DB_HOST } = require('../config/index');
const redis = require('redis');
const client = redis.createClient({ host: DB_HOST });

function magicChoice(balance, bnRate, bnPerc, bnMin){

  const bnBalance = new Decimal(balance);
  const amountPerc = bnPerc.mul(bnBalance);
  const amountMin = bnBalance.sub(bnMin);

  if(amountPerc.greaterThan(amountMin) && amountPerc.isPositive() && !amountPerc.isZero() ){

    return {
      amount: amountPerc,
      value: bnRate
    };

  } else if(amountMin.isPositive() && !amountMin.isZero() ){

    return {
      amount: amountMin,
      value: bnRate
    };

  }

  log.info('getPrice', `NoTrade|bgMin:${bnMin}|bgPerc${bnPerc}|Rate:${bnRate.toString()}|Balance:${balance}`);

  return false;

}

class Oracle {
  static async getPrice(assetSelling, assetBuying){ // eslint-disable-line max-statements, complexity

    const key = `${assetSelling.isNative() ? 'NATIVE-' : ''}${assetBuying.getCode()}:${assetBuying.isNative() ? 'NATIVE-' : ''}${assetBuying.getCode()}`; // eslint-disable-line max-len
    const rateRes = await client.hmgetAsync(key, 'price');

    if(typeof rateRes[0] !== 'string'){

      log.error('getPrice', `NoRate:${key}|Balance:${assetSelling.balance}`);

      return false;

    }

    const bnRate = new Decimal(rateRes[0]);
    const assetKey = `${assetSelling.isNative() ? 'NATIVE-' : ''}${assetSelling.getCode()}`;
    const assetRes = await client.hmgetAsync(assetKey, 'min', 'perc');

    if(assetRes.length < 2 || typeof assetRes[0] !== 'string' || assetRes[0].length < 1 || typeof assetRes[1] !== 'string' || assetRes[1].length < 1){

      log.error('getPrice', `NoAssetKey|Rate:${bnRate.toString()}|Balance:${assetSelling.balance}|AssetKey:${assetKey}`);

      return false;

    }

    const bnMin = new Decimal(assetRes[0]);
    const bnPerc = new Decimal(assetRes[1]);

    if(bnRate.isNaN() || bnPerc.isNaN() ){

      log.error('getPrice', `bgMin or bgPerc NaN|bgMin:${bnMin}|bgPerc${bnPerc}|Rate:${bnRate.toString()}|Balance:${assetSelling.balance}|assetKey:${assetKey}`); // eslint-disable-line max-len

      return false;

    }

    return magicChoice(assetSelling.balance, bnRate, bnPerc, bnMin);

  }

  static async getAmount(wallet){

    const bnActualBalance = new Decimal(wallet.balance);

    return bnActualBalance.isPositive() && !bnActualBalance.isZero() && !wallet.asset.isNative() ? bnActualBalance : new Decimal(0);
  
  }
}

module.exports = Oracle;
