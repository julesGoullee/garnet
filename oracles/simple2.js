const Oracle = require('./');
const one = {
  n: 1,
  d: 1
};

class SimpleOracle extends Oracle {

  constructor(){

    const pricesHash = {
      EUR: {
        USD: {
          n: 1,
          d: 1
        },
        JPY: one
      },
      USD: {
        JPY: one,
        EUR: {
          n: 1,
          d: 1
        }
      },
      JPY: {
        EUR: one,
        USD: one
      }
    };

    super({ pricesHash });

  }

}

module.exports = SimpleOracle;
