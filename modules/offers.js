const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT } = require('../config');
const server = new Stellar.Server(HORIZON_ENDPOINT);
const { assetInstance } = require('../modules/utils');
const { showAssetCode } = require('../modules/wallet');

function deleteOfferOperation(offer){

  log.info('offer', `Delete|assetSelling:${showAssetCode(offer.selling.asset)}|assetBuying:${showAssetCode(offer.buying.asset)}|LastAmount:${offer.amount}`); // eslint-disable-line max-len

  return Stellar.Operation.manageOffer({
    selling: offer.selling.asset,
    buying: offer.buying.asset,
    amount: '0',
    price: '1',
    offerId: offer.id
  });

}

function removePrevUpOffers(prevSameOffers){

  if(prevSameOffers.length > 1){

    const lastOffersCurrentToRemove = [...prevSameOffers].splice(1, prevSameOffers.length);

    return lastOffersCurrentToRemove.map(lastOfferCurrentToRemove => deleteOfferOperation(lastOfferCurrentToRemove) );

  }

  return [];

}


function patchOffers(actualOffers, newAccount){

  actualOffers.forEach( (actualOffer) => {

    actualOffer.buying.asset = assetInstance(actualOffer.buying);
    actualOffer.selling.asset = assetInstance(actualOffer.selling);

  });

  newAccount.balances.forEach( (balance) => {

    balance.asset = assetInstance(balance);

  });

}

async function fetchOffers(account){

  const resOffers = await server.offers('accounts', account.id).order('asc').call();

  return Array.isArray(resOffers.records) ? resOffers.records : [];

}

function filterOffers(offers, assetSelling, assetBuying){

  return offers.filter(offer => assetSelling.equals(offer.selling.asset) && assetBuying.equals(offer.buying.asset) );

}

module.exports = {
  removePrevUpOffers,
  patchOffers,
  fetchOffers,
  filterOffers,
  deleteOfferOperation
};
