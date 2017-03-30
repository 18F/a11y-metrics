const cache = require('./lib/cache');
const github = require('./lib/github');

const ORG = '18F';

function getGithubReposPage(org, page) {
  return cache.get(['github', `${org}.${page}`], (cb) => {
    console.log(`Fetching GitHub repos for ${org} (page ${page}).`);

    github.repos.getForOrg({
      org,
      page: page,
      per_page: 100,
    }, cb);
  });
}

async function getGithubRepos(org) {
  let repos = [];
  let page = 1;
  let done = false;

  while (!done) {
    let res = await getGithubReposPage(org, page);
    repos.push(...res.data);
    if (!github.hasNextPage(res)) {
      done = true;
    }
    page++;
  }

  return repos;
}

module.exports = getGithubRepos;

async function main() {
  console.log(`Processing ${ORG}.`);

  await getGithubRepos(ORG);
}

if (module.parent === null) {
  main().catch(err => {
    console.log(err);
    process.exit(1);
  });
}
