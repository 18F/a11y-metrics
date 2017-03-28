const fs = require('fs');
const path = require('path');

module.exports = function(p) {
  const partsSoFar = [];

  if (/^win/.test(process.platform)) {
    throw new Error('this function is not currently compatible with Windows');
  }

  p.split(path.sep).forEach(part => {
    partsSoFar.push(part);

    const dirname = '/' + path.join(...partsSoFar);

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }
  });
}
