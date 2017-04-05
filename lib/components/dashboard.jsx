// @flow

const React = require('react');
const urlParse = require('url').parse;

const {
  HistorySync,
  DEFAULT_SORT,
  DEFAULT_IS_DESCENDING
} = require('./history-sync');
const Preamble = require('./preamble');
const Table = require('./table');

/*::
import type {Record} from './table';
import type {TableSort, TableSortConfig} from './history-sync';

type DashboardProps = {
  title: string;
  createdAt: string;
  records: Array<Record>;
};

type DashboardState = {
  mounted: boolean;
  sortBy: TableSort;
  isDescending: boolean;
};
*/

class Dashboard extends React.Component {
  /*::
  props: DashboardProps;
  state: DashboardState;

  handleSortChange: (TableSortConfig) => void;
  */

  constructor(props /*: DashboardProps */) {
    super(props);
    this.state = {
      mounted: false,
      sortBy: DEFAULT_SORT,
      isDescending: DEFAULT_IS_DESCENDING
    };
    this.handleSortChange = sort => {
      this.setState(sort);
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    return (
      <div>
        <HistorySync sortBy={this.state.sortBy}
                     isDescending={this.state.isDescending}
                     onChange={this.handleSortChange} />
        <h1>{this.props.title}</h1>
        <Preamble createdAt={this.props.createdAt} />
        <Table sortBy={this.state.sortBy}
               isDescending={this.state.isDescending}
               onSortChange={this.handleSortChange}
               isEnhanced={this.state.mounted}
               records={this.props.records} />
      </div>
    );
  }
}

module.exports = Dashboard;
