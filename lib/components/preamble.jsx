// @flow

const React = require('react');

const { ORG, QUERY } = require('../config');

class Preamble extends React.Component {
  /*::
  props: { createdAt: string };
  */

  render() {
    return (
      <div>
        <p>
          This is an early-stage prototype dashboard for {ORG} to track the accessibility characteristics across all its projects.
        </p>
        <p>
          Notes:
        </p>
        <ul>
          <li>
            This dashboard is accurate as of {new Date(this.props.createdAt).toLocaleDateString()}.
          </li>
          <li>
            For more details on how repositories are chosen, see the <a href="https://github.com/18F/a11y-metrics#readme">GitHub README</a>.
          </li>
          <li>
            The <strong>GitHub a11y issues</strong> count is found by searching for both open and closed issues in a project's repository matching the query <code>{QUERY}</code>.
          </li>
          <li>
            The <strong>aXe violations</strong> and <strong>aXe passes</strong> counts are found by visiting a project's homepage using Deque Systems' <a href="https://github.com/dequelabs/axe-core">aXe-core</a> tool.
            {' '}
            For more detailed information, please visit the project's homepage using the <a href="https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US">aXe Chrome plugin</a>.
          </li>
        </ul>
        <p>
          If you have any other questions or concerns, feel free to file a <a href="https://github.com/18F/a11y-metrics/issues">GitHub issue</a>!
        </p>
      </div>
    );
  }
}

module.exports = Preamble;
