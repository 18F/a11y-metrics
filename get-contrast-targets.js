const axeStats = require('./cache/axe/calc.gsa.gov/__index');

const targets = [];

axeStats.violations.forEach(v => {
  v.nodes.forEach(n => {
    if (!(n.any.some(item => item.id === "color-contrast"))) {
      return;
    }
    n.target.forEach(sel => {
      targets.push({
        selector: sel,
        summary: n.failureSummary
      });
    });
  });
});

process.stdout.write(JSON.stringify(targets));
