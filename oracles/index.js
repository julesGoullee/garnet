const log = require('npmlog');
const { ORACLE_CHECK_PRICE_TIMER } = require('../config');
const { sleep } = require('../modules/utils');

class Oracle {

  constructor({ checkPriceTimer = ORACLE_CHECK_PRICE_TIMER, bidNative = false, pricesHash = {}, autoRun = false }){

    this.run = false;
    this.pricesHash = pricesHash;
    this.checkPriceTimer = checkPriceTimer;
    this.bidNative = bidNative;

    if(autoRun){

      this.update();

    }

  }

  async getPrice(assetSelling, assetBuying){

    if(assetSelling.isNative() && !this.bidNative){

      return false;

    }

    if(typeof this.pricesHash[assetSelling.code] === 'object' && typeof this.pricesHash[assetSelling.code][assetBuying.code] === 'object'){

      // log.info('getPrice', `assetSelling:${assetUid(assetSelling)}|Price:${0}|assetBuying:${assetUid(assetBuying)}`);

      return this.pricesHash[assetSelling.code][assetBuying.code];

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

    log.info('updatePrices', `${assetSelling.code}-${assetBuying.code}:${price.n}/${price.d}`);

    this.pricesHash[assetSelling.code][assetBuying.code] = price;

  }

  async getAmount(wallet){ // eslint-disable-line class-methods-use-this

    if(wallet.asset.isNative() ){

      return false;

    }

    return wallet.balance;

  }

  async update(){

    this.run = true;

    while(this.run){

      await this.updatePrices().catch(err => log.error('updatePrices', err) );

      await sleep(this.checkPriceTimer * 1000);

    }

  }

}

module.exports = Oracle;
