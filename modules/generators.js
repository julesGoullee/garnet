require('../config/globalConfig');
const Stellar = require('stellar-sdk');
const rp = require('request-promise');
const log = require('npmlog');
const { HORIZON_ENDPOINT } = require('../config');
const { showWallets } = require('../modules/wallet');
const payment = require('../modules/payment');
const { trustAssets } = require('../modules/asset');
const { loadAccount } = require('../modules/account');

async function generatePair(){

  const pair = Stellar.Keypair.random();

  await rp.get({
    url: `${HORIZON_ENDPOINT}/friendbot`,
    qs: { addr: pair.accountId() },
    json: true
  });

  // log.info('generatePair', `Success|accountId:${pair.accountId()}`);

  return pair;

}

async function genIssuer(assetCode){

  const pair = await generatePair();
  const account = await loadAccount(pair.accountId() );
  const asset = new Stellar.Asset(assetCode, pair.accountId() );

  log.info('genIssuer', `issuerAccount:${pair.accountId()}|asset:${assetCode}`);

  return {
    pair,
    account,
    asset
  };

}

async function genAnchor(issuer){

  const pair = await generatePair();
  const account = await loadAccount(pair.accountId() );

  log.info('genAnchor', `AnchorAccount:${pair.accountId()}|balance:${showWallets(account)}`);

  await trustAssets(account, pair, [issuer.asset]);
  await payment(issuer.account, issuer.pair, pair, '100000', issuer.asset);

  const refreshAccount = await loadAccount(pair.accountId() );

  log.info('genAnchor', `RefreshAnchorAccount:${pair.accountId()}|balance:${showWallets(refreshAccount)}`);

  return {
    pair,
    account,
    asset: issuer.asset
  };

}

async function genBot(anchors){

  const pair = await generatePair();
  const account = await loadAccount(pair.accountId() );

  log.info('genBotAccount', `BotAccount:${pair.accountId()}|balance:${showWallets(account)}`);

  await trustAssets(account, pair, anchors.map(anchor => anchor.asset) );

  // payment(anchors[0].account, anchors[0].pair, pair, '1000', anchors[0].asset);

  await Promise.all(anchors.map(anchor => payment(anchor.account, anchor.pair, pair, '1000', anchor.asset) ) );

  const refreshAccount = await loadAccount(pair.accountId() );

  log.info('genBotAccount', `RefreshBotAccount:${pair.accountId()}|balance:${showWallets(refreshAccount)}`);

  return {
    pair,
    account
  };

}

module.exports = {
  generatePair,
  genIssuer,
  genAnchor,
  genBot
};
