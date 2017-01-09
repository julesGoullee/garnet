/* eslint max-nested-callbacks:[2, 5], array-callback-return: 0, camelcase: 0 */

const getRate = require('../../modules/getRate');
const { assetInstance } = require('../../modules/utils');

describe('getRate', () => {

  it('Should get rate', async () => {

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

    const result = await getRate(wallet, walletTrade);

    expect(result.amount.toString() ).to.equals('400');
    expect(result.rate.toString() ).to.equals('0.7');

  });

  it('Should get native rate', async () => {

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

    const result = await getRate(wallet, walletTrade);

    expect(result.amount.toString() ).to.equals('400');
    expect(result.rate.toString() ).to.equals('1.1');

  });

  it('Should set native rate', async () => {

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

    const result = await getRate(wallet, walletTrade);

    expect(result.amount.toString() ).to.equals('500');
    expect(result.rate.toString() ).to.equals('1.4');

  });

});
