// @flow

/**
 * Static configuration options
 */

// This is the GitHub query we make to figure out how many a11y-related
// issues a repository has.
exports.QUERY = 'accessibility OR a11y';

// The GitHub organization whose repositories we iterate through to
// figure out what projects exist.
exports.ORG = '18F';

// Some of the following configuration options use the word "interesting"
// to describe a repository. By "interesting' we mean a repository worthy
// of collecting statistics on and being displayed in the dashboard.
//
// We need to do this because our organization has hundreds of repositories,
// most of which we don't actually need to collect statistics on.
//
// Some criteria are further qualified with the word "SHOULD"; these are
// not *required* for a repository to be considered interesting, but at
// least *one* of the "SHOULD" criteria must be met for it to be
// considered interesting.
//
// Thus, for instance, a repository may have no stars and 1000 open
// issues to be considered interesting, or it may have 1000 stars and
// 0 open issues, but it cannot have no stars *and* no open issues.

// The minimum number of open issues that a repository SHOULD have to
// be considered interesting.
exports.MIN_OPEN_ISSUES = 20;

// The minimum number of stars that a repository SHOULD have to
// be considered interesting.
exports.MIN_STARS = 10;

// The minimum year in which the most recent push to a repository MUST
// have been made for it to be considered interesting.
exports.MIN_LAST_PUSH_YEAR = 2016;

// This is a blacklist of repositories, in `org/repo` format, that should
// NEVER be considered interesting.
exports.REPO_BLACKLIST = [
  // This project's homepage points to a page behind HTTP auth.
  '18F/identity-idp',
];

// Repositories whose homepages match any of the regular expressions in
// this blacklist should NEVER be considered interesting.
exports.HOMEPAGE_RE_BLACKLIST = [
  // Aside from not being useful to analyze from an accessibility standpoint,
  // we have trouble crawling these sites.
  /^https?:\/\/github\.com\//,
  /^https?:\/\/rubygems\.org\//,
  /^https?:\/\/www\.npmjs\.com\//,

  // Ignore homepages that just point to blog posts.
  /^https?:\/\/18f\.gsa\.gov\/20\d\d\//
];

// The title of the dashboard, shown on the web version.
exports.TITLE = `${exports.ORG} accessibility dashboard`;

// The element ID in which the dashboard is housed in the web version.
exports.ELEMENT_ID = 'dashboard';

// The filename we save the CSV contents of the dashboard as.
exports.CSV_FILENAME = 'stats.csv';

// The filename we save the JSON contents of the dashboard as.
exports.JSON_FILENAME = 'records.json';

// The progressive enhancement JS bundle for the dashboard.
exports.JS_FILENAME = 'bundle.js';

/**
 * Environment-controlled configuration options
 *
 * These configuration options can be controlled through environment
 * variables. If running via docker-compose, this can be done via
 * a `docker-compose.override.yml` file or by simply creating a `.env`
 * file in the root directory of the project.
 *
 * Note that some environment variables may be described as "boolean".
 * This means that they are true if the environment variable is
 * defined--even if it's defined to be the empty string.
 */

// This loads settings from any existing `.env` file into our environment.
if (process.env.APP_ENV !== 'browser') require('dotenv').config();

// GITHUB_API_TOKEN
//
// This is a GitHub API personal access token. It's optional and
// just makes collecting GitHub statistics more efficient, as
// authenticated requests have higher rate limits. It only needs
// `public_repo` scope.
exports.GITHUB_API_TOKEN = process.env['GITHUB_API_TOKEN'];

// ENABLE_INTERNET_TESTS
//
// This boolean determines whether we run tests that require internet
// connectivity.
exports.ENABLE_INTERNET_TESTS = 'ENABLE_INTERNET_TESTS' in process.env;

// SELENIUM_REMOTE_URL
//
// This points to the remote Selenium WebDriver server, e.g.
// 'http://localhost:4444/wd/hub'.
//
// This is defined by the default Docker setup, so you probably don't
// need to set it yourself.
exports.SELENIUM_REMOTE_URL = process.env['SELENIUM_REMOTE_URL'];

// SELENIUM_BROWSER
//
// This is the name of the browser to use for Selenium WebDriver,
// e.g. 'chrome'.
//
// This is defined by the default Docker setup, so you probably don't
// need to set it yourself.
exports.SELENIUM_BROWSER = process.env['SELENIUM_BROWSER'];
