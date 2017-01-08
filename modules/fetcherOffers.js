const Stellar = require('stellar-sdk');
const { HORIZON_ENDPOINT } = require('../config');
const server = new Stellar.Server(HORIZON_ENDPOINT);

module.exports = async function fetchOffers(account){

  const resOffers = await server.offers('accounts', account.id).order('asc').call();

  return Array.isArray(resOffers.records) ? resOffers.records : [];

};
