// @flow
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import {
  fetchCharts,
} from '../actions.jsx';

class SelectSeries extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(fetchCharts());
  }

  componentWillUnmount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}


  render() {
    return (
      <div>
        <div className='row'>
          <div className='col-md-6'>
            <ul style={{
              height: 600,
              overflowY: 'scroll',
            }}>
              {this.props.opnames.charts.map((chart, i) => {
                return (
                  <li key={i}
                      style={{ cursor: 'pointer' }}>
                      {chart.wns} - {chart.location}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='col-md-6' style={{ borderLeft: '1px solid #ccc'}}>
            ..
          </div>
        </div>
      </div>
    );
  }
}

SelectSeries.propTypes = {};


export default SelectSeries;
