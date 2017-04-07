// @flow

const http = require('http');
const webdriver = require('selenium-webdriver');

const {
  SELENIUM_REMOTE_URL,
  SELENIUM_BROWSER,
} = require('./config');

let driver /*: webdriver$WebDriver */;

const TIMEOUT_MS = 1000;
const RETRIES = 5;
const TIME_BETWEEN_RETRIES_MS = 500;

function checkDriverReadiness(
  url /*: string */,
  cb /*: (err: Error | null) => void */
) /*: void */ {
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

function getWebdriver() /*: Promise<webdriver$WebDriver> */ {
  if (driver) {
    return Promise.resolve(driver);
  }

  if (!SELENIUM_BROWSER) {
    return Promise.reject(new Error('SELENIUM_BROWSER must be defined'));
  }

  if (!SELENIUM_REMOTE_URL) {
    return Promise.reject(new Error('SELENIUM_REMOTE_URL must be defined'));
  }

  return new Promise((resolve, reject) => {
    const retry = (retriesLeft) => {
      checkDriverReadiness(SELENIUM_REMOTE_URL, function(err) {
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
        driver = new webdriver.Builder()
          .forBrowser(SELENIUM_BROWSER)
          .usingServer(SELENIUM_REMOTE_URL)
          .build();
        resolve(driver);
      });
    };

    retry(RETRIES);
  });
}

module.exports = getWebdriver;
