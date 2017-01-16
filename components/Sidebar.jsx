// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import styles from './Sidebar.css';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import SelectPeriod from './Sidebar/SelectPeriod.jsx';
import SelectLocations from './Sidebar/SelectLocations.jsx';
import SelectParameters from './Sidebar/SelectParameters.jsx';
import { Router, Route, Link, browserHistory } from 'react-router'

import {
  resetAllFilters,
} from '../actions.jsx';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  render() {
    return (
      <div className={styles.Sidebar}>
        <SelectPeriod {...this.props} />
        <SelectLocations {...this.props} />
        <SelectParameters {...this.props} />
        <Button
          onClick={() => {
            this.props.dispatch(resetAllFilters());
            window.location.reload();
          }}
          bsStyle='warning'
          bsSize='xsmall'>Reset</Button>
      </div>
    );
  }
}

Sidebar.propTypes = {};

export default Sidebar;
