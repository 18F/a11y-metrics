// @flow

const cache = require('./cache');
const github = require('./github');

/*::
export type GithubRepo = {
  name: string,
  full_name: string,
  pushed_at: string,
  homepage: string | null,
  open_issues_count: number,
  stargazers_count: number,
  fork: boolean
};

type GithubRepoResponse = {
  data: Array<GithubRepo>
};
*/

function getGithubReposPage(
  org /*: string */,
  page /*: number */
) /*: Promise<GithubRepoResponse> */ {
  return cache.get(['github', `${org}.${page}`], () => {
    console.log(`Fetching GitHub repos for ${org} (page ${page}).`);

    return github.retry(() => github.api.repos.getForOrg({
      org,
      page: page,
      per_page: 100,
    }));
  });
}

async function getGithubRepos(
  org /*: string */
) /*: Promise<Array<GithubRepo>> */ {
  let repos = [];
  let page = 1;
  let done = false;

  while (!done) {
    let res = await getGithubReposPage(org, page);
    repos.push(...res.data);
    if (!github.api.hasNextPage(res)) {
      done = true;
    }
    page++;
  }

  return repos;
}

module.exports = getGithubRepos;
