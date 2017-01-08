module.exports = function filterOffers(offers, assetSelling, assetBuying){

  return offers.filter(offer => assetSelling.equals(offer.selling.asset) && assetBuying.equals(offer.buying.asset) );

};
