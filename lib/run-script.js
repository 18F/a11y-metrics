// @flow

/**
 * Run the given promise-generating function as a main script. If any
 * errors are raised by the promise, a traceback will be printed and
 * the process will exit with a nonzero exit code.
 */
module.exports = function runScript(main /*: () => Promise<any> */) {
  main().catch(err => {
    // Note that node will eventually do this by default.
    console.log(err);
    process.exit(1);
  });
};
