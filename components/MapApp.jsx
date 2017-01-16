// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import { ButtonGroup, Button, Modal } from 'react-bootstrap';
import GeoJsonUpdatable from '../lib/GeoJsonUpdatable.jsx';
import { Wave } from 'better-react-spinkit';
import sharedStyles from './SharedStyles.css';
import styles from './MapApp.css';
import TopNav from './TopNav.jsx';
import Sidebar from './Sidebar.jsx';
import _ from 'lodash';
import $ from 'jquery';
import L from 'leaflet';

import {
  fetchFeatures,
} from '../actions.jsx';

class MapApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      showColorByModal: false,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.hideColorByModal = this.hideColorByModal.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    this.props.dispatch(fetchFeatures());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  hideColorByModal() {
    this.setState({
      showColorByModal: false,
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
            <div className='col-md-10' style={{ height: this.state.height - 180 }}>
            <Map
              style={{
                opacity: (this.props.opnames.isFetching) ? 0.5 : 1,
              }}
              className={styles.Map}
              center={position} zoom={11}>
              <TileLayer
                url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJsonUpdatable
                data={this.props.opnames.features.features}
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
            {(this.props.opnames.isFetching) ?
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
          <div className='row'>
            <div className='col-md-12'>
              <hr/>
              <ButtonGroup className='pull-right'>
                <Button
                  onClick={() => this.setState({ showColorByModal: true })}>
                  <i className='fa fa-paint-brush'></i>&nbsp;Selecteer parameter
                </Button>
                <Button
                  onClick={() => this.setState({ showSettingsModal: true })}>
                  <i className='fa fa-cog'></i>&nbsp;Legenda instellingen
                </Button>
              </ButtonGroup>
            </div>
          </div>

        </div>

        <Modal
          {...this.props}
          show={this.state.showColorByModal}
          onHide={this.hideColorByModal}>
          <Modal.Header closeButton>
            <Modal.Title id='colorbymodal'>Selecteer parameter om op te kleuren</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          ...
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              console.log('select and close');
            }}>Selecteren &amp; sluiten</Button>
          </Modal.Footer>
        </Modal>
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
