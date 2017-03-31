const cache = require('./cache');
const github = require('./github');

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
