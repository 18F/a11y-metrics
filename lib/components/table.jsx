// @flow

const React = require('react');

const { QUERY } = require('../config');
const { shortenUrl, cmpStr } = require('../util');
const {
  SORT_HOME,
  SORT_REPO,
  SORT_ISSU,
  SORT_AXEV,
  SORT_AXEP,
} = require('./history-sync');

/*::
import type {Website} from '../websites';
import type {TableSort, TableSortConfig} from './history-sync';

export type BasicAxeViolation = {
  kind: string;
  nodeCount: number;
  helpUrl: string;
};

type BasicAxeStats = {
  violations: Array<BasicAxeViolation>;
  passes: number;
};

export type Record = {
  website: Website;
  issueCount: number;
  axeStats: BasicAxeStats;
};
*/

function AxeViolationsCell(props /*: { violations: Array<BasicAxeViolation> } */) {
  if (props.violations.length === 0) {
    return <span>{props.violations.length}</span>;
  }
  return (
    <details>
      <summary>{props.violations.length}</summary>
      <ul>
        {props.violations.map(v => (
          <li key={v.kind}>
            {v.kind} ({v.nodeCount} {v.nodeCount === 1 ? 'node' : 'nodes'})
          </li>
        ))}
      </ul>
    </details>
  );
}

class Row extends React.Component {
  /*::
  props: {
    website: Website;
    issueCount: number;
    axeStats: BasicAxeStats;
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
        <td className="axe-violations">
          <AxeViolationsCell violations={this.props.axeStats.violations}/>
        </td>
        <td>{this.props.axeStats.passes}</td>
      </tr>
    );
  }
}

/*::
type HeaderProps = {
  sort: TableSort;
  currSort: TableSort;
  isDescending: boolean;
  onSort: (TableSort) => void;
  isEnhanced: boolean;
  children?: any;
};
*/

function Header(props /*: HeaderProps */) {
  if (!props.isEnhanced) {
    return <th>{props.children}</th>;
  }

  const handleClick = () => props.onSort(props.sort);
  const isSorted = props.sort === props.currSort;
  let ariaLabel;

  if (isSorted) {
    if (props.isDescending) {
      ariaLabel = "sorted descending, select to sort ascending";
    } else {
      ariaLabel = "sorted ascending, select to sort descending";
    }
  } else {
    ariaLabel = "unsorted, select to sort ascending";
  }

  return (
    <th>
      <div className="sortable">
        <div className="sort-toggler">
          <button onClick={handleClick}
                  title={ariaLabel} aria-label={ariaLabel}>
            {props.children}
          </button>
        </div>
        <span className="sort-indicator" data-is-sorted={isSorted}
              data-is-descending={props.isDescending}
              aria-hidden="true" />
      </div>
    </th>
  );
}

/*::
type TableProps = {
  records: Array<Record>;
  isEnhanced: boolean;
  sortBy: TableSort;
  isDescending: boolean;
  onSortChange: (TableSortConfig) => void;
};
*/

class Table extends React.Component {
  /*::
  props: TableProps;

  handleSort: (TableSort) => void;
  */

  constructor(props /*: TableProps */) {
    super(props);

    this.handleSort = sortBy => {
      if (this.props.sortBy === sortBy) {
        this.props.onSortChange({
          sortBy,
          isDescending: !this.props.isDescending
        });
      } else {
        this.props.onSortChange({
          sortBy,
          isDescending: false
        });
      }
    };
  }

  sortRecords() {
    const records = this.props.records.slice();

    switch (this.props.sortBy) {
      case SORT_HOME:
        records.sort((a, b) => cmpStr(a.website.homepage,
                                      b.website.homepage));
        break;
      case SORT_REPO:
        records.sort((a, b) => cmpStr(a.website.repo, b.website.repo));
        break;
      case SORT_ISSU:
        records.sort((a, b) => (a.issueCount - b.issueCount));
        break;
      case SORT_AXEV:
        records.sort((a, b) => (a.axeStats.violations.length -
                                b.axeStats.violations.length));
        break;
      case SORT_AXEP:
        records.sort((a, b) => (a.axeStats.passes -
                                b.axeStats.passes));
        break;
    }

    if (this.props.isDescending) {
      records.reverse();
    }

    return records;
  }

  render() {
    const records = this.sortRecords();
    const headerProps = {
      currSort: this.props.sortBy,
      isDescending: this.props.isDescending,
      onSort: this.handleSort,
      isEnhanced: this.props.isEnhanced
    };

    return (
      <table>
        <thead>
          <tr>
            <Header sort={SORT_HOME} {...headerProps}>
              Homepage
            </Header>
            <Header sort={SORT_REPO} {...headerProps}>
              GitHub repository
            </Header>
            <Header sort={SORT_ISSU} {...headerProps}>
              GitHub a11y issues
            </Header>
            <Header sort={SORT_AXEV} {...headerProps}>
              aXe violations
            </Header>
            <Header sort={SORT_AXEP} {...headerProps}>
              aXe passes
            </Header>
          </tr>
        </thead>
        <tbody>
          {records.map(record =>
            <Row key={record.website.repo} {...record}/>
          )}
        </tbody>
      </table>
    );
  }
}

module.exports = Table;
