// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import styles from './Sidebar.css';
import _ from 'lodash';
import SelectPeriod from './Sidebar/SelectPeriod.jsx';
import SelectLocations from './Sidebar/SelectLocations.jsx';
import SelectParameters from './Sidebar/SelectParameters.jsx';
import { Router, Route, Link, browserHistory } from 'react-router'


// import {} from '../actions.jsx';

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
      </div>
    );
  }
}

Sidebar.propTypes = {};

// function mapStateToProps(state) {
//   // This function maps the Redux state to React Props.
//   return {
//   };
// }

// export default connect(mapStateToProps)(App);

export default Sidebar;
