// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import sharedStyles from './SharedStyles.css';
import styles from './MapApp.css';
import TopNav from './TopNav.jsx';
import Sidebar from './Sidebar.jsx';
import _ from 'lodash';

// import {} from '../actions.jsx';

class MapApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  render() {
    const position = [52.0741, 5.3032];
    return (
      <div>
        <div className='container-fluid'>
          <TopNav {...this.props} />
          <div className={`row ${sharedStyles.MainDiv}`}>
            <div className='col-md-2'>
            <Sidebar {...this.props} />
            </div>
            <div className='col-md-10' style={{ height: this.state.height - 150 }}>
            <Map
              className={styles.Map}
              center={position} zoom={8}>
              <TileLayer
                url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
            </Map>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MapApp.propTypes = {};

export default MapApp;
