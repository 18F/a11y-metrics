const fs = require('fs');
const path = require('path');

const mkdirpSync = require('./mkdirp-sync');

const CACHE_DIR = path.join(__dirname, '..', 'cache');

function callbackToPromise() {
  let cb;
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
exports.get = function getKey(key, getter) {
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