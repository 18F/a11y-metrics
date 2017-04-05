// @flow

const urlParse = require('url').parse;

/**
 * Shorten the given URL to make it more human-readable. Note that
 * it discards protocol and querystring information.
 */
exports.shortenUrl = function(url /*: string */) /*: string */ {
  const info = urlParse(url);

  if (!(info.hostname && info.pathname))
    return url;

  let short = info.hostname + info.pathname;

  if (/\/$/.test(short)) {
    short = short.slice(0, -1);
  }

  return short;
};

/**
 * Compare two strings case-insensitively. Useful for sorting.
 */
exports.cmpStr = function(a /*: string */, b /*: string */) /*: number */ {
  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
};
