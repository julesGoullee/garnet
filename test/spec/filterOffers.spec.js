/* eslint max-nested-callbacks:[2, 5], array-callback-return: 0, camelcase: 0 */

const Stellar = require('stellar-sdk');
const { filterOffers } = require('../../modules/offers');
const { assetInstance } = require('../../modules/asset');

describe('filterOffers', () => {

  describe('One match', () => {

    it('Should one match', () => {

      const assetSelling = new Stellar.Asset('AS1', 'AS1_ISSUER');
      const assetBuying = new Stellar.Asset('AS2', 'AS2_ISSUER');

      const offers = [
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 1,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
            })
          },
          amount: '250.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      expect(filterOffers(offers, assetSelling, assetBuying) ).to.deep.equals([offers[0]]);

    });

    it('Should not match only same selling code', () => {

      const assetSelling = new Stellar.Asset('AS1', 'AS1_ISSUER');
      const assetBuying = new Stellar.Asset('AS2', 'AS2_ISSUER');

      const offers = [
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 1,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUERFAKE',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUERFAKE'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
            })
          },
          amount: '250.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      expect(filterOffers(offers, assetSelling, assetBuying) ).to.deep.equals([]);

    });

    it('Should not match only same selling issuer', () => {

      const assetSelling = new Stellar.Asset('AS1', 'AS1_ISSUER');
      const assetBuying = new Stellar.Asset('AS2', 'AS2_ISSUER');

      const offers = [
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 1,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2FAKE',
            asset_issuer: 'AS2_ISSUER',
            asset: assetInstance({
              asset_code: 'AS2FAKE', asset_issuer: 'AS2_ISSUER'
            })
          },
          amount: '250.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      expect(filterOffers(offers, assetSelling, assetBuying) ).to.deep.equals([]);

    });

    it('Should not match only same selling code', () => {

      const assetSelling = new Stellar.Asset('AS1', 'AS1_ISSUER');
      const assetBuying = new Stellar.Asset('AS2', 'AS2_ISSUER');

      const offers = [
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 1,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUERFake',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUERFake'
            })
          },
          amount: '250.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      expect(filterOffers(offers, assetSelling, assetBuying) ).to.deep.equals([]);

    });

    it('Should match one into other', () => {

      const assetSelling = new Stellar.Asset('AS1', 'AS1_ISSUER');
      const assetBuying = new Stellar.Asset('AS2', 'AS2_ISSUER');

      const offers = [
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 1,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUERFake',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUERFake'
            })
          },
          amount: '250.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        },
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/2' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 1,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          amount: '0.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      expect(filterOffers(offers, assetSelling, assetBuying) ).to.deep.equals([]);

    });

  });

  describe('Multiple match', () => {

    it('Should multiple match', () => {

      const assetSelling = new Stellar.Asset('AS1', 'AS1_ISSUER');
      const assetBuying = new Stellar.Asset('AS2', 'AS2_ISSUER');

      const offers = [
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 1,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
            })
          },
          amount: '250.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        },
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 2,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
            })
          },
          amount: '255.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      expect(filterOffers(offers, assetSelling, assetBuying) ).to.deep.equals([offers[0], offers[1]]);

    });

    it('Should multiple match into other', () => {

      const assetSelling = new Stellar.Asset('AS1', 'AS1_ISSUER');
      const assetBuying = new Stellar.Asset('AS2', 'AS2_ISSUER');

      const offers = [
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 1,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
            })
          },
          amount: '250.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        },
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 1,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
            })
          },
          amount: '255.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        },
        {
          _links: {
            self: { href: 'https://horizon-testnet.stellar.org/offers/1' },
            offer_maker: { href: 'https://horizon-testnet.stellar.org/accounts/BOT_ACCOUNT_ID' }
          },
          id: 2,
          paging_token: '1',
          seller: 'BOT_ACCOUNT_ID',
          selling: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER',
            asset: assetInstance({
              asset_code: 'AS2', asset_issuer: 'AS2_ISSUER'
            })
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER',
            asset: assetInstance({
              asset_code: 'AS1', asset_issuer: 'AS1_ISSUER'
            })
          },
          amount: '255.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      expect(filterOffers(offers, assetSelling, assetBuying) ).to.deep.equals([offers[0], offers[1]]);

    });

  });

});
