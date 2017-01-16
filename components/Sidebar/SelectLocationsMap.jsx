import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import styles from './SelectLocationsMap.css';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import L from 'leaflet';
import $ from 'jquery';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet.markercluster';
import hdsrMaskData from '../../lib/hdsr-mask.json';
import krwAreas from '../../lib/kwr-areas.json';
import afvoergebieden from '../../lib/afvoergebieden.json';

require("!style!css!../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css");
require("!style!css!../../node_modules/leaflet.markercluster/dist/MarkerCluster.css");
require("!style!css!../../node_modules/leaflet-draw/dist/leaflet.draw.css");


class SelectLocationsMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      meetnet: [],
    };
    this.clusteredMarkers = new L.MarkerClusterGroup({
      disableClusteringAtZoom: 12,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
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

  retrieveLocations(meetStatusIds) {
    const results = self.state.maplocations;
    if (!results) {
      $.getJSON('/api/locaties/?page_size=100000000', (data) => {
        this.setState({
          maplocations: data.results,
          filteredMapLocations: data.results,
        });
        this.setLocationsOnMap(data.results, meetStatusIds);
      });
    }
    else {
      this.setLocationsOnMap(results, meetStatusIds);
    }
    return;
  }

  setLocationsOnMap(results, desiredStatusIds) {
    // Show all location when meetStatusIds contains "-1"
    const map = this.refs.mapElement;
    const filteredMapLocations = [];

    results.map((result) => {
      const meetStatus = result.properties.meet_status_id;
      if (!desiredStatusIds) {
        return;
      }
      if (!((desiredStatusIds.indexOf('-1') > -1) ||
            (desiredStatusIds.indexOf(meetStatus + '') > -1))) {
        return;
      }
      if (result.geometry) {
        filteredMapLocations.push(result);
        const marker = L.geoJson(result, {
          pointToLayer: (feature, latlng) => {
            const geojsonMarkerOptions = {
              radius: 8,
              fillColor: this.getFillColor(feature),
              color: '#fff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
          },
        });
        marker.on('click', () => {
          this.bindPopup(this.popupContent(result))
              .openPopup();
        });
        this.clusteredMarkers.addLayer(marker);
      }
    });
    this.setState({
      filteredMapLocations: filteredMapLocations,
    });
    this.clusteredMarkers.addTo(map);
    this.clusteredMarkers.bringToFront();
  }

  render() {

    const position = [52.0741, 5.1432];

    return (
      <Map
        ref='mapElement'
        className={styles.Map}
        center={position} zoom={11}>
        <TileLayer
          url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          onEachFeature={(feature, layer) => {
            layer.setStyle({
              fillColor: '#ffffff',
              color: '#ffffff',
              opacity: 1,
              fillOpacity: 1,
            });
          }}
          data={hdsrMaskData} />
        <GeoJSON
          data={krwAreas} />
        <GeoJSON
          onEachFeature={(feature, layer) => {
            layer.setStyle({
              'fillColor': 'pink',
              'color': '#fff',
              'weight': 2,
              'opacity': 1,
              'dashArray': 3,
              'fillOpacity': 0.3,
            });
            layer.on('mouseover', function(e) {
              this.setStyle({
                'fillColor': 'purple',
              });
            });
            layer.on('mouseout', function(e) {
              this.setStyle({
                'fillColor': 'pink',
              });
            });
          }}
          data={afvoergebieden} />
        <TileLayer
          url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.0a5c8e74/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
    );
  }
}

SelectLocationsMap.propTypes = {};

export default SelectLocationsMap;
