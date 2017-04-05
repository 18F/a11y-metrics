// @flow

const React = require('react');

class StaticPage extends React.Component {
  /*::
  props: {
    title: string;
    html: string;
    id: string;
  }
  */

  render() {
    const html = {
      __html: this.props.html
    };

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="style.css" />
          <title>{this.props.title}</title>
        </head>
        <body>
          <div id={this.props.id} dangerouslySetInnerHTML={html}></div>
          <script src="bundle.js"></script>
        </body>
      </html>
    );
  }
}

module.exports = StaticPage;
