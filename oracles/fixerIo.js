/* eslint-disable class-methods-use-this */
/* eslint-disable no-async-without-await/no-async-without-await */
/* eslint-disable no-unused-vars */
require('../config/globalConfig');
const log = require('npmlog');
const rp = require('request-promise');
const apiUrl = 'http://api.fixer.io/latest?symbols=';
const { parseAsync } = require('../modules/utils');
const { assetUid } = require('../modules/asset');

function apiCall(assetSelling, assetBuying){

  return rp(`${apiUrl}${assetSelling.code},${assetBuying.code}&base=${assetSelling.code}`);

}

function updatePrices(assetSelling, assetBuying){

  return new Promise( (resolve) => {

    apiCall(assetSelling, assetBuying)
      .then(parseAsync)
      .then(priceRes => priceRes.rates[Object.keys(priceRes.rates)[0]])
      .catch( (err) => {

        if(err.error.includes('Invalid base') ){

          log.error('updatePrices', `NotFound|assetSelling:${assetUid(assetSelling)}`);

        } else{

          log.error('updatePrices', err);

        }

        resolve(false);

      });

  });

}

class Oracle {

  async getPrice(assetSelling, assetBuying){

    const price = await updatePrices(assetSelling, assetBuying);

    log.info('updatePrices', `assetSelling:${assetUid(assetSelling)}|Price:${price}|assetBuying:${assetUid(assetBuying)}`);

    return price || 0;

  }

  async getAmount(wallet){

    if(wallet.asset.isNative() ){

      return 0;

    }

    return wallet.balance;

  }

}

module.exports = Oracle;
