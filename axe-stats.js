const AxeBuilder = require('axe-webdriverjs');

const cache = require('./lib/cache');
const getWebdriver = require('./lib/webdriver');

function getAxeStats(domain) {
  return cache.get(['axe', domain], () => getWebdriver().then(driver => {
    return driver.get(`https://${domain}/`).then(() => {
      const axe = AxeBuilder(driver);

      return new Promise((resolve, reject) => {
        axe.analyze(results => {
          resolve(results);
        });
      });
    });
  }));
}

module.exports = getAxeStats;

if (module.parent === null) {
  let promise = Promise.resolve();

  require('./websites.json').forEach(function(website) {
    promise = promise.then(() => {
      console.log(`Obtaining axe-core stats for ${website.domain}.`);

      return getAxeStats(website.domain);
    });
  });

  promise.catch(err => {
    console.log(err);
    process.exit(1);
  });
}
