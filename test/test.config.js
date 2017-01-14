/* eslint func-name-matching: 0, no-underscore-dangle: 0 */

require('../config/globalConfig');
global.chai = require('chai');
global.expect = global.chai.expect;

const spy = require('chai-spies');
const chaiAsPromised = require('chai-as-promised');
const mock = require('mock-require');
const mockCreateClient = require('./mock/mockRedis');
const MockStellarAsset = require('./mock/mockAsset');

global.chai.use(chaiAsPromised);
global.chai.use(spy);

mock('stellar-sdk', {
  Operation: {
    manageOffer: offerData => offerData,
    createPassiveOffer: function MockStellarCreatePassiveOffer(offerData){

      this._offerData = offerData;
      
      return offerData;
    
    }
  },
  Server: function MockStellarServer(){},
  Asset: MockStellarAsset
});

mock('redis', { createClient: mockCreateClient });

