const path = require('path');
const fs = require('fs');
const AxeBuilder = require('axe-webdriverjs');

const getWebdriver = require('./lib/webdriver');

const CACHE_DIR = path.join(__dirname, 'cache', 'axe');

function getAxeStats(domain) {
  const filename = path.join(CACHE_DIR, `${domain}.json`);
  if (fs.existsSync(filename)) {
    return Promise.resolve(JSON.parse(fs.readFileSync(filename, {
      encoding: 'utf-8'
    })));
  }

  return getWebdriver().then(driver => {
    return driver.get(`https://${domain}/`).then(() => {
      const axe = AxeBuilder(driver);

      return new Promise((resolve, reject) => {
        axe.analyze(results => {
          fs.writeFileSync(filename, JSON.stringify(results, null, 2));
          resolve(results);
        });
      });
    });
  });
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
