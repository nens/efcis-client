// @flow
import React, { Component, PropTypes } from 'react';
import styles from './MapStatisticsPicker.css';

import {
  setMapStatistics,
  fetchFeatures,
} from '../actions.jsx';

class MapStatisticsPicker extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  render() {
    const { dispatch, opnames } = this.props;
    const krwOptions = [
      {
        label: 'Laatste',
        name: 'lastval',
      }, {
        label: 'Aantal',
        name: 'amount',
      }, {
        label: 'Min',
        name: 'min',
      }, {
        label: 'Max',
        name: 'max',
      }, {
        label: 'Std',
        name: 'stdev',
      }, {
        label: 'Mean',
        name: 'mean',
      }, {
        label: 'Median',
        name: 'median',
      }, {
        label: 'Q1',
        name: 'q1',
      }, {
        label: 'Q3',
        name: 'q3',
      }, {
        label: 'P10',
        name: 'p10',
      }, {
        label: 'P90',
        name: 'p90',
      }, {
        label: 'Zomer',
        name: 'summer',
      }, {
        label: 'Winter',
        name: 'winter',
      },
    ];

    const listSize = krwOptions.length;
    const list = krwOptions.map((item, i) => {
        return (
          <span
            key={i}
            ref='item'
            onClick={() => {
              dispatch(setMapStatistics(item.name));
              dispatch(fetchFeatures());
            }}
            style={{
              marginRight: 0,
              fontWeight: (item.name === opnames.map_statistics) ?
                'bold' : '',
              borderBottom: (item.name === opnames.map_statistics) ?
                '1px dashed #46f' : '',
            }}>
            {item.label} {(i !== (listSize - 1)) ? '/ ' : ''}
          </span>
        );
    });

    return (
      <span
        style={{
          float: 'right',
          margin: '5px 15px 0 0',
          cursor: 'pointer',
        }}>
        {list}
      </span>
    );
  }
}

MapStatisticsPicker.propTypes = {
  dispatch: PropTypes.func,
  opnames: PropTypes.object,
};

export default MapStatisticsPicker;
