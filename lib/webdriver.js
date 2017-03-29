// @flow

const http = require('http');
const webdriver = require('selenium-webdriver');

let driver;

const TIMEOUT_MS = 1000;
const RETRIES = 5;
const TIME_BETWEEN_RETRIES_MS = 500;

function checkDriverReadiness(
  cb /*: (err: Error | null) => void */
) /*: void */ {
  const url = process.env.SELENIUM_REMOTE_URL;

  if (!url) {
    return process.nextTick(() => {
      cb(new Error('SELENIUM_REMOTE_URL must be defined'));
    });
  }

  const req = http.get(url, res => {
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

function getWebdriver() /*: Promise<any> */ {
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

          const errStr = err ? err.toString() : 'unknown error';

          console.log(`Webdriver not ready (${errStr}), retrying.`);

          setTimeout(() => {
            retry(retriesLeft - 1);
          }, TIME_BETWEEN_RETRIES_MS);
          return;
        }
        driver = new webdriver.Builder().build();
        resolve(driver);
      });
    };

    retry(RETRIES);
  });
}

module.exports = getWebdriver;
