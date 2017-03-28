const AxeBuilder = require('axe-webdriverjs');

const cache = require('./lib/cache');
const getWebdriver = require('./lib/webdriver');

function getAxeStats(domain) {
  return cache.get(['axe', domain], async function() {
    const driver = await getWebdriver();

    await driver.get(`https://${domain}/`);

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
  const websites = require('./websites.json');

  for (website of websites) {
    console.log(`Obtaining axe-core stats for ${website.domain}.`);

    await getAxeStats(website.domain);
  }
}

if (module.parent === null) {
  main().catch(err => {
    console.log(err);
    process.exit(1);
  });
}
