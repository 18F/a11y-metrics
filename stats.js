// @flow

require('babel-register');

const fs = require('fs');
const cbStringify = require('csv-stringify');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const getAxeStats = require('./lib/axe-stats');
const getGithubStats = require('./lib/github-stats');
const getWebsites = require('./lib/websites');
const Dashboard = require('./lib/components/dashboard');

const OUTPUT_CSV = 'stats.csv';
const OUTPUT_HTML = 'index.html';

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

  for (let website of websites) {
    const github = await getGithubStats(website.repo);
    const axe = await getAxeStats(website.homepage);

    rows.push([
      website.homepage,
      website.repo,
      github.data.total_count,
      axe.violations.length,
      axe.passes.length
    ]);

    records.push({
      website,
      axeStats: axe,
      issueCount: github.data.total_count
    });
  }

  fs.writeFileSync(OUTPUT_CSV, await stringify(rows));
  console.log(`Wrote ${OUTPUT_CSV}.`);

  fs.writeFileSync(OUTPUT_HTML, ReactDOMServer.renderToString(
    React.createElement(Dashboard, {
      records
    })
  ));
  console.log(`Wrote ${OUTPUT_HTML}.`);
}

if (module.parent === null) {
  require('./lib/run-script')(main);
}
