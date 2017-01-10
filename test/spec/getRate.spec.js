/* eslint max-nested-callbacks:[2, 5], array-callback-return: 0, camelcase: 0 */

const getRate = require('../../modules/getPrice');
const { assetInstance } = require('../../modules/utils');

describe('getPrice', () => {

  it('Should get price', async () => {

    const wallet = {
      balance: '500.0000000',
      limit: '10000',
      asset_type: 'credit_alphanum4',
      asset_code: 'AS1',
      asset_issuer: 'AS1_ISSUER',
      asset: assetInstance({
        asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
      })
    };

    const walletTrade = {
      balance: '944.0000000',
      limit: '10000',
      asset_type: 'credit_alphanum4',
      asset_code: 'AS2',
      asset_issuer: 'AS2_ISSUER',
      asset: assetInstance({
        asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
      })
    };

    const rate = await getRate(wallet, walletTrade);

    expect(rate.amount.toString() ).to.equals('400');
    expect(rate.value.toString() ).to.equals('0.7');

  });

  it('Should get native price', async () => {

    const wallet = {
      balance: '500.0000000',
      limit: '10000',
      asset_type: 'credit_alphanum4',
      asset_code: 'AS1',
      asset_issuer: 'AS1_ISSUER',
      asset: assetInstance({
        asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
      })
    };

    const walletTrade = {
      balance: '1000.0000000',
      limit: '10000',
      asset_type: 'native',
      asset: assetInstance({ asset_type: 'native' })
    };

    const rate = await getRate(wallet, walletTrade);

    expect(rate.amount.toString() ).to.equals('400');
    expect(rate.value.toString() ).to.equals('1.1');

  });

  it('Should set native price', async () => {

    const wallet = {
      balance: '1000.0000000',
      limit: '10000',
      asset_type: 'native',
      asset: assetInstance({ asset_type: 'native' })
    };

    const walletTrade = {
      balance: '500.0000000',
      limit: '10000',
      asset_type: 'credit_alphanum4',
      asset_code: 'AS1',
      asset_issuer: 'AS1_ISSUER',
      asset: assetInstance({
        asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
      })
    };

    const rate = await getRate(wallet, walletTrade);

    expect(rate.amount.toString() ).to.equals('500');
    expect(rate.value.toString() ).to.equals('1.4');

  });

});
