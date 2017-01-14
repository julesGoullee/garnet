const redis = require('redis');
const { DB_HOST } = require('../../config/index');

module.exports = function mockCreateClient(){

  return redis.createClient({
    host: DB_HOST,
    prefix: 'TEST:'
  });

};
