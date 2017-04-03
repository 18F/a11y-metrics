// @flow

const cache = require('./cache');
const github = require('./github');

const QUERY = 'accessibility OR a11y';

/*::
export type GithubSearchResults = {
  data: {
    total_count: number
  }
};
*/

function getGithubStats(
  repo /*: string */
) /*: Promise<GithubSearchResults> */ {
  const [org, name] = repo.split('/');

  return cache.get(['github', org, name], () => {
    console.log(`Fetching GitHub stats for ${repo}.`);

    return github.retry(() => github.api.search.issues({
      q: `repo:${org}/${name} ${QUERY}`,
      per_page: 100,
    }));
  });
}

module.exports = getGithubStats;

if (module.parent === null) {
  require('./run-script')(async () => {
    const websites = await require('./websites')();

    for (let website of websites) {
      console.log(`Processing ${website.repo}.`);

      await getGithubStats(website.repo);
    }
  });
}
