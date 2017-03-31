// @flow

const fs = require('fs');
const path = require('path');
const urlParse = require('url').parse;
const slugify = require('slugify');

const mkdirpSync = require('./mkdirp-sync');

const CACHE_DIR = path.join(__dirname, '..', 'cache');

/*::
type DataCb = (error: Error | null, data: any) => void;
*/

function callbackToPromise() /*: { cb: DataCb, promise: Promise<any> } */ {
  let cb = () => {};
  const promise = new Promise((resolve, reject) => {
    cb = (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    };
  });

  return { cb, promise };
}

/**
 * Get a cache key. If it doesn't exist, the given getter will be
 * called to provide a value, and that value will be called.
 *
 * The getter will be passed a callback; it can either call the
 * callback with (err, data) or it can return a Promise that
 * resolves to data.
 */
exports.get = function getKey(
  key /*: Array<string> */,
  getter /*: (cb: DataCb) => Promise<any> | void */
) /*: Promise<any> */ {
  const filename = path.join(CACHE_DIR, ...key) + '.json';

  if (fs.existsSync(filename)) {
    return Promise.resolve(JSON.parse(fs.readFileSync(filename, {
      encoding: 'utf-8'
    })));
  }

  let { cb, promise } = callbackToPromise();
  let result = getter(cb);

  if (result instanceof Promise) {
    cb = null;
    promise = result;
  }

  return promise.then(function(data) {
    const dirname = path.dirname(filename);

    mkdirpSync(dirname);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    return data;
  });
}

/**
 * Converts a URL to a cache key. This algorithm can result in
 * key collisions but should be good enough for our purposes.
 */
exports.urlToCacheKey = function(
  url /*: string */
) /*: Array<string> */ {
  const info = urlParse(url);
  let path = (slugify((info.pathname || '/').slice(1).replace(/\//g, '__'))
              || '__index');

  if (info.search) {
    path += '_' + slugify(info.search);
  }

  return [slugify(info.host), path];
}
