const { Asset } = require('stellar-sdk');

function sleep(time){

  return new Promise(resolve => setTimeout(resolve, time) );

}

function assetInstance(asset){

  if(asset instanceof Asset){

    return asset;

  }

  if(asset.asset_type === 'native'){

    return Asset.native();

  }

  return new Asset(asset.asset_code, asset.asset_issuer);

}

module.exports = {
  sleep,
  assetInstance
};
