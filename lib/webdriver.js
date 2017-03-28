const http = require('http');
const webdriver = require('selenium-webdriver');

let driver;

const TIMEOUT_MS = 1000;
const RETRIES = 5;
const TIME_BETWEEN_RETRIES_MS = 500;

function checkDriverReadiness(cb) {
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

function getWebdriver() {
  if (driver) {
    return Promise.resolve(driver);
  }

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

module.exports = getWebdriver;
