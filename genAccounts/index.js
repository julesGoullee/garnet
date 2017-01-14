require('../config/globalConfig');
const log = require('npmlog');
const jsonFile = require('jsonfile');

const { genIssuer, genAnchor, genBot } = require('../modules/generators');

async function launch(){

  const issuers = await Promise.all([genIssuer('USD'), genIssuer('EUR'), genIssuer('JPY')]);
  const anchors = await Promise.all(issuers.map(issuer => genAnchor(issuer) ) );
  const bot = await genBot(anchors);

  const data = {
    issuers: issuers.map( (issuer, i) => ({
      issuer: {
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

  jsonFile.writeFileSync('../data/accounts.json', data, { spaces: 2 });

}

launch().then( () => {

  log.info('createAccount', 'Accounts success');

}).catch(err => log.info('launch', err) );
