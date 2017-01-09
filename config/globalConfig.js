const bluebird = require('bluebird');

global.Promise = bluebird;
const log = require('npmlog');
const config = require('./index');
const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
log.level = config.ENV === 'production' ? 'info' : 'silly';
log.on('log', (mess) => {

  mess.prefix = `[${new Date().toUTCString()}][${mess.prefix}]`;

  return mess;

});
