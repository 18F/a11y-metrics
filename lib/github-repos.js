const cache = require('./cache');
const github = require('./github');

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

function isInterestingRepo(r) {
  const MIN_OPEN_ISSUES = 20;
  const MIN_STARS = 30;
  const MIN_LAST_PUSH_YEAR = new Date().getFullYear() - 1;

  return !r.fork && r.homepage &&
         new Date(r.pushed_at).getFullYear() >= MIN_LAST_PUSH_YEAR &&
         (r.open_issues_count >= MIN_OPEN_ISSUES ||
          r.stargazers_count >= MIN_STARS);
}

async function main() {
  console.log(`Processing ${ORG}.`);

  let repos = await getGithubRepos(ORG);


  repos = repos.filter(isInterestingRepo)
    .map(r => `* ${r.name} - ${r.homepage}`);

  console.log(repos.join('\n'));
  console.log(`\n${repos.length} interesting repos found in ${ORG}.`);
}

if (module.parent === null) {
  main().catch(err => {
    console.log(err);
    process.exit(1);
  });
}
