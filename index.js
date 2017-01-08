require('./config/globalConfig');
const StellarSdk = require('stellar-sdk');
const log = require('npmlog');
const { HORIZON_ENDPOINT, BOT_CHECK_BALANCE_TIMER } = require('./config');
const { sleep, showBalance, bulkOperations, getTransactionUrl, deleteOfferOp } = require('./accounts/utils');
const dataAccounts = require('./data/accounts.json');
const server = new StellarSdk.Server(HORIZON_ENDPOINT);
const Decimal = require('decimal.js');

const startTime = Date.now();

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

async function loopCheckBalance(botAccount, botPair){

  const newAccount = await server.loadAccount(botAccount.id);

  log.info('loopCheck', `Balance:${showBalance(newAccount)}|Time:${(Date.now() - startTime) / 1000}`);

  const resOffers = await server.offers('accounts', newAccount.id).call();

  let actualOffers = [...resOffers.records];

  log.info('offer', `Actual:${actualOffers.length}`);

  const upWallets = getUpWallets(newAccount.balances);

  if(upWallets.length > 0){

    let ops = upWallets.reduce( (acc, upWallet) => {

      const asset = new StellarSdk.Asset(upWallet.asset_code, upWallet.asset_issuer);
      const buyingAssetsData = dataAccounts.issuers.filter(issuer => issuer.account.accountId !== asset.issuer || issuer.asset !== asset.code);

      return acc.concat(buyingAssetsData.reduce( (acc, buyingAssetData) => {

        const buyingAsset = new StellarSdk.Asset(buyingAssetData.asset, buyingAssetData.account.accountId);
        const lastOffers = actualOffers.filter(actualOffer => asset.issuer === actualOffer.selling.asset_issuer &&
          asset.code === actualOffer.selling.asset_code &&
          buyingAsset.issuer === actualOffer.buying.asset_issuer &&
          buyingAsset.code === actualOffer.buying.asset_code);

        if(lastOffers.length > 0){

          const lastOffer = lastOffers[0];

          if(lastOffers.length > 1){

            const lastOffersCurrentToRemove = [...lastOffers].splice(1, lastOffers.length);

            acc.concat(lastOffersCurrentToRemove.map(deleteOfferOp) );

          }

          actualOffers = actualOffers.filter(actualOffer => lastOffers.find(findLastOffer => findLastOffer.id !== actualOffer.id) );

          const bnLastOfferAmount = new Decimal(lastOffer.amount);
          const bnNewOfferAmount = new Decimal(upWallet.balance);

          if(bnLastOfferAmount.equals(bnNewOfferAmount) ){

            log.info('offer', `NothingChangeOffer|Selling:${asset.code}-${asset.issuer}|Buying:${lastOffer.buying.asset_code}-${lastOffer.buying.asset_issuer}|Balance:${upWallet.balance}`); // eslint-disable-line max-len

          } else{

            log.info('offer', `UpdateOffer|Selling:${asset.code}-${asset.issuer}|Buying:${lastOffer.buying.asset_code}-${lastOffer.buying.asset_issuer}|Score:${upWallet.balance - lastOffer.amount}`); // eslint-disable-line max-len

            return acc.concat(StellarSdk.Operation.manageOffer({
              selling: asset,
              buying: buyingAsset,
              amount: upWallet.balance,
              price: '1',
              offerId: lastOffer.id
            }) );

          }

          return acc;

        }

        log.info('offer', `NewOffer|Selling:${asset.code}-${asset.issuer}|Buying:${buyingAsset.code}-${buyingAsset.issuer}|Balance:${upWallet.balance}`); // eslint-disable-line max-len

        return acc.concat(StellarSdk.Operation.createPassiveOffer({
          selling: asset,
          buying: buyingAsset,
          amount: upWallet.balance,
          price: '1',
          offerId: 0
        }) );

      }, []) );

    }, []);

    if(actualOffers.length > 0){

      ops = ops.concat(actualOffers.map(deleteOfferOp) );

    }

    if(ops.length > 0){

      log.info('transaction', `Send:${ops.length} operations`);

      const transactionBuilder = new StellarSdk.TransactionBuilder(newAccount);

      bulkOperations(transactionBuilder, ops);
      const transaction = transactionBuilder.build();

      transaction.sign(botPair);

      const transactionRes = await server.submitTransaction(transaction);

      log.info('transaction', `Url:${getTransactionUrl(transactionRes)}`);

    }


  }

  await sleep(BOT_CHECK_BALANCE_TIMER);

  return loopCheckBalance(botAccount, botPair);

}

async function loadAccount(){

  const botPair = StellarSdk.Keypair.fromSeed(dataAccounts.bot.seed);
  const botAccount = await server.loadAccount(dataAccounts.bot.accountId);

  loopCheckBalance(botAccount, botPair).catch(err => log.info('loopCheckBalance', err) );

}

loadAccount().then( () => {

}).catch(err => log.info('loadAccount', err) );
