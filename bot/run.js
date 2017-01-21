require('./../config/globalConfig');

const Oracle = require('../oracles/simple2');
const Bot = require('./');
const dataAccounts = require('../data/accounts.json');

const oracle = new Oracle();

// oracle.update();

const bot = new Bot(dataAccounts.bot.seed, oracle);

bot.run();
