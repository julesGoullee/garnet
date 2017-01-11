const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT } = require('../config');

const server = new Stellar.Server(HORIZON_ENDPOINT);
const { bulkOperations, getTransactionUrl } = require('./transaction');

function assetInstance(asset){

  if(asset instanceof Stellar.Asset){

    return asset;

  }

  if(asset.asset_type === 'native'){

    return Stellar.Asset.native();

  }

  return new Stellar.Asset(asset.asset_code, asset.asset_issuer);

}

function assetUid(rawAsset){

  const asset = assetInstance(rawAsset);

  if(asset.isNative() ){

    return 'native';
  
  }
  let str = 'custom:';

  str += asset.getCode();
  str += ':';
  str += asset.getIssuer();
  
  return str;

}

async function trustAssets(trusterAccount, trusterPair, assets){

  const transactionBuilder = new Stellar.TransactionBuilder(trusterAccount);
  const changeTrustOps = assets.map(asset => Stellar.Operation.changeTrust({ asset }) );

  bulkOperations(transactionBuilder, changeTrustOps);

  const transaction = transactionBuilder.build();

  transaction.sign(trusterPair);

  const transactionRes = await server.submitTransaction(transaction);

  log.info('trustAssets', `Url:${getTransactionUrl(transactionRes)}`); // eslint-disable-line no-underscore-dangle

}


module.exports = {
  assetInstance,
  assetUid,
  trustAssets
};
