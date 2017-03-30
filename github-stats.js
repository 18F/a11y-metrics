const cache = require('./lib/cache');
const github = require('./lib/github');

const QUERY = 'accessibility OR a11y';

function getGithubStats(repo) {
  const [org, name] = repo.split('/');

  return cache.get(['github', org, name], (cb) => {
    console.log(`Fetching GitHub stats for ${repo}.`);

    github.search.issues({
      q: `repo:${org}/${name} ${QUERY}`,
      per_page: 100,
    }, cb); 
  });
}

module.exports = getGithubStats;

async function main() {
  const websites = require('./websites.json');

  for (website of websites) {
    console.log(`Processing ${website.repo}.`);

    await getGithubStats(website.repo);
  }
}

if (module.parent === null) {
  main().catch(err => {
    console.log(err);
    process.exit(1);
  });
}
