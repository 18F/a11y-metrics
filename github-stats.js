const GitHubApi = require('github');

const cache = require('./lib/cache');

const QUERY = 'accessibility OR a11y';

const github = new GitHubApi({
  protocol: 'https',
  host: 'api.github.com',
  headers: {
    'user-agent': '18F/a11y-metrics'
  },
  timeout: 5000
});

function getGithubStats(repo) {
  const [org, name] = repo.split('/');

  return cache.get(['github', org, name], (cb) => {
    github.search.issues({
      q: `repo:${org}/${name} ${QUERY}`,
      per_page: 100,
    }, cb); 
  });
}

async function main() {
  const websites = require('./websites.json');

  for (website of websites) {
    console.log(`Obtaining GitHub stats for ${website.repo}.`);

    await getGithubStats(website.repo);
  }
}

if (module.parent === null) {
  main().catch(err => {
    console.log(err);
    process.exit(1);
  });
}
