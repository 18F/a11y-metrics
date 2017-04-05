// @flow

const React = require('react');
const ReactDOM = require('react-dom');

const Dashboard = require('./components/dashboard');

const dashboardProps = require('../static/records.json');

const { ELEMENT_ID } = require('./config');

ReactDOM.render(
  React.createElement(Dashboard, dashboardProps),
  document.getElementById(ELEMENT_ID)
);
