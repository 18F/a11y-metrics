// @flow

const {
  ENABLE_INTERNET_TESTS,
  SELENIUM_REMOTE_URL,
  SELENIUM_BROWSER
} = require('../lib/config');
const getAxeStats = require('../lib/axe-stats');

describe('getAxeStats()', () => {
  const internetIt = (ENABLE_INTERNET_TESTS &&
                      SELENIUM_REMOTE_URL &&
                      SELENIUM_BROWSER) ? it : it.skip;

  // This can take particularly long on Travis.
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

  internetIt('works on sites w/ CSP like github.com', async () => {
    const s = await getAxeStats('https://github.com/18F/a11y-metrics');
    expect(s.url).toBe('https://github.com/18F/a11y-metrics');
  });
});
