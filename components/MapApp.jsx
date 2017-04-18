// @flow
import { connect } from 'react-redux';
import colorbrewer from 'colorbrewer';
import { scaleQuantize } from 'd3';
import React, { Component, PropTypes } from 'react';
import { Map, Marker, Popup, LayersControl, ScaleControl,
  TileLayer, GeoJSON } from 'react-leaflet';
import { ButtonGroup, Button, Modal } from 'react-bootstrap';
import GeoJsonUpdatable from '../lib/GeoJsonUpdatable.jsx';
import PopupContent from '../lib/PopupContent.jsx';
import { Wave } from 'better-react-spinkit';
import sharedStyles from './SharedStyles.css';
import styles from './MapApp.css';
import TopNav from './TopNav.jsx';
import MapStatisticsPicker from './MapStatisticsPicker.jsx';
import Sidebar from './Sidebar.jsx';
import Legend from './Legend.jsx';
import hdsrMaskData from '../lib/hdsr-mask.json';
import afvoergebieden from '../lib/afvoergebieden.json';
import krwAreas from '../lib/kwr-areas.json';
import _ from 'lodash';
import $ from 'jquery';
import L from 'leaflet';

import {
	fetchFeatures,
	setColorBy,
	setMapPosition,
  toggleReverseLegend,
  useDataDomain,
  setLegendIntervals,
  setLegendMin,
  setLegendMax,
} from '../actions.jsx';

class MapApp extends Component {

	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
			showColorByModal: false,
			showSettingsModal: false,
			colorFilterValue: '',
      legendMin: undefined,
      legendMax: undefined,
		};
		this.updateDimensions = this.updateDimensions.bind(this);
		this.hideColorByModal = this.hideColorByModal.bind(this);
		this.hideSettingsModal = this.hideSettingsModal.bind(this);
		this.handleMoveend = this.handleMoveend.bind(this);
	}

	componentDidMount() {
		this.updateDimensions();
		window.addEventListener('resize', this.updateDimensions);
		this.props.dispatch(fetchFeatures());
    setTimeout(() =>
      $('.leaflet-control-layers').
      addClass('leaflet-control-layers-expanded'), 15);

    this.refs.mapElement.leafletElement.on('overlayadd', (a) => {
      if (a.name !== 'Labels') {
        a.layer.bringToBack();
      }
    });
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}
  //
	// shouldComponentUpdate(nextProps, nextState) {
	// 	return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
	// }

	componentWillReceiveProps(newProps) {}

	hideColorByModal() {
		this.setState({
			showColorByModal: false,
		});
	}

	hideSettingsModal() {
		this.setState({
			showSettingsModal: false,
		});
	}

	updateDimensions() {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}

	handleMoveend(e) {
		const map = this.refs.mapElement.leafletElement;
		this.props.dispatch(setMapPosition({
			lat: map.getCenter().lat,
			lng: map.getCenter().lng,
			zoom: map.getZoom(),
		}));
	}

	render() {

    const { dispatch, opnames } = this.props;

		const colorBy = opnames.color_by;
		const selectedParameter = _.find(
			opnames.features.color_by_fields, (field) => {
			  return field.id === colorBy;
			}
		);

    const KRW_AREA_COLORS = {
      '1': '#B6B6B4',
      '2': '#D1D0CE',
      '3': '#989B9C',
    };

		const parameterButtonText = (selectedParameter) ?
			selectedParameter.wns_oms : 'Selecteer parameter';

		const position = [opnames.map.lat, opnames.map.lng];

		return (
			<div>
				<div className='container-fluid'>
					<TopNav {...this.props} />
					<div className={`row ${sharedStyles.MainDiv}`}>
						<div className='col-md-2'>
						<Sidebar {...this.props} />
						</div>
						<div className='col-md-10' style={{
              height: this.state.height - 190,
            }}>
						<Map
							style={{
								opacity: (opnames.isFetching) ? 0.5 : 1,
							}}
              id='map1'
							ref='mapElement'
							className={styles.Map}
							center={position}
							onMoveend={this.handleMoveend}
							zoom={opnames.map.zoom}>

              <ScaleControl position='bottomleft' />

              <GeoJsonUpdatable
                key={Date.now()}
                {...this.props}
								data={opnames.features.features}
                onEachFeature={(feature, layer) => {
                  layer.bindPopup(PopupContent(feature));

                  if (feature.properties.is_krw_area && feature.geometry.type === 'MultiPolygon') {
                    let scaleVariant = ['#FF0000', '#FF9900', '#FFFD37', '#1ECA22', '#0000FF'];

                    let domain;
                    if (opnames.mapSettings.legendMin && opnames.mapSettings.legendMax) {
                      if (opnames.mapSettings.reverseLegend) {
                        domain = [
                          opnames.mapSettings.legendMax, opnames.mapSettings.legendMin,
                        ];
                      }
                      else {
                        domain = [
                          opnames.mapSettings.legendMin, opnames.mapSettings.legendMax,
                        ];
                      }
                    }
                    else {
                      // if (opnames.mapSettings.reverseLegend) {
                      //   domain = [
                      //     (opnames.mapSettings.dataDomain) ? opnames.features.max_value : opnames.features.abs_max_value,
                      //     (opnames.mapSettings.dataDomain) ? opnames.features.min_value : opnames.features.abs_min_value,
                      //   ];
                      // }
                      // else {
                        domain = [
                          (opnames.mapSettings.dataDomain) ? opnames.features.min_value : opnames.features.abs_min_value,
                          (opnames.mapSettings.dataDomain) ? opnames.features.max_value : opnames.features.abs_max_value,
                        ];
                      // }
                    }



                    const mapColors = scaleQuantize()
                          .domain(domain)
                          .range((opnames.mapSettings.reverseLegend) ?
                          scaleVariant.slice().reverse() : scaleVariant);

                    layer.setStyle({
                      fillColor: mapColors(feature.properties.latest_value),
                      color: mapColors(feature.properties.latest_value),
                      weight: (this.props.opnames.map.zoom - 17) * -1,
                      opacity: 1,
                      fillOpacity: 1,
                    });
                  }
                }}
								pointToLayer={(feature, latlng) => {

                  // let scaleVariant = (opnames.features.is_krw_score && !opnames.features.is_krw_area) ?
                  //   colorbrewer.RdYlGn[opnames.mapSettings.numLegendIntervals]
                  //   :
                  //   ['#FF0000', '#FF9900', '#FFFD37', '#1ECA22', '#0000FF'];

                  let scaleVariant = colorbrewer.RdYlGn[opnames.mapSettings.numLegendIntervals];

                  let domain;
                  if (opnames.mapSettings.legendMin && opnames.mapSettings.legendMax) {
                    if (opnames.mapSettings.reverseLegend) {
                      domain = [
                        opnames.mapSettings.legendMax, opnames.mapSettings.legendMin,
                      ];
                    }
                    else {
                      domain = [
                        opnames.mapSettings.legendMin, opnames.mapSettings.legendMax,
                      ];
                    }
                  }
                  else {
                    // if (opnames.mapSettings.reverseLegend) {
                    //   domain = [
                    //     (opnames.mapSettings.dataDomain) ? opnames.features.max_value : opnames.features.abs_max_value,
                    //     (opnames.mapSettings.dataDomain) ? opnames.features.min_value : opnames.features.abs_min_value,
                    //   ];
                    // }
                    // else {
                      domain = [
                        (opnames.mapSettings.dataDomain) ? opnames.features.min_value : opnames.features.abs_min_value,
                        (opnames.mapSettings.dataDomain) ? opnames.features.max_value : opnames.features.abs_max_value,
                      ];
                    // }
                  }

                  const mapColors = scaleQuantize()
              					.domain(domain)
                        .range((opnames.mapSettings.reverseLegend) ?
                        scaleVariant.slice().reverse() : scaleVariant);

									let geojsonMarkerOptions = {
										radius: 8,
										fillColor: '#999',
										color: '#fff',
										weight: 2,
										opacity: 1,
										fillOpacity: 0.8,
									};


									let myFillColor;
									try {
										if (opnames.map_statistics === 'lastval') {
											myFillColor = (feature.properties.latest_value === null) ?
											 '#bbccff' : mapColors(feature.properties.latest_value);
										}
                    else if(opnames.map_statistics === 'min') {
											myFillColor = (feature.properties.boxplot_data.min === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.min);
										}
                    else if(opnames.map_statistics === 'max') {
											myFillColor = (feature.properties.boxplot_data.max === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.max);
										}
                    else if(opnames.map_statistics === 'amount') {
											myFillColor = (feature.properties.boxplot_data.num_values === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.num_values);
										}
                    else if(opnames.map_statistics === 'stdev') {
											myFillColor = (feature.properties.boxplot_data.std === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.std);
										}
                    else if(opnames.map_statistics === 'mean') {
											myFillColor = (feature.properties.boxplot_data.mean === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.mean);
										}
                    else if(opnames.map_statistics === 'median') {
											myFillColor = (feature.properties.boxplot_data.median === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.median);
										}
                    else if(opnames.map_statistics === 'q1') {
											myFillColor = (feature.properties.boxplot_data.q1 === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.q1);
										}
                    else if(opnames.map_statistics === 'q3') {
											myFillColor = (feature.properties.boxplot_data.q3 === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.q3);
										}
                    else if(opnames.map_statistics === 'p10') {
											myFillColor = (feature.properties.boxplot_data.p10 === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.p10);
										}
                    else if(opnames.map_statistics === 'p90') {
											myFillColor = (feature.properties.boxplot_data.p90 === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.p90);
										}
                    else if(opnames.map_statistics === 'summer') {
											myFillColor = (feature.properties.boxplot_data.summer_mean === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.summer_mean);
										}
                    else if(opnames.map_statistics === 'winter') {
											myFillColor = (feature.properties.boxplot_data.winter_mean === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.winter_mean);
										}
									} catch(warning) {
                    console.warn(warning);
										myFillColor = '#bbccff';
									}

									let opacity = 1;
									if (myFillColor === '#bbccff') {
										opacity = 0;
									}

									if (!feature.properties.is_krw_area) {
                    console.log('%c %s %s', `background: ${myFillColor}; color: #ffffff`, myFillColor, feature.properties.latest_value);
										geojsonMarkerOptions = {
											radius: (feature.properties.photo_url) ? 8 : 7,
											fillColor: myFillColor,
											color: (feature.properties.photo_url) ? '#fff' : '#000',
											weight: (feature.properties.photo_url) ? 1.5 : 0.75,
											opacity: opacity,
											fillOpacity: opacity,
										};
										return L.circleMarker(latlng, geojsonMarkerOptions);
									}
                  else {
                    return L.multiPolygon(latlng, geojsonMarkerOptions);
                  }
								}}
								filter={(f) => {
                  if (f.properties.latest_value !== null) {
                    return f;
                  }
                  return false;
                }}
							/>

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
                  <GeoJsonUpdatable
                    onEachFeature={(feature, layer) => {
                      layer.setStyle({
                        'fillColor': KRW_AREA_COLORS[layer.feature.properties.krw_color],
              	        'color': KRW_AREA_COLORS[layer.feature.properties.krw_color],
              	        'weight': (opnames.map.zoom - 17) * -1,
                      });
                      layer.bindPopup(`
                        <dl class="dl-horizontal"
                            width="200"
                            style="overflow:hidden;">
                          <dt style="width:100px;">ID</dt>
                          <dd style="width:300px;margin-left:130px !important;">
                          ${layer.feature.properties.loc_id}
                          <dt style="width:100px;">Omschrijving</dt>
                          <dd style="width:300px;margin-left:130px !important;">
                          ${layer.feature.properties.loc_oms}
                          </dd>
                        </dl>`);
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
                      layer.bindPopup(`
                        GAF ID: ${layer.feature.properties.GAF_ID}
                      `);
                      // layer.on('mouseover', function(e) {
                      //   this.setStyle({
                      //     'fillColor': 'purple',
                      //   });
                      // });
                      // layer.on('mouseout', function(e) {
                      //   this.setStyle({
                      //     'fillColor': 'pink',
                      //   });
                      // });
                    }}
                    data={afvoergebieden} />
                </LayersControl.Overlay>
                <LayersControl.Overlay name='Labels'>
                <TileLayer
                  url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.0a5c8e74/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                </LayersControl.Overlay>
              </LayersControl>
						</Map>
						{(opnames.isFetching) ?
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
						<div className='col-md-2' />
						<div className='col-md-10'>
							<hr/>
              <Legend {...this.props} />
							<ButtonGroup>
								<Button
									onClick={() => this.setState({
                    showColorByModal: true,
                    colorFilterValue: '',
                  })}>
									<i className='fa fa-paint-brush'></i>&nbsp;
									{parameterButtonText}
								</Button>
								<Button
									onClick={() => this.setState({ showSettingsModal: true })}>
									<i className='fa fa-cog'></i>&nbsp;Legenda instellingen
								</Button>
							</ButtonGroup>
							<MapStatisticsPicker {...this.props} />
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
					<input
						style={{
							margin: '0 0 10px 0',
						}}
						className='form-control'
						autoFocus='autofocus'
						onChange={(e) => this.setState({colorFilterValue: e.target.value}) }
					/>
					<ul style={{ overflow: 'scroll', height: this.state.height - 300 }}>
						{(opnames.features.color_by_fields) ?
							opnames.features.color_by_fields.map((colorField, i) => {
							if (colorField.wns_oms.toLowerCase().indexOf(
								this.state.colorFilterValue.toLowerCase()) !== -1) {
								return (
									<li
										key={i}
										onClick={(e) => {
											dispatch(
												setColorBy(colorField.id)
											);
											dispatch(
												fetchFeatures()
											);
											this.hideColorByModal();
										}}
										style={{
											cursor: 'pointer',
											textDecoration: 'underline',
											backgroundColor: (colorField.id === opnames.color_by) ? '#ccc' : '',
										}}>
										{colorField.wns_oms}
									</li>
								);
							}
							return false;
						}) : ''}
					</ul>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => {
							this.hideColorByModal();
						}}>Sluiten</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					{...this.props}
					show={this.state.showSettingsModal}
					onHide={this.hideSettingsModal}>
					<Modal.Header closeButton>
						<Modal.Title id='settingsmodal'>Kaartinstellingen</Modal.Title>
					</Modal.Header>
					<Modal.Body>
							<div className='panel panel-default'>
								<div className='panel-body'>
									<div className='form-group'>
										<div className='checkbox'>
											<label>
												<input
                          onClick={() => {
                            dispatch(
                              toggleReverseLegend()
                            );
                          }}
                          type='checkbox'
                          defaultChecked={opnames.mapSettings.reverseLegend} />
                          Omgekeerd kleurverloop
											</label>
										</div>
									</div>
									<div className='form-group'>
										<div className='checkbox'>
											<label>
												<input
                          onClick={() => {
                            dispatch(
                              useDataDomain()
                            );
                          }}
                          type='checkbox'
                          defaultChecked={opnames.mapSettings.dataDomain} />
                          Schakel tussen alle data / geselecteerde data
											</label>
										</div>
									</div>
									<div className='form-group'>
										<label htmlFor='legendMin'>
											Minimumwaarde
										</label>
										<input type='text'
													 className='form-control'
													 id='legendMin'
                           onChange={(e) => {
                             e.stopPropagation();
                             this.setState({
                               legendMin: e.target.value,
                             });
                           }}
                           defaultValue={opnames.mapSettings.legendMin} />
								 </div>
								 <div className='form-group'>
									 <label htmlFor='legendMax'>
                    Maximumwaarde
                  </label>
								  <input type='text'
													className='form-control'
													id='legendMax'
                          onChange={(e) => {
                            e.stopPropagation();
                            this.setState({
                              legendMax: e.target.value,
                            });
                          }}
                          defaultValue={opnames.mapSettings.legendMax} />
								</div>
								<div className='form-group'>
									<label htmlFor='legendLength'>
										Aantal legenda-intervallen
									</label>
									<input type='number'
												 className='form-control'
												 id='legendLength'
												 min='3'
												 max='11'
                         onChange={(e) => {
                           dispatch(setLegendIntervals(e.target.value));
                         }}
                         defaultValue={opnames.mapSettings.numLegendIntervals}
												 placeholder='Tussen 3 en 11' />
							 </div>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => {
              dispatch(setLegendMin(this.state.legendMin));
              dispatch(setLegendMax(this.state.legendMax));
              dispatch(fetchFeatures());
							this.hideSettingsModal();
						}}>Sluiten</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

MapApp.propTypes = {};


function mapStateToProps(state) {
	return {
		'opnames': state.opnames,
	};
}


export default connect(mapStateToProps)(MapApp);
