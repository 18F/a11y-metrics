const path = require('path');
const fs = require('fs');
const http = require('http');
const AxeBuilder = require('axe-webdriverjs');
const webdriver = require('selenium-webdriver');

const CACHE_DIR = path.join(__dirname, 'cache', 'axe');
let driver;

function checkDriverReadiness(cb) {
  const TIMEOUT_MS = 1000;

  const req = http.get(process.env.SELENIUM_REMOTE_URL, res => {
    if (res.statusCode !== 302) {
      return cb(new Error(`got HTTP ${res.statusCode}`));
    }
    res.on('data', () => {});
    res.on('end', () => { cb(null); });
  });

  req.setTimeout(TIMEOUT_MS, () => {
    cb(new Error('timeout exceeded'));
  });
  req.on('error', cb);
}

function getDriver() {
  if (driver) {
    return Promise.resolve(driver);
  }

  const RETRIES = 5;
  const TIME_BETWEEN_RETRIES_MS = 500;

  return new Promise((resolve, reject) => {
    const retry = (retriesLeft) => {
      checkDriverReadiness(function(err) {
        if (err) {
          if (retriesLeft === 0) {
            return reject(new Error('maximum retries exceeded'));
          }

          console.log(`Webdriver not ready (${err}), retrying.`);

          return setTimeout(() => {
            retry(retriesLeft - 1);
          }, TIME_BETWEEN_RETRIES_MS);
        }
        driver = new webdriver.Builder().build();
        resolve(driver);
      });
    };

    retry(RETRIES);
  });
}

function getAxeStats(domain) {
  const filename = path.join(CACHE_DIR, `${domain}.json`);
  if (fs.existsSync(filename)) {
    return Promise.resolve(JSON.parse(fs.readFileSync(filename, {
      encoding: 'utf-8'
    })));
  }

  return getDriver().then(driver => {
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

  require('./websites.json').forEach(function(domain) {
    promise = promise.then(() => {
      console.log(`Obtaining axe-core stats for ${domain}.`);

      return getAxeStats(domain);
    });
  });

  promise.catch(err => {
    console.log(err);
    process.exit(1);
  });
}
