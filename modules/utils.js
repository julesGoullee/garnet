const BigNumber = require('bignumber.js');

function sleep(time){

  return new Promise(resolve => setTimeout(resolve, time) );

}

function parseAsync(jsonRes){

  return Promise.resolve(JSON.parse(jsonRes) );

}

const ten = new BigNumber(10);

function priceToNumber(price){

  const nPrecision = price.n.split('.')[1] ? price.n.split('.')[1].length : 0;
  const dPrecision = price.d.split('.')[1] ? price.d.split('.')[1].length : 0;

  return {
    n: new BigNumber(price.n).mul(ten.pow(nPrecision >= dPrecision ? nPrecision : nPrecision + (dPrecision - nPrecision) ) ).toNumber(),
    d: new BigNumber(price.d).mul(ten.pow(dPrecision >= nPrecision ? dPrecision : dPrecision + (nPrecision - dPrecision) ) ).toNumber()
  };

}

module.exports = {
  sleep,
  parseAsync,
  priceToNumber
};
