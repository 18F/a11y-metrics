const getGithubRepos = require('./github-repos');

const ORG = '18F';
const MIN_OPEN_ISSUES = 20;
const MIN_STARS = 30;
const MIN_LAST_PUSH_YEAR = new Date().getFullYear() - 1;
const REPO_BLACKLIST = [
  // This project's homepage points to a page behind HTTP auth.
  '18F/identity-idp',
];
const HOMEPAGE_RE_BLACKLIST = [
  /^https?:\/\/github\.com\//,
  /^https?:\/\/rubygems\.org\//,
  // Ignore homepages that just point to blog posts.
  /^https?:\/\/18f\.gsa\.gov\/20\d\d\//
];

function isInterestingRepo(r) {
  return !r.fork && r.homepage &&
         !HOMEPAGE_RE_BLACKLIST.some(re => re.test(r.homepage)) &&
         new Date(r.pushed_at).getFullYear() >= MIN_LAST_PUSH_YEAR &&
         (r.open_issues_count >= MIN_OPEN_ISSUES ||
          r.stargazers_count >= MIN_STARS);
}

async function getWebsites() {
  let repos = await getGithubRepos(ORG);

  return repos.filter(isInterestingRepo).map(repo => ({
    homepage: repo.homepage,
    repo: `${ORG}/${repo.name}`
  })).filter(website => REPO_BLACKLIST.indexOf(website.repo) === -1);
}

module.exports = getWebsites;

async function main() {
  console.log(`Processing ${ORG}.`);

  const repos = (await getWebsites())
    .map(r => `* ${r.repo} - ${r.homepage}`);

  console.log(repos.join('\n'));
  console.log(`\n${repos.length} interesting repos found in ${ORG}.`);
}

if (module.parent === null) {
  main().catch(err => {
    console.log(err);
    process.exit(1);
  });
}
