const { priceToNumber } = require('../../modules/utils');

describe('PriceToNumber', () => {

  it('Should get int', () => {

    expect(priceToNumber({
      n: '1', d: '2'
    }) ).to.deep.equals({
      n: 1, d: 2
    });

  });

  it('Should get equals precision', () => {

    expect(priceToNumber({
      n: '1.2345', d: '2.2345'
    }) ).to.deep.equals({
      n: 12345, d: 22345
    });

  });

  it('Should get int & float', () => {

    expect(priceToNumber({
      n: '1.2345', d: '2'
    }) ).to.deep.equals({
      n: 12345, d: 20000
    });

  });

  it('Should get different precisions', () => {

    expect(priceToNumber({
      n: '1.2345', d: '2.234567'
    }) ).to.deep.equals({
      n: 1234500, d: 2234567
    });

  });

  it('Should get different precisions', () => {

    expect(priceToNumber({
      n: '1.23456789', d: '2.34'
    }) ).to.deep.equals({
      n: 123456789, d: 234000000
    });

  });

});

