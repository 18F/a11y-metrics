// @flow

const React = require('react');
const urlParse = require('url').parse;

const Preamble = require('./preamble');
const Table = require('./table');
const { ORG } = require('../config');

/*::
import type {Record} from './table';
*/

class Dashboard extends React.Component {
  /*::
  props: {
    records: Array<Record>
  };
  */

  render() {
    const title = `${ORG} Accessibility dashboard`;

    return (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="style.css" />
          <title>{title}</title>
        </head>
        <body>
          <h1>{title}</h1>
          <Preamble />
          <Table records={this.props.records} />
        </body>
      </html>
    );
  }
}

module.exports = Dashboard;
