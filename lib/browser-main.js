// @flow

const React = require('react');
const ReactDOM = require('react-dom');

const Dashboard = require('./components/dashboard');
const { ELEMENT_ID, JSON_FILENAME } = require('./config');

const IS_JS_DISABLED = /nojs=on/i.test(window.location.search);

function render(props) {
  ReactDOM.render(
    React.createElement(Dashboard, props),
    document.getElementById(ELEMENT_ID)
  );
}

function main() {
  const req = new XMLHttpRequest();

  req.open('GET', JSON_FILENAME);
  req.responseType = 'json';
  req.addEventListener('load', () => {
    render(req.response);
  });
  req.send(null);
}

if (process.env.APP_ENV == 'browser' && !IS_JS_DISABLED) {
  main();
}
