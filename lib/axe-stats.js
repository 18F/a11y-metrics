const AxeBuilder = require('axe-webdriverjs');

const cache = require('./cache');
const getWebdriver = require('./webdriver');

function getAxeStats(homepage) {
  const subkey = cache.urlToCacheKey(homepage);

  return cache.get(['axe', ...subkey], async function() {
    console.log(`Obtaining axe-core stats for ${homepage}.`);

    const driver = await getWebdriver();

    await driver.get(homepage);

    const axe = AxeBuilder(driver);

    return new Promise((resolve, reject) => {
      axe.analyze(results => {
        resolve(results);
      });
    });
  });
}

module.exports = getAxeStats;

async function main() {
  const websites = await require('./websites')();

  for (website of websites) {
    console.log(`Processing ${website.homepage} (${website.repo}).`);

    await getAxeStats(website.homepage);
  }
}

if (module.parent === null) {
  main().catch(err => {
    console.log(err);
    process.exit(1);
  });
}
