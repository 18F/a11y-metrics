const path = require('path');
const fs = require('fs');
const GitHubApi = require('github');

const mkdirpSync = require('./lib/mkdirp-sync');

const CACHE_DIR = path.join(__dirname, 'cache', 'github');

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
  const dirname = path.join(CACHE_DIR, org);
  const filename = path.join(dirname, name);

  if (fs.existsSync(filename)) {
    return Promise.resolve(JSON.parse(fs.readFileSync(filename, {
      encoding: 'utf-8'
    })));
  }

  return new Promise((resolve, reject) => {
    github.search.issues({
      q: `repo:${org}/${name} accessibility OR a11y`,
      per_page: 100,
    }, (err, res) => {
      if (err) {
        return reject(err);
      }

      mkdirpSync(dirname);
      fs.writeFileSync(filename, JSON.stringify(res, null, 2));
      resolve();
    });
  });
}

if (module.parent === null) {
  let promise = Promise.resolve();

  require('./websites.json').forEach(function(website) {
    promise = promise.then(() => {
      console.log(`Obtaining GitHub stats for ${website.repo}.`);

      return getGithubStats(website.repo);
    });
  });

  promise.catch(err => {
    console.log(err);
    process.exit(1);
  });
}
