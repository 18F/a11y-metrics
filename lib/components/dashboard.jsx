// @flow

const React = require('react');
const urlParse = require('url').parse;

const { ORG, QUERY } = require('../config');

/*::
import type {Website} from '../websites';
import type {AxeStats} from '../axe-stats';

type Record = {
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

class Dashboard extends React.Component {
  /*::
  props: {
    records: Array<Record>
  };
  */

  render() {
    const title = `${ORG} Accessibility dashboard`;

    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="style.css" />
          <title>{title}</title>
        </head>
        <body>
          <h1>{title}</h1>
          <p>
            This is an early-stage prototype dashboard for {ORG} to track the accessibility characteristics across all its projects.
          </p>
          <p>
            Notes:
          </p>
          <ul>
            <li>
              This dashboard is accurate as of {new Date().toLocaleDateString()}.
            </li>
            <li>
              For more details on how repositories are chosen, see the <a href="https://github.com/18F/a11y-metrics#readme">GitHub README</a>.
            </li>
            <li>
              The <strong>GitHub a11y issues</strong> count is found by searching for both open and closed issues in a project's repository matching the query <code>{QUERY}</code>.
            </li>
            <li>
              THe <strong>aXe violations</strong> and <strong>aXe passes</strong> counts are found by visiting a project's homepage using Deque Systems' <a href="https://github.com/dequelabs/axe-core">aXe-core</a> tool.
              {' '}
              For more detailed information, please visit the project's homepage using the <a href="https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US">aXe Chrome plugin</a>.
            </li>
          </ul>
          <p>
            If you have any other questions or concerns, feel free to file a <a href="https://github.com/18F/a11y-metrics/issues">GitHub issue</a>!
          </p>
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
        </body>
      </html>
    );
  }
}

module.exports = Dashboard;
