import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import styles from './SelectLocationsMap.css';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import L from 'leaflet';
import $ from 'jquery';
import { Map, Marker, Popup, LayersControl, FeatureGroup,
  TileLayer, GeoJSON } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet.markercluster';
import hdsrMaskData from '../../lib/hdsr-mask.json';
import krwAreas from '../../lib/kwr-areas.json';
import afvoergebieden from '../../lib/afvoergebieden.json';
import within from 'turf-within';

require("!style!css!../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css");
require("!style!css!../../node_modules/leaflet.markercluster/dist/MarkerCluster.css");
require("!style!css!../../node_modules/leaflet-draw/dist/leaflet.draw.css");


import {
  addLocationToSelection,
  removeLocationFromSelection,
  setLocations,
  reloadDataForBoxplots,
  reloadAllLineCharts,
  reloadDataForScatterplot,
 } from '../../actions.jsx';


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

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  // }

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
   const location = _.find(this.props.opnames.locations, (location) => {
     if (feature.id === location.id) return location;
   });
   if (location) {
     return '#FC625D'; // if the location is selected, color it red
   }
   else {
    return '#337AB7'; // if the location is not selected, color it blue
   }
 }


  render() {


    const KRW_AREA_COLORS = {"1": "#B6B6B4", "2": "#D1D0CE", "3": "#848482"};

    const position = [52.0741, 5.1432];
    const self = this;

    return (
      <Map
        ref='mapElement'
        className={styles.Map}
        center={position}
        maxZoom={22}
        zoom={11}>
        <FeatureGroup>
          <EditControl
            position='topleft'
            onEdited={(e) => console.log('edited')}
            onCreated={(e) => {
              const selectionPolygon = e.layer.toGeoJSON();
              const locationResults = {
                'type': 'FeatureCollection',
                'features': this.state.mapLocations.filter((location) => {
                  if (_.has(location.geometry, 'coordinates')) {
                    return location;
                  }
                  return false;
                }),
              };
              var withinFilter = {
                'type': 'FeatureCollection',
                'features': [
                  {
                    'type': 'Feature',
                    'properties': '',
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': selectionPolygon.geometry.coordinates,
                    },
                  },
                ],
              };
              const result = within(locationResults, withinFilter);
              const selectedLocations = result.features;
              const selectedLocationIds = result.features.map((location) => {
                return location.id;
              });
              this.props.dispatch(setLocations(selectedLocations));
              this.props.hideMapModal();
            }}
            onDeleted={(e) => console.log('deleted')}
            draw={{
              polyline: false,
              circle: false,
              rectangle: false,
              marker: false,
            }}
            edit={{
              remove: false,
            }}
          />

        </FeatureGroup>
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
              onEachFeature={(feature, layer) => {

                layer.setStyle({
                  'fillColor': KRW_AREA_COLORS[layer.feature.properties.krw_color],
                  'color': KRW_AREA_COLORS[layer.feature.properties.krw_color],
                  // 'weight': (this.props.opnames.map.zoom - 17) * -1,
                });
                layer.on('mouseover', (e) => {
                  layer.setStyle({
                    'fillColor': 'purple',
                  });
                });
                layer.on('mouseout', (e) => {
                  layer.setStyle({
                    'fillColor': 'pink',
                  });
                });

                layer.on('click', (e) => {
                  const locationResults = {
                    'type': 'FeatureCollection',
                    'features': this.state.mapLocations.filter((location) => {
                      if (_.has(location.geometry, 'coordinates')) {
                        return location;
                      }
                      return false;
                    }),
                  };
                  const withinFilter = {
                    'type': 'FeatureCollection',
                    'features': [
                      {
                        'type': 'Feature',
                        'properties': '',
                        'geometry': {
                          'type': 'MultiPolygon',
                          'coordinates': feature.geometry.coordinates,
                        },
                      },
                    ],
                  };
                  const result = within(locationResults, withinFilter);

                  const selectedLocations = result.features;
                  const selectedLocationIds = result.features.map((location) => {
                    return location.id;
                  });
                  this.props.dispatch(setLocations(selectedLocations));
                  this.props.hideMapModal();
                });
              }}
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
                  const locationResults = {
                    'type': 'FeatureCollection',
                    'features': this.state.mapLocations.filter((location) => {
                      if (_.has(location.geometry, 'coordinates')) {
                        return location;
                      }
                      return false;
                    }),
                  };
                  var withinFilter = {
                    'type': 'FeatureCollection',
                    'features': [
                      {
                        'type': 'Feature',
                        'properties': '',
                        'geometry': {
                          'type': 'Polygon',
                          'coordinates': feature.geometry.coordinates,
                        },
                      },
                    ],
                  };
                  const result = within(locationResults, withinFilter);
                  const selectedLocations = result.features;
                  const selectedLocationIds = result.features.map((location) => {
                    return location.id;
                  });
                  this.props.dispatch(setLocations(selectedLocations));
                  this.props.dispatch(reloadDataForBoxplots());
                  this.props.dispatch(reloadAllLineCharts());
                  this.props.dispatch(reloadDataForScatterplot());                  
                  this.props.hideMapModal();
                });
                layer.on('mouseover', (e) => {
                  layer.setStyle({
                    'fillColor': 'purple',
                  });
                });
                layer.on('mouseout', (e) => {
                  layer.setStyle({
                    'fillColor': 'pink',
                  });
                });
              }}
              data={afvoergebieden} />
          </LayersControl.Overlay>
        </LayersControl>

      </Map>
    );
  }
}

SelectLocationsMap.propTypes = {};

export default SelectLocationsMap;
