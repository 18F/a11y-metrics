// @flow

require('babel-register');

const fs = require('fs');
const cbStringify = require('csv-stringify');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const getAxeStats = require('./lib/axe-stats');
const getGithubStats = require('./lib/github-stats');
const getWebsites = require('./lib/websites');
const getWebdriver = require('./lib/webdriver');
const Dashboard = require('./lib/components/dashboard');
const StaticPage = require('./lib/components/static-page');

const config = require('./lib/config');

const OUTPUT_CSV = `static/${config.CSV_FILENAME}`;
const OUTPUT_HTML = 'static/index.html';
const RECORDS_JSON = `static/${config.JSON_FILENAME}`;

function stringify(input /*: Array<any> */) /*: Promise<string> */ {
  return new Promise((resolve, reject) => {
    cbStringify(input, (err, output) => {
      if (err) {
        return reject(err);
      }
      resolve(output);
    });
  });
}

async function main() {
  const rows = [[
    'Homepage',
    'GitHub Repository',
    'GitHub issues (open and closed) mentioning accessibility',
    'aXe violations on front page',
    'aXe passes on front page'
  ]];
  const records = [];

  const websites = await getWebsites();
  const driver = await getWebdriver();

  for (let website of websites) {
    const github = await getGithubStats(website.repo);
    const axe = await getAxeStats(driver, website.homepage);

    rows.push([
      website.homepage,
      website.repo,
      github.data.total_count,
      axe.violations.length,
      axe.passes.length
    ]);

    records.push({
      website,
      axeStats: {
        violations: axe.violations.map(v => ({
          kind: v.help,
          helpUrl: v.helpUrl,
          nodeCount: v.nodes.length
        })),
        passes: axe.passes.length,
      },
      issueCount: github.data.total_count
    });
  }

  await driver.quit();

  fs.writeFileSync(OUTPUT_CSV, await stringify(rows));
  console.log(`Wrote ${OUTPUT_CSV}.`);

  const dashboardProps = {
    title: config.TITLE,
    records,
    createdAt: new Date().toISOString()
  };
  const appHtml = ReactDOMServer.renderToString(
    React.createElement(Dashboard, dashboardProps)
  );
  const html = '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
    React.createElement(StaticPage, {
      title: config.TITLE,
      id: config.ELEMENT_ID,
      html: appHtml
    })
  );

  fs.writeFileSync(OUTPUT_HTML, html);
  console.log(`Wrote ${OUTPUT_HTML}.`);

  fs.writeFileSync(RECORDS_JSON, JSON.stringify(dashboardProps));
  console.log(`Wrote ${RECORDS_JSON}.`);
}

if (module.parent === null) {
  require('./lib/run-script')(main);
}
