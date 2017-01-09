/* eslint camelcase: 0 */

require('./../config/globalConfig');
require('./test.config');
const log = require('npmlog');
const redis = require('redis');
const { assetInstance } = require('../modules/utils');

const walletsTrade = [
  {
    min: '100',
    perc: '0.8',
    asset: assetInstance({
      asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
    }),
    rates: [
      {
        asset: assetInstance({
          asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
        }),
        value: '0.7'
      },
      {
        asset: assetInstance({ asset_type: 'native' }),
        value: '1.1'
      }
    ]
  },
  {
    min: '200',
    perc: '0.5',
    asset: assetInstance({
      asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
    }),
    rates: [
      {
        asset: assetInstance({
          asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
        }),
        value: '1.5'
      },
      {
        asset: assetInstance({ asset_type: 'native' }),
        value: '0.4'
      }
    ]
  },
  {
    min: '500',
    perc: '0.1',
    asset: assetInstance({ asset_type: 'native' }),
    rates: [
      {
        asset: assetInstance({
          asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
        }),
        value: '1.4'
      },
      {
        asset: assetInstance({
          asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
        }),
        value: '0.7'
      }
    ]
  }
];

async function launch(){

  const client = await redis.createClient();

  log.info('rateKey', 'FLUSHALL');

  await client.flushallAsync();

  const opts = walletsTrade.reduce( (acc, walletTrade) => {

    const assetKey = `${walletTrade.asset.isNative() ? 'NATIVE-' : ''}${walletTrade.asset.getCode()}`;

    // log.info('assetKey', `${assetKey}|min:${walletTrade.min}|perc:${walletTrade.perc}`);

    acc.push(['hmset', assetKey, 'min', walletTrade.min, 'perc', walletTrade.perc]);

    const rates = walletTrade.rates.map( (rate) => {

      const rateKey = `${walletTrade.asset.isNative() ? 'NATIVE-' : ''}${walletTrade.asset.getCode()}:${rate.asset.isNative() ? 'NATIVE-' : ''}${rate.asset.getCode()}`; // eslint-disable-line max-len

      log.info('rateKey', `${rateKey}|rate:${rate.value}`);

      return ['hmset', rateKey, 'rate', rate.value];

    });

    return acc.concat(rates);

  }, []);

  return client.batch(opts).execAsync();


}

launch().then( () => log.info('launch', 'Success') ).catch(err => log.error('launch', err) );

