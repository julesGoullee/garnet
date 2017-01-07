const bluebird = require('bluebird');

global.Promise = bluebird;
const log = require('npmlog');
const config = require('./index');

log.level = config.ENV === 'production' ? 'info' : 'silly';
log.on('log', (mess) => {

  mess.prefix = `[${new Date().toUTCString()}][${mess.prefix}]`;

  return mess;

});
