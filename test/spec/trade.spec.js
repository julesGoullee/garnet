/* eslint max-nested-callbacks:[2, 5], array-callback-return: 0, camelcase: 0 */

const { updateOffers } = require('../../bot/trade');

describe('updateOffers', () => {

  it('Should return empty for zero wallet 0 offer', () => {

    expect(updateOffers([], []) ).to.deep.equals([]);

  });

  describe('Without prev offers', () => {

    describe('Trade empty assets', () => {

      it('Should trade empty asset', () => {

        const wallets = [
          {
            balance: '0.0000000',
            limit: '100000',
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER'
          }
        ];

        expect(updateOffers(wallets, []) ).to.deep.equals([]);

      });

      it('Should trade empty assets', () => {

        const wallets = [
          {
            balance: '0.0000000',
            limit: '100000',
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER'
          },
          {
            balance: '0.0000000',
            limit: '100000',
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER'
          }
        ];

        expect(updateOffers(wallets, []) ).to.deep.equals([]);

      });

    });

    it('Should trade single asset', () => {

      const wallets = [
        {
          balance: '500.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS1',
          asset_issuer: 'AS1_ISSUER'
        },
        {
          balance: '0.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS2',
          asset_issuer: 'AS2_ISSUER'
        }
      ];

      const expectOperations = [
        {
          amount: '500.0000000',
          buying: {
            code: 'AS2',
            issuer: 'AS2_ISSUER'
          },
          offerId: 0,
          price: '1',
          selling: {
            code: 'AS1',
            issuer: 'AS1_ISSUER'
          }
        }
      ];

      expect(updateOffers(wallets, []) ).to.deep.equals(expectOperations);

    });

    it('Should trade two assets with one up wallet', () => {

      const wallets = [
        {
          balance: '500.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS1',
          asset_issuer: 'AS1_ISSUER'
        },
        {
          balance: '0.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS2',
          asset_issuer: 'AS2_ISSUER'
        }
      ];

      const expectOperations = [
        {
          amount: '500.0000000',
          buying: {
            code: 'AS2',
            issuer: 'AS2_ISSUER'
          },
          offerId: 0,
          price: '1',
          selling: {
            code: 'AS1',
            issuer: 'AS1_ISSUER'
          }
        }
      ];

      expect(updateOffers(wallets, []) ).to.deep.equals(expectOperations);

    });

    it('Should trade two assets with up wallets', () => {

      const wallets = [
        {
          balance: '500.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS1',
          asset_issuer: 'AS1_ISSUER'
        },
        {
          balance: '500.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS2',
          asset_issuer: 'AS2_ISSUER'
        }
      ];

      const expectOperations = [
        {
          amount: '500.0000000',
          buying: {
            code: 'AS2',
            issuer: 'AS2_ISSUER'
          },
          offerId: 0,
          price: '1',
          selling: {
            code: 'AS1',
            issuer: 'AS1_ISSUER'
          }
        },
        {
          amount: '500.0000000',
          buying: {
            code: 'AS1',
            issuer: 'AS1_ISSUER'
          },
          offerId: 0,
          price: '1',
          selling: {
            code: 'AS2',
            issuer: 'AS2_ISSUER'
          }
        }
      ];

      expect(updateOffers(wallets, []) ).to.deep.equals(expectOperations);

    });

  });

  describe('With one offers preview peer asset', () => {

    it('Should trade empty assets', () => {

      const wallets = [
        {
          balance: '0.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS1',
          asset_issuer: 'AS1_ISSUER'
        },
        {
          balance: '0.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS2',
          asset_issuer: 'AS2_ISSUER'
        }
      ];

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
            asset_issuer: 'AS1_ISSUER'
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER'
          },
          amount: '500.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      const expectOperations = [
        {
          amount: '0.0000000',
          buying: {
            code: 'AS2',
            issuer: 'AS2_ISSUER'
          },
          offerId: 1,
          price: '1',
          selling: {
            code: 'AS1',
            issuer: 'AS1_ISSUER'
          }
        }
      ];

      expect(updateOffers(wallets, offers) ).to.deep.equals(expectOperations);

    });

    it('Should trade single asset nothing change', () => {

      const wallets = [
        {
          balance: '500.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS1',
          asset_issuer: 'AS1_ISSUER'
        },
        {
          balance: '0.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS2',
          asset_issuer: 'AS2_ISSUER'
        }
      ];

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
            asset_issuer: 'AS1_ISSUER'
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER'
          },
          amount: '500.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      expect(updateOffers(wallets, offers) ).to.deep.equals([]);

    });

    it('Should update one offer', () => {

      const wallets = [
        {
          balance: '500.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS1',
          asset_issuer: 'AS1_ISSUER'
        },
        {
          balance: '0.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS2',
          asset_issuer: 'AS2_ISSUER'
        }
      ];

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
            asset_issuer: 'AS1_ISSUER'
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER'
          },
          amount: '250.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      const expectOperations = [
        {
          amount: '500.0000000',
          buying: {
            code: 'AS2',
            issuer: 'AS2_ISSUER'
          },
          offerId: 1,
          price: '1',
          selling: {
            code: 'AS1',
            issuer: 'AS1_ISSUER'
          }
        }
      ];

      expect(updateOffers(wallets, offers) ).to.deep.equals(expectOperations);

    });

    it('Should update two offers', () => {

      const wallets = [
        {
          balance: '700.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS1',
          asset_issuer: 'AS1_ISSUER'
        },
        {
          balance: '300.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS2',
          asset_issuer: 'AS2_ISSUER'
        }
      ];

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
            asset_issuer: 'AS1_ISSUER'
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER'
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
            asset_issuer: 'AS2_ISSUER'
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER'
          },
          amount: '250.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      const expectOperations = [
        {
          amount: '700.0000000',
          buying: {
            code: 'AS2',
            issuer: 'AS2_ISSUER'
          },
          offerId: 1,
          price: '1',
          selling: {
            code: 'AS1',
            issuer: 'AS1_ISSUER'
          }
        },
        {
          amount: '300.0000000',
          buying: {
            code: 'AS1',
            issuer: 'AS1_ISSUER'
          },
          offerId: 1,
          price: '1',
          selling: {
            code: 'AS2',
            issuer: 'AS2_ISSUER'
          }
        }
      ];

      expect(updateOffers(wallets, offers) ).to.deep.equals(expectOperations);

    });

    it('Should update one offers and remove one other', () => {

      const wallets = [
        {
          balance: '1000.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS1',
          asset_issuer: 'AS1_ISSUER'
        },
        {
          balance: '0.0000000',
          limit: '100000',
          asset_type: 'credit_alphanum4',
          asset_code: 'AS2',
          asset_issuer: 'AS2_ISSUER'
        }
      ];

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
            asset_issuer: 'AS1_ISSUER'
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS2',
            asset_issuer: 'AS2_ISSUER'
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
            asset_issuer: 'AS2_ISSUER'
          },
          buying: {
            asset_type: 'credit_alphanum4',
            asset_code: 'AS1',
            asset_issuer: 'AS1_ISSUER'
          },
          amount: '0.0000000',
          price_r: {
            n: 1,
            d: 1
          },
          price: '1.0000000'
        }
      ];

      const expectOperations = [
        {
          amount: '1000.0000000',
          buying: {
            code: 'AS2',
            issuer: 'AS2_ISSUER'
          },
          offerId: 1,
          price: '1',
          selling: {
            code: 'AS1',
            issuer: 'AS1_ISSUER'
          }
        }
      ];

      expect(updateOffers(wallets, offers) ).to.deep.equals(expectOperations);

    });

  });

});
