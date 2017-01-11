const log = require('npmlog');
const Decimal = require('decimal.js');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT, BOT_CHECK_BALANCE_TIMER } = require('../config');
const { sleep } = require('../modules/utils');
const server = new Stellar.Server(HORIZON_ENDPOINT);
const { showWallets } = require('../modules/wallet');
const { removePrevUpOffers, deleteOfferOperation, patchOffers, fetchOffers, filterOffers } = require('../modules/offers');
const { submitTransaction } = require('../modules/transaction');
const { loadAccountFromSeed } = require('../modules/account');
const { assetUid } = require('../modules/asset');

class Bot {
  constructor(seed, oracle){

    this.seed = seed;
    this.oracle = oracle;

    try{

      this.keypair = Stellar.Keypair.fromSeed(this.seed);
    
    } catch(e){

      log.error('bot', 'Invalid seed');
      throw e;
    
    }

  }

  async run(){

    this.startTime = Date.now();

    this.account = await loadAccountFromSeed(this.seed);

    let running = true;

    while(running){

      try{

        running = await this.makeOffers();
        await sleep(BOT_CHECK_BALANCE_TIMER);

      } catch(e){

        console.error(e);
        await sleep(BOT_CHECK_BALANCE_TIMER);

        // running = false;
      
      }
    
    }

    return true;
  
  }

  async makeOffers(){

    const newBotAccount = await server.loadAccount(this.keypair.accountId() );
    const actualOffers = await fetchOffers(newBotAccount);

    patchOffers(actualOffers, newBotAccount);

    log.info('offer', `Offers:${actualOffers.length}|Balance:${showWallets(newBotAccount)}|Time:${(Date.now() - this.startTime) / 1000}`); // eslint-disable-line max-len

    const operations = await this.updateOffers(newBotAccount.balances, actualOffers);

    if(operations.length > 0){

      await submitTransaction(operations, newBotAccount, this.keypair);

    }

    return true;
  
  }

  async operationsTradeWallet({ actualOffers, wallet, walletTrade }){

    let operations = [];
    const lastOffers = filterOffers(actualOffers, wallet.asset, walletTrade.asset);
    const bnActualBalance = new Decimal(wallet.balance);
    const price = await this.oracle.getPrice(wallet.asset, walletTrade.asset);

    if(bnActualBalance.isZero() || !price || wallet.asset.isNative() ){

      return lastOffers.map(deleteOfferOperation);

    }

    const updateAmount = await this.oracle.getAmount(wallet);
    const bnUpdateAmount = new Decimal(updateAmount);
    const bnUpdatePrice = new Decimal(price);

    if(lastOffers.length > 0){

      const lastOffer = lastOffers[0];

      const bnActualOfferAmount = new Decimal(lastOffer.amount);
      const bnActualOfferPrice = new Decimal(lastOffer.price);

      operations = operations.concat(removePrevUpOffers(lastOffers) );


      if(bnActualOfferAmount.equals(bnUpdateAmount) && bnActualOfferPrice.equals(bnUpdatePrice) ){

        // log.silly('price', `NothingChangeOffer|Selling:${assetUid(wallet.asset)}|Buying:${assetUid(lastOffer.buying.asset)}|Price:${price}|Balance:${wallet.balance}`); // eslint-disable-line max-len

      } else{

        log.info('price', `UpdateOffer|Selling:${assetUid(wallet.asset)}|Buying:${assetUid(lastOffer.buying.asset)}|Price:${price}|Balance:${wallet.balance}|Amount:${updateAmount}`); // eslint-disable-line max-len

        operations.push(Stellar.Operation.manageOffer({
          selling: wallet.asset,
          buying: walletTrade.asset,
          amount: updateAmount,
          price: price,
          offerId: lastOffer.id
        }) );

      }

    } else{

      log.info('price', `NewOffer|Selling:${assetUid(wallet.asset)}|Buying:${assetUid(walletTrade.asset)}|Price:${price.toString()}|Balance:${wallet.balance}|UpdateAmount:${bnUpdateAmount.toString()}`); // eslint-disable-line max-len

      operations.push(Stellar.Operation.createPassiveOffer({
        selling: wallet.asset,
        buying: walletTrade.asset,
        amount: updateAmount,
        price: price,
        offerId: 0
      }) );

    }

    return operations;

  }

  async updateOffers(wallets, actualOffers){

    if(wallets.length === 0){

      log.info('updateOffers', `No wallets|DeleteActualOffers:${actualOffers.length}`);

      return actualOffers.map(deleteOfferOperation);

    }

    const operationPromises = wallets.reduce( (accWallet, wallet) => {

      const walletsTrade = wallets.filter(otherWallet => otherWallet !== wallet);
      const updateOrCreateOps = walletsTrade.reduce( (accWalletTrade, walletTrade) => {

        return accWalletTrade.concat(this.operationsTradeWallet({
          actualOffers,
          wallet,
          walletTrade
        })
        );

      }, []);

      return accWallet.concat(...updateOrCreateOps);

    }, []);

    const nestedArray = await Promise.all(operationPromises);

    // flatten array

    return Array.prototype.concat.apply(...nestedArray);
  
  }
}

module.exports = Bot;
