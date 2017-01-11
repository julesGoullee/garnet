/* eslint-disable class-methods-use-this */
/* eslint-disable no-async-without-await/no-async-without-await */
/* eslint-disable no-unused-vars */
require('../config/globalConfig');
const log = require('npmlog');
const rp = require('request-promise');
const apiUrlBtc_RealWorld = 'http://api.coindesk.com/v1/bpi/currentprice/EUR.json';
const apiUrlRealWorld = 'http://api.fixer.io/latest?symbols=';
const { parseAsync, sleep } = require('../modules/utils');
const { assetUid } = require('../modules/asset');
const assetCodes = ['EUR', 'USD'];
const btcAssetCode = 'BTC';
const Decimal = require('decimal.js');
const margin = new Decimal('0.001');
const bnOne = new Decimal('1.00000');

function getBtc_RealWorldPrices(){

  return rp(apiUrlBtc_RealWorld)
    .then(parseAsync)
    .then( (res) => {

      const btcToRealWorld = assetCodes.map(asset => ({
        selling: asset,
        buying: btcAssetCode,
        rate: res.bpi[asset].rate
      }) );

      const realWorldToBtc = assetCodes.map(asset => ({
        selling: btcAssetCode,
        buying: asset,
        rate: bnOne.div(new Decimal(res.bpi[asset].rate) ).toPrecision(4)
      }) );

      return btcToRealWorld.concat(realWorldToBtc);

    })
    .catch( (err) => {

      log.error('updatePrices|getBtc_RealWorldPrices', err);

    });

}

function fixerCall(assetSelling, assetBuying){

  return rp(`${apiUrlRealWorld}${assetSelling},${assetBuying}&base=${assetSelling}`)
    .then(parseAsync)
    .then(priceRes => ({
      selling: assetSelling,
      buying: assetBuying,
      rate: priceRes.rates[assetBuying].toPrecision(4)
    }) )
    .catch( (err) => {

      if(err.error.includes('Invalid base') ){

        log.error('updatePrices', `NotFound|assetSellingCode:${assetSelling}`);

      } else{

        log.error('updatePrices', err);

      }

    });

}

function getRealWorldPrices(){

  return Promise.all(assetCodes.reduce( (acc, assetFrom) => {

    const otherAssets = assetCodes.filter(asset => asset !== assetFrom);
    const otherAssetsPrices = otherAssets.map(assetTo => fixerCall(assetFrom, assetTo).catch( (err) => {

      log.error('getRealWorldPrices', err);

    }) );

    return acc.concat(...otherAssetsPrices);

  }, []) );

}

function getLxmBtcPrice(assetSelling, assetBuying){}

class Oracle {

  constructor(){

    this.run = false;
    this.pricesHash = {};

  }

  async getPrice(assetSelling, assetBuying){

    if(assetSelling.isNative() ){

      return false;

    }

    if(typeof this.pricesHash[assetSelling.code] === 'object' && this.pricesHash[assetSelling.code][assetBuying.code] instanceof Decimal){

      // log.info('getPrice', `assetSelling:${assetUid(assetSelling)}|Price:${0}|assetBuying:${assetUid(assetBuying)}`);

      return this.pricesHash[assetSelling.code][assetBuying.code].add(margin).toString();

    }

    return false;

  }

  setPrice(assetSelling, assetBuying, price){

    if(typeof this.pricesHash[assetSelling.code] !== 'object'){

      this.pricesHash[assetSelling.code] = {};

    }

    if(this.pricesHash[assetSelling.code][assetBuying.code] !== 'object'){

      this.pricesHash[assetSelling.code][assetBuying.code] = {};

    }

    log.info('updatePrices', `${assetSelling.code}-${assetBuying.code}:${price}`);

    this.pricesHash[assetSelling.code][assetBuying.code] = new Decimal(price);

  }

  async getAmount(wallet){

    if(wallet.asset.isNative() ){

      return 0;

    }

    return wallet.balance;

  }

  async update(){

    this.run = true;

    while(this.run){

      await this.updatePrices().catch(err => log.error('updatePrices', err) );

      await sleep(5000);

    }

  }

  async updatePrices(){

    const realWorldPricePromise = getRealWorldPrices()
      .then(realWorldPrice => realWorldPrice.map(price => this.setPrice({ code: price.selling }, { code: price.buying }, price.rate) ) )
      .catch(err => log.info('updatePriceRealWorld', err) );

    const realWorldPriceBtcPromise = getBtc_RealWorldPrices()
      .then(realWorldPrice => realWorldPrice.map(price => this.setPrice({ code: price.selling }, { code: price.buying }, price.rate) ) )
      .catch(err => log.info('updatePriceRealWorldBtc', err) );

    // const lxmBtcPricePromise = getLxmBtcPrice().then( (lxmBtcPrice) => {
    //
    //   prices.push(lxmBtcPrice);
    //
    // }).catch(err => log.info('updatePriceLxmBtc', err) );


    return Promise.all([
      realWorldPricePromise,
      realWorldPriceBtcPromise,
      // lxmBtcPricePromise
    ]);

  }

}

module.exports = Oracle;
