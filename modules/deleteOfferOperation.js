const log = require('npmlog');
const Stellar = require('stellar-sdk');
const { showAssetCode } = require('../modules/wallet');

module.exports = function deleteOfferOperation(offer){

  log.info('offer', `Delete|assetSelling:${showAssetCode(offer.selling.asset)}|assetBuying:${showAssetCode(offer.buying.asset)}|LastAmount:${offer.amount}`); // eslint-disable-line max-len

  return Stellar.Operation.manageOffer({
    selling: offer.selling.asset,
    buying: offer.buying.asset,
    amount: '0',
    price: '1',
    offerId: offer.id
  });

};
