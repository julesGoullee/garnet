const log = require('npmlog');
const Stellar = require('stellar-sdk');

module.exports = function deleteOfferOperation(offer){

  const assetSelling = new Stellar.Asset(offer.selling.asset_code, offer.selling.asset_issuer);
  const assetBuying = new Stellar.Asset(offer.buying.asset_code, offer.buying.asset_issuer);

  log.info('offer', `Delete|assetSelling:${assetSelling.code}-${assetSelling.issuer}|assetBuying:${assetBuying.code}-${assetBuying.issuer}|LastAmount:${offer.amount}`); // eslint-disable-line max-len

  return Stellar.Operation.manageOffer({
    selling: assetSelling,
    buying: assetBuying,
    amount: '0',
    price: '1',
    offerId: offer.id
  });

};
