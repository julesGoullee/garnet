require('./../config/globalConfig');

const Oracle = require('../oracles/realWorld');
const Bot = require('./Bot');
const { SEED } = require('../config');
const oracle = new Oracle();

oracle.update();

const bot = new Bot(SEED, oracle);

bot.run();
