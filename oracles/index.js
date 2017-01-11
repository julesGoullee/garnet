require('./../config/globalConfig');

const Oracle = require('../oracles/realWorld');
const oracle = new Oracle();

oracle.update();
