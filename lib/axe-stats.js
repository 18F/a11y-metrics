// @flow

const axe = require('axe-core');

const cache = require('./cache');
const getWebdriver = require('./webdriver');

const SCRIPT_TIMEOUT_MS = 15000;
const PAGE_LOAD_TIMEOUT_MS = 20000;
/*::
export type AxeViolation = {
  help: string;
  nodes: Array<any>;
};

export type AxeStats = {
  incomplete: Array<any>,
  passes: Array<any>,
  violations: Array<AxeViolation>,
  url: string
};
*/

function getAxeStats(
  homepage /*: string */
) /*: Promise<AxeStats> */ {
  const subkey = cache.urlToCacheKey(homepage);

  return cache.get(['axe', ...subkey], async function() {
    console.log(`Obtaining axe-core stats for ${homepage}.`);

    const driver = await getWebdriver();

    const timeouts = driver.manage().timeouts();

    timeouts.setScriptTimeout(SCRIPT_TIMEOUT_MS);
    timeouts.pageLoadTimeout(PAGE_LOAD_TIMEOUT_MS);

    await driver.get(homepage);

    const script = `
      var callback = arguments[arguments.length - 1];
      ${axe.source};
      axe.run(function(err, results) {
        callback({
          error: err && err.toString(),
          results: results
        });
      });
    `;

    const response = await driver.executeAsyncScript(script);

    if (response.error !== null) {
      throw new Error("axe.run() failed: " + response.error);
    }

    return response.results;
  });
}

module.exports = getAxeStats;

if (module.parent === null) {
  require('./run-script')(async () => {
    const websites = await require('./websites')();

    for (let website of websites) {
      console.log(`Processing ${website.homepage} (${website.repo}).`);

      await getAxeStats(website.homepage);
    }
  });
}
