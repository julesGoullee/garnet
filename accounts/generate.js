require('../config/globalConfig');
const StellarSdk = require('stellar-sdk');
const rp = require('request-promise');
const log = require('npmlog');
const jsonFile = require('jsonfile');
const { HORIZON_ENDPOINT } = require('../config');
const { showBalance, payment, trustAssets } = require('./utils');

const server = new StellarSdk.Server(HORIZON_ENDPOINT);

async function generatePair(){

  const pair = StellarSdk.Keypair.random();

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
  const account = await server.loadAccount(pair.accountId() );
  const asset = new StellarSdk.Asset(assetCode, pair.accountId() );

  log.info('genIssuer', `issuerAccount:${pair.accountId()}|asset:${assetCode}`);

  return {
    pair,
    account,
    asset
  };

}

async function genAnchor(issuer){

  const pair = await generatePair();
  const account = await server.loadAccount(pair.accountId() );

  log.info('genAnchor', `AnchorAccount:${pair.accountId()}|balance:${showBalance(account)}`);

  await trustAssets(account, pair, [issuer.asset]);
  await payment(issuer.account, issuer.pair, pair, '100000', issuer.asset);

  const refreshAccount = await server.loadAccount(pair.accountId() );

  log.info('genAnchor', `RefreshAnchorAccount:${pair.accountId()}|balance:${showBalance(refreshAccount)}`);

  return {
    pair,
    account,
    asset: issuer.asset
  };

}

async function genBot(anchors){

  const pair = await generatePair();
  const account = await server.loadAccount(pair.accountId() );

  log.info('genBotAccount', `BotAccount:${pair.accountId()}|balance:${showBalance(account)}`);

  await trustAssets(account, pair, anchors.map(anchor => anchor.asset) );
  payment(anchors[0].account, anchors[0].pair, pair, '1000', anchors[0].asset);

  // await Promise.all(anchors.map(anchor => payment(anchor.account, anchor.pair, pair, '1000', anchor.asset) ) );

  const refreshAccount = await server.loadAccount(pair.accountId() );

  log.info('genBotAccount', `RefreshBotAccount:${pair.accountId()}|balance:${showBalance(refreshAccount)}`);

  return {
    pair,
    account
  };

}

async function launch(){

  const issuers = await Promise.all([genIssuer('AS1'), genIssuer('AS2')]);
  const anchors = await Promise.all(issuers.map(issuer => genAnchor(issuer) ) );
  const bot = await genBot(anchors);

  const data = {
    issuers: issuers.map( (issuer, i) => ({
      account: {
        accountId: issuer.pair.accountId(),
        seed: issuer.pair.seed()
      },
      asset: issuer.asset.code,
      anchor: {
        accountId: anchors[i].pair.accountId(),
        seed: anchors[i].pair.seed()
      }
    }) ),
    bot: {
      accountId: bot.pair.accountId(),
      seed: bot.pair.seed()
    }
  };

  jsonFile.writeFileSync('./data/accounts.json', data, { spaces: 2 });

}

launch().then( () => {

  log.info('createAccount', 'Accounts success');

}).catch(err => log.info('launch', err) );
