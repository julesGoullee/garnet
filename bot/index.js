require('./../config/globalConfig');

const Oracle = require('../oracles/simple');
const Bot = require('./Bot');

const dataAccounts = require('../data/accounts.json');

const seed = process.env.SEED || dataAccounts.bot.seed;
const oracle = new Oracle();

oracle.update();

const bot = new Bot(seed, oracle);

bot.run();
