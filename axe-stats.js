const path = require('path');
const fs = require('fs');
const AxeBuilder = require('axe-webdriverjs');
const webdriver = require('selenium-webdriver');

const CACHE_DIR = path.join(__dirname, 'cache', 'axe');
let driver;

function getAxeStats(domain) {
  return new Promise((resolve, reject) => {
    const filename = path.join(CACHE_DIR, `${domain}.json`);
    if (fs.existsSync(filename)) {
      return resolve(JSON.parse(fs.readFileSync(filename, {
        encoding: 'utf-8'
      })));
    }

    if (!driver) {
      driver = new webdriver.Builder().build();
    }

    driver
      .get(`https://${domain}/`)
      .then(() => {
        AxeBuilder(driver)
          .analyze(results => {
            fs.writeFileSync(filename, JSON.stringify(results, null, 2));
            resolve(results);
          });
      }, reject);
  });
}

module.exports = getAxeStats;

if (module.parent === null) {
  let promise = Promise.resolve();

  require('./websites.json').forEach(function(domain) {
    promise = promise.then(() => {
      console.log(`Obtaining axe-core stats for ${domain}.`);

      return getAxeStats(domain);
    });
  });
}
