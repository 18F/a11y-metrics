// @flow

const GitHubApi = require('github');

const MIN_RETRY_INTERVAL = 1000;

const api = new GitHubApi({
  protocol: 'https',
  host: 'api.github.com',
  headers: {
    'user-agent': '18F/a11y-metrics'
  },
  timeout: 5000
});

function retry(
  promiseFactory /*: () => Promise<any> */
) /*: Promise<any> */ {
  return promiseFactory().catch(err => {
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

        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(retry(promiseFactory)), msUntilReset);
        });
      }
    }

    throw err;
  });
}

module.exports = {
  api,
  retry
};
