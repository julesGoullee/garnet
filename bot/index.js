require('./../config/globalConfig');

const Oracle = require('../oracles/realWorld');
const Bot = require('./Bot');

const dataAccounts = require('../data/accounts.json');

const seed = dataAccounts.bot.seed;
const oracle = new Oracle();

oracle.update();

const bot = new Bot(seed, oracle);

bot.run();
