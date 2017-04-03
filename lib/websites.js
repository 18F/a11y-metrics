// @flow

const getGithubRepos = require('./github-repos');

/*::
import type {GithubRepo} from './github-repos'

export type Website = {
  homepage: string,
  repo: string
};
*/

const {
  ORG,
  MIN_OPEN_ISSUES,
  MIN_STARS,
  MIN_LAST_PUSH_YEAR,
  REPO_BLACKLIST,
  HOMEPAGE_RE_BLACKLIST,
} = require('./config');

/**
 * Returns whether or not the given GitHub repository is "interesting",
 * i.e. worthy of inclusion in the dashboard.
 *
 * For more details on the criteria used for this, see ./config.js.
 */
function isInterestingRepo(r /*: GithubRepo */) /*: boolean */ {
  return !r.fork && !!r.homepage &&
         !HOMEPAGE_RE_BLACKLIST.some(re => re.test(r.homepage || '')) &&
         new Date(r.pushed_at).getFullYear() >= MIN_LAST_PUSH_YEAR &&
         (r.open_issues_count >= MIN_OPEN_ISSUES ||
          r.stargazers_count >= MIN_STARS);
}

async function getWebsites() /*: Promise<Array<Website>> */ {
  let repos = await getGithubRepos(ORG);

  return repos.filter(isInterestingRepo).map(repo => ({
    homepage: repo.homepage || '',
    repo: repo.full_name
  })).filter(website => REPO_BLACKLIST.indexOf(website.repo) === -1);
}

module.exports = getWebsites;

if (module.parent === null) {
  require('./run-script')(async () => {
    console.log(`Processing ${ORG}.`);

    const repos = (await getWebsites())
      .map(r => `* ${r.repo} - ${r.homepage || ''}`);

    console.log(repos.join('\n'));
    console.log(`\n${repos.length} interesting repos found in ${ORG}.`);
  });
}
