// @flow

const React = require('react');
const urlParse = require('url').parse;

const { QUERY } = require('../config');

/*::
import type {Website} from '../websites';
import type {AxeStats} from '../axe-stats';

export type Record = {
  website: Website;
  issueCount: number;
  axeStats: AxeStats;
};
*/

function shortenUrl(url /*: string */) /*: string */ {
  const info = urlParse(url);

  if (!(info.hostname && info.pathname))
    return url;

  let short = info.hostname + info.pathname;

  if (/\/$/.test(short)) {
    short = short.slice(0, -1);
  }

  return short;
}

class Row extends React.Component {
  /*::
  props: {
    website: Website;
    issueCount: number;
    axeStats: AxeStats;
  };
  */

  render() {
    const homepage = this.props.website.homepage;
    const shortHomepage = shortenUrl(homepage);
    const repo = this.props.website.repo;
    const repoUrl = `https://github.com/${repo}`;
    const q = encodeURIComponent(QUERY);
    const issuesUrl = `https://github.com/${repo}/search?q=${q}&type=Issues`;

    return (
      <tr>
        <td><a href={homepage}>{shortHomepage}</a></td>
        <td><a href={repoUrl}>{repo}</a></td>
        <td><a href={issuesUrl}>{this.props.issueCount}</a></td>
        <td>{this.props.axeStats.violations.length}</td>
        <td>{this.props.axeStats.passes.length}</td>
      </tr>
    );
  }
}

class Table extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Homepage</th>
            <th>GitHub repository</th>
            <th>GitHub a11y issues</th>
            <th>aXe violations</th>
            <th>aXe passes</th>
          </tr>
        </thead>
        <tbody>
          {this.props.records.map(record => 
            <Row key={record.website.repo} {...record}/>
          )}
        </tbody>
      </table>
    );
  }
}

module.exports = Table;
