import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import styles from './SelectLocationsMap.css';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import L from 'leaflet';
import $ from 'jquery';
import { Map, Marker, Popup, LayersControl,
  TileLayer, GeoJSON } from 'react-leaflet';
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
      mapLocations: [],
    };
    this.clusteredMarkers = new L.MarkerClusterGroup({
      // disableClusteringAtZoom: 14,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });
    this.updateDimensions = this.updateDimensions.bind(this);
    this.setLocationsOnMap = this.setLocationsOnMap.bind(this);
    this.retrieveLocations = this.retrieveLocations.bind(this);
    // this.drawnItems = new L.FeatureGroup();
    // this.drawControl = new L.Control.Draw({
    //     edit: false,
    //     draw: {
    //         polyline: false,
    //         circle: false,
    //         marker: false,
    //         rectangle: false
    //     }
    // });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    const self = this;
    const map = this.refs.mapElement.leafletElement;
    $.ajax({
      dataType: 'json',
      url: config.locationsUrl,
      success: (data) => {
        self.setState({
          mapLocations: data.results,
        }, () => {
          self.setLocationsOnMap(data.results, [-1]);
        });
      }
    });
    $.ajax({
      dataType: 'json',
      url: config.meetStatusUrl,
      success: (data) => {
        let meetStatusHtmlElement = `<select
          multiple style="height: 170px; margin-right: -8px !important;
          margin-left: 9px !important;"
          class="form-control" id="meet_status_id">
          <option value="-1" selected>Alles</option>`;
        data.map((item) => {
          meetStatusHtmlElement += `<option value="${item.id}"
            title="${item.omschrijving}">${item.naam}</option>`;
        });
        meetStatusHtmlElement += '</select>';

        let legend = L.control({ position: 'topright' });
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = meetStatusHtmlElement;
            div.onchange = (e) => {
              const selectedValues = self
                .getSelectValues(e.srcElement)
                .map((x) => parseInt(x));
              self.reloadMap(selectedValues);
            }
            return div;
        };
        legend.addTo(map);
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  popupContent(result) {
    return `<dl class="dl-horizontal" width="200" style="overflow:hidden;">
        <dt style="width:80px;">ID</dt>
        <dd style="width:300px;margin-left:100px !important;">${result.properties.loc_id}</dd>
        <dt style="width:80px;">Omschrijving</dt>
        <dd style="width:300px;margin-left:100px !important;">${result.properties.loc_oms}</dd>
        <dt style="width:80px;">Meetstatus</dt>
        <dd style="width:300px;margin-left:100px !important;">${result.properties.meet_status_naam}</dd>
        </dl>`;
  }

  setLocationsOnMap(results, desiredStatusIds) {

      //show all location when meetStatusIds contains "-1"
      var self = this;
      var filteredMapLocations = [];
      results.map((result) => {
          // console.log('desiredStatusIds', desiredStatusIds)
          var meetStatus = result.properties.meet_status_id;
          // if (!desiredStatusIds){
          //   return;
          // }
          if (!((desiredStatusIds.indexOf(-1) > -1) || (desiredStatusIds.indexOf(meetStatus) > -1))) {
            return;
          }
          if(result.geometry) {
              filteredMapLocations.push(result);
              var marker = L.geoJson(result, {
                  pointToLayer: function (feature, latlng) {
                      var geojsonMarkerOptions = {
                          radius: 8,
                          fillColor: self.getFillColor(feature),
                          color: "#fff",
                          weight: 2,
                          opacity: 1,
                          fillOpacity: 0.8
                      };
                      return L.circleMarker(latlng, geojsonMarkerOptions);
                  }
              });
              marker.on('click', function(e) {
                  this.bindPopup(self.popupContent(result))
                      .openPopup();
              });
              self.clusteredMarkers.addLayer(marker);
          }
      });
      self.setState({
          filteredMapLocations: filteredMapLocations
      });
      self.clusteredMarkers.addTo(self.refs.mapElement.leafletElement);
      self.clusteredMarkers.bringToFront();
  }

  getSelectValues(select) {
      let result = [];
      let options = select && select.options;
      let opt;

      for (var i=0, iLen=options.length; i<iLen; i++) {
          opt = options[i];

         if (opt.selected) {
             result.push(opt.value || opt.text);
         }
      }
      return result;
  }


  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  retrieveLocations(meetStatusIds) {
    const results = this.state.mapLocations;
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



reloadMap(meetStatusIds) {
     this.clusteredMarkers.clearLayers();
     this.retrieveLocations(meetStatusIds);
 }

 getFillColor(feature) {
     var selectedLocations = [];
     try {
         selectedLocations = JSON.parse(localStorage.getItem('selectedLocations'));
     } catch(e) {}
     try {
         if(selectedLocations[feature.id] !== undefined) {
             return '#FC625D'; // if the location is selected, color it red
         } else {
             return '#337AB7'; // if the location is not selected, color it blue
         }
     } catch(e) {
         return '#337AB7';
     }
 }

  render() {

    const position = [52.0741, 5.1432];

    return (
      <Map
        ref='mapElement'
        className={styles.Map}
        center={position}
        maxZoom={22}
        zoom={11}>
        <LayersControl position='topright'>
          <LayersControl.BaseLayer name='Topografisch' checked={true}>
            <TileLayer
              url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='Satelliet'>
            <TileLayer
              url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa79205/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name='Masker'>
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
          </LayersControl.Overlay>
          <LayersControl.Overlay name='KRW Waterlichamen'>
            <GeoJSON
              data={krwAreas} />
          </LayersControl.Overlay>
          <LayersControl.Overlay name='Afvoergebieden'>
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
                layer.on('click', (e) => {
                  console.log('click', e);

                  // console.log('layer', layer);
                  // console.log('feature', feature);
                })
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
          </LayersControl.Overlay>
        </LayersControl>



        {/* {this.state.mapLocations.map((location, i) => {
            if (_.has(location.geometry, 'coordinates')) {
              return (
                <Marker
                  key={i}
                  position={[
                    location.geometry.coordinates[1],
                    location.geometry.coordinates[0]
                  ]} />
              );
            }
          }
        )} */}

      </Map>
    );
  }
}

SelectLocationsMap.propTypes = {};

export default SelectLocationsMap;
