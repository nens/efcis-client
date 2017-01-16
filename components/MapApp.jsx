// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import GeoJsonUpdatable from '../lib/GeoJsonUpdatable.jsx';
import { Wave } from 'better-react-spinkit';
import sharedStyles from './SharedStyles.css';
import styles from './MapApp.css';
import TopNav from './TopNav.jsx';
import Sidebar from './Sidebar.jsx';
import _ from 'lodash';
import $ from 'jquery';
import L from 'leaflet';

// import {} from '../actions.jsx';

class MapApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      features: [],
      isFetching: false,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadMapData = this.loadMapData.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    this.loadMapData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {
    this.loadMapData();
  }

  loadMapData() {
    this.setState({
      isFetching: true,
    });
    $.ajax({
      url: '/api/map/',
      type: 'post',
      dataType: 'json',
      data: {
        color_by: '',
        start_date: this.props.opnames.start_date,
        end_date: this.props.opnames.end_date,
        meetnets: this.props.opnames.meetnets.join(','),
        locations: this.props.opnames.locationIds.join(','),
      },
      success: (data) => {
        this.setState({
          features: data.features,
          isFetching: false,
        });
        return data;
      },
    });
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  render() {
    const position = [52.0741, 5.1432];
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
              style={{
                opacity: (this.state.isFetching) ? 0.5 : 1,
              }}
              className={styles.Map}
              center={position} zoom={11}>
              <TileLayer
                url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJsonUpdatable
                data={this.state.features}
                pointToLayer={(feature, latlng) => {
                  const geojsonMarkerOptions = {
                    radius: 8,
                    fillColor: '#ff0000',
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8,
                  };
                  return L.circleMarker(latlng, geojsonMarkerOptions);
                }}
                // filter={(f) => console.log('filter', f)}
              />
            </Map>
            {(this.state.isFetching) ?
              <div style={{
                position: 'absolute',
                left: this.state.width / 2.7,
                top: 200,
                zIndex: 9999,
              }}>
                <Wave size={50} />
              </div> : ''
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MapApp.propTypes = {};


function mapStateToProps(state) {
  // This function maps the Redux state to React Props.
  return {
    'opnames': state.opnames,
  };
}


export default connect(mapStateToProps)(MapApp);
