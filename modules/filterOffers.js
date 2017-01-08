module.exports = function filterOffers(offers, assetSelling, assetBuying){

  return offers.filter(offer => assetSelling.issuer === offer.selling.asset_issuer &&
    assetSelling.code === offer.selling.asset_code &&
    assetBuying.issuer === offer.buying.asset_issuer &&
    assetBuying.code === offer.buying.asset_code &&
    assetSelling.asset_type !== 'native');

};
