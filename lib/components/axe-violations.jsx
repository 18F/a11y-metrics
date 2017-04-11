// @flow

const React = require('react');

const { cmpStr } = require('../util');

/*::
import type {Record, BasicAxeViolation} from './table';

type Props = {
  records: Array<Record>;
};

export type AxeViolationStat = {
  name: string;
  helpUrl: string;
  count: number;
};
*/

function getAxeViolationStats(
  violations /*: Array<BasicAxeViolation> */
) /*: Array<AxeViolationStat> */ {
  const violationsMap /*: { [string]: number } */ = {};
  const helpUrlsMap /*: { [string]: string } */ = {};

  violations.forEach(v => {
    if (!(v.kind in violationsMap)) {
      violationsMap[v.kind] = 0;
      helpUrlsMap[v.kind] = v.helpUrl;
    }
    violationsMap[v.kind]++;
  });

  const violationStats = Object.keys(violationsMap).map(key => ({
    name: key,
    helpUrl: helpUrlsMap[key],
    count: violationsMap[key]
  }));

  violationStats.sort((a, b) => {
    if (b.count === a.count) {
      return cmpStr(a.name, b.name);
    }
    return b.count - a.count;
  });

  return violationStats;
}

function flattenViolations(
  records /*: Array<Record> */
) /*: Array<BasicAxeViolation> */ {
  const violations = [];

  records.forEach(r => {
    r.axeStats.violations.forEach(v => {
      violations.push(v);
    });
  });

  return violations;
}

function uniqueWebpages(
  records /*: Array<Record> */
) /*: Array<Record> */ {
  const pages = {};

  return records.filter(r => {
    if (r.website.homepage in pages) {
      return false;
    }
    pages[r.website.homepage] = true;
    return true;
  });
}

function AxeViolations(props /*: Props */) {
  const violations = flattenViolations(uniqueWebpages(props.records));
  const violationStats = getAxeViolationStats(violations);

  return (
    <table>
      <thead>
        <tr>
          <th>Violation name</th>
          <th>Homepages with violation</th>
        </tr>
      </thead>
      <tbody>
        {violationStats.map(v =>
          <tr key={v.name}>
            <td><a href={v.helpUrl}>{v.name}</a></td>
            <td>{v.count}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

module.exports = {
  AxeViolations,
  getAxeViolationStats,
  flattenViolations,
  uniqueWebpages
};
