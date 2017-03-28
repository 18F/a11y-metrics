const fs = require('fs');
const cbStringify = require('csv-stringify');

const getAxeStats = require('./axe-stats');
const getGithubStats = require('./github-stats');
const websites = require('./websites.json');

const OUTPUT_CSV = 'stats.csv';

function stringify(input) {
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
  rows = [[
    'Domain',
    'GitHub Repository',
    'GitHub issues mentioning accessibility',
    'aXe violations on front page'
  ]];

  for (website of websites) {
    const github = await getGithubStats(website.repo);
    const axe = await getAxeStats(website.domain);

    rows.push([
      website.domain,
      website.repo,
      github.data.total_count,
      axe.violations.length
    ]);
  }

  fs.writeFileSync(OUTPUT_CSV, await stringify(rows));
  console.log(`Wrote ${OUTPUT_CSV}.`);
}

if (module.parent === null) {
  main().catch(err => {
    console.log(err);
    process.exit(1);
  });
}
