// @flow

const GitHubApi = require('github');

const { GITHUB_API_TOKEN } = require('./config');

const MIN_RETRY_INTERVAL = 1000;
const SERVER_ERROR_RETRY_INTERVAL = 10000;

const api = new GitHubApi({
  protocol: 'https',
  host: 'api.github.com',
  headers: {
    'user-agent': '18F/a11y-metrics'
  },
  timeout: 5000
});

if (GITHUB_API_TOKEN) {
  api.authenticate({
    type: 'token',
    token: GITHUB_API_TOKEN
  });
}

function retry(
  promiseFactory /*: () => Promise<any> */
) /*: Promise<any> */ {
  const retryIn = (ms /*: number */) /*: Promise<any> */ =>
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(retry(promiseFactory)), ms);
    });

  return promiseFactory().catch(err => {
    if (err.code && err.code >= 500) {
      return retryIn(SERVER_ERROR_RETRY_INTERVAL);
    }

    if (err.code && err.code === 403) {
      if (err.headers && typeof err.headers === 'object' &&
          err.headers['x-ratelimit-remaining'] === '0') {
        const reset = parseInt(err.headers['x-ratelimit-reset']);
        let msUntilReset = (reset * 1000) - Date.now();

        if (isNaN(reset) || msUntilReset < MIN_RETRY_INTERVAL) {
          msUntilReset = MIN_RETRY_INTERVAL;
        }

        console.log(
          `GitHub rate limit exceeded, retrying in ${msUntilReset}ms.`
        );

        return retryIn(msUntilReset);
      }
    }

    throw err;
  });
}

module.exports = {
  api,
  retry
};
