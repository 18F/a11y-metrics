// @flow

/*::
export type TableSort = 'homepage' | 'repo' | 'issues' | 'axe-v' | 'axe-p';

export type TableSortConfig = {
  sortBy: TableSort,
  isDescending: boolean
};
*/

const querystring = require('querystring');
const React = require('react');

const SORT_HOME = 'homepage';
const SORT_REPO = 'repo';
const SORT_ISSU = 'issues';
const SORT_AXEV = 'axe-v';
const SORT_AXEP = 'axe-p';

const DEFAULT_SORT = SORT_REPO;
const DEFAULT_IS_DESCENDING = false;

class HistorySync extends React.Component {
  /*::
  props: {
    onChange: (TableSortConfig) => void;
    sortBy: TableSort;
    isDescending: boolean;
  };
  handleHashChange: () => void;
  */

  componentDidMount() {
    this.handleHashChange = () => {
      const sort = HistorySync.parseHash(window.location.hash);

      if (sort.sortBy !== this.props.sortBy ||
          sort.isDescending !== this.props.isDescending) {
        this.props.onChange(sort);
      }
    };
    window.addEventListener('hashchange', this.handleHashChange);
    this.handleHashChange();
  }

  componentDidUpdate() {
    const hash = HistorySync.stringifyHash(this.props);
    if (hash !== window.location.hash) {
      window.location.hash = hash;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  static parseHash(hash /*: string */) /*: TableSortConfig */ {
    const parts = querystring.parse(hash.slice(1));
    let sortBy = parts['sort'];
    let isDescending = DEFAULT_IS_DESCENDING;

    if (parts['desc'] === 'on') {
      isDescending = true;
    }

    switch (sortBy) {
      case SORT_HOME:
      case SORT_REPO:
      case SORT_ISSU:
      case SORT_AXEV:
      case SORT_AXEP:
        break;
      default:
        sortBy = DEFAULT_SORT;
    }

    return {sortBy, isDescending};
  }

  static stringifyHash(sort /*: TableSortConfig */) /*: string */ {
    if (sort.sortBy === DEFAULT_SORT &&
        sort.isDescending === DEFAULT_IS_DESCENDING) {
      return '';
    }

    // We're not using querystring.stringify() here because we want
    // a deterministic ordering.

    let parts = [];

    if (sort.sortBy !== DEFAULT_SORT) {
      parts.push('sort=' + encodeURIComponent(sort.sortBy));
    }

    if (sort.isDescending) {
      parts.push('desc=on');
    }

    return '#' + parts.join('&');
  }

  render() {
    return null;
  }
}

module.exports = {
  HistorySync,
  SORT_HOME,
  SORT_REPO,
  SORT_ISSU,
  SORT_AXEV,
  SORT_AXEP,
  DEFAULT_SORT,
  DEFAULT_IS_DESCENDING
};
