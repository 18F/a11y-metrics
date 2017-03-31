// @flow

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const putil = require('./process-util');

const ROOT_DIR = path.join(__dirname, '..', '..');
const HOST_UID = fs.statSync(ROOT_DIR).uid;
const HOST_USER = process.env.HOST_USER || 'code_executor_user';
const USER_OWNED_DIRS = (process.env.USER_OWNED_DIRS || '')
  .split(':').filter(dir => !!dir);

if (!process.getuid) throw new Error('process.getuid() is unavailable!');

function getUsernameForUid(uid /*: number */) /*: string */ {
  return execSync(
    `awk -v val=${uid} -F ":" '$3==val{print $1}' /etc/passwd`,
    {encoding: 'ascii'}
  ).trim();
}

if (HOST_UID !== process.getuid()) {
  let username = getUsernameForUid(HOST_UID);

  if (!username) {
    username = HOST_USER;

    while (putil.successSync(`id -u ${username}`)) {
      username += '0';
    }

    console.log(`Configuring uid ${HOST_UID} as user ${username}...`);

    putil.runSync(
      'groupadd code_executor_group && ' +
      `useradd -d /home/${username} -m ${username} ` +
      `-g code_executor_group -u ${HOST_UID}`
    );
  }

  const home = `/home/${username}`;

  for (let dirname of [home, ...USER_OWNED_DIRS]) {
    if (fs.statSync(dirname).uid !== HOST_UID) {
      execSync(`chown -R ${username} ${dirname}`);
    }
  }

  process.env['HOME'] = home;

  if (!process.setuid) throw new Error('process.setuid() is unavailable!');

  process.setuid(HOST_UID);
}

putil.spawnAndBindLifetimeTo(process.argv[2], process.argv.slice(3));
