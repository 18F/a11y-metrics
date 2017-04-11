// @flow

/**
 * This script is used to run a script with the following retry criteria:
 *
 *   * If the script produces no output (via stdout/stderr) for a given
 *     period of time, we retry it.
 *   * If the script exits with a non-zero exit code, we retry it.
 *
 * Once a maximum number of retries has been reached, we exit with
 * a non-zero exit code.
 */

const child_process = require('child_process');

const CMD = "node";
const ARGS = ["stats.js"];
const MS_PER_MINUTE = 1000 * 60;
const MAX_TIME_WITH_NO_OUTPUT_MS = 2 * MS_PER_MINUTE;
const MAX_RETRIES = 3;

function retry(
  cmd /*: string */,
  args /*: Array<string> */,
  max_time_with_no_output_ms /*: number */,
  retries /*: number */
) {
  const allArgs = JSON.stringify([cmd, ...args]);
  console.log(`Running ${allArgs}...`);

  const child = child_process.spawn(cmd, args);
  let timeout = 0;
  const cancelTimeout = () => {
    if (timeout) clearTimeout(timeout);
    timeout = 0;
  };
  const resetTimeout = () => {
    cancelTimeout();
    timeout = setTimeout(() => {
      console.log(
        `No output from process received in ` +
        `${max_time_with_no_output_ms}ms, killing it.`
      );
      child.kill();
    }, max_time_with_no_output_ms);
  };

  resetTimeout();

  child.stdout.on('data', resetTimeout);
  child.stderr.on('data', resetTimeout);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('exit', (code, signal) => {
    cancelTimeout();

    if (signal) {
      console.log(`Process exited via signal ${signal}.`);
    } else {
      console.log(`Process exited with code ${code}.`);
    }

    if (code === 0) {
      process.exit(0);
    } else if (retries) {
      console.log('Retrying...');
      retry(cmd, args, max_time_with_no_output_ms, retries - 1);
    } else {
      console.log('No more retries left, exiting.');
      process.exit(1);
    }
  });
}

if (module.parent === null) {
  retry(CMD, ARGS, MAX_TIME_WITH_NO_OUTPUT_MS, MAX_RETRIES);
}
