// @flow
import { connect } from 'react-redux';
import colorbrewer from 'colorbrewer';
import { scaleQuantize } from 'd3';
import React, { Component, PropTypes } from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import { ButtonGroup, Button, Modal } from 'react-bootstrap';
import GeoJsonUpdatable from '../lib/GeoJsonUpdatable.jsx';
import { Wave } from 'better-react-spinkit';
import sharedStyles from './SharedStyles.css';
import styles from './MapApp.css';
import TopNav from './TopNav.jsx';
import MapStatisticsPicker from './MapStatisticsPicker.jsx';
import Sidebar from './Sidebar.jsx';
import Legend from './Legend.jsx';
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

  popupContent(result) {
    let latest_value_formatted, median_formatted, num_values_formatted,
        min_formatted, max_formatted, q1_formatted, q3_formatted,
        photo_url_div, onbekend_1, onbekend_2;
    let summer_formatted, winter_formatted, mean_formatted, date_formatted,
    std_formatted, p10_formatted, p90_formatted;
      onbekend_1 = 'Niet bemeten';
      onbekend_2 = 'Niet te bepalen';
    if (result.properties.latest_value === null) {
      latest_value_formatted = onbekend_1;
    }
    latest_value_formatted = result.properties.latest_value;

    if (result.properties.photo_url) {
      photo_url_div = `<div><a href="${result.properties.photo_url}"
        target="_blank"><img width="200" src="${result.properties.photo_url}">
        </div>`;
    }
    else {
      photo_url_div = '<div><p><em>Geen afbeelding beschikbaar</em></p></div>';
    }

    if (result.properties.percentiles === null) {
      median_formatted = onbekend_1;
      min_formatted = onbekend_1;
      max_formatted = onbekend_1;
      std_formatted = onbekend_1;
      q1_formatted = onbekend_1;
      q3_formatted  = onbekend_1;
      mean_formatted = onbekend_1;
      num_values_formatted = onbekend_1;
      winter_formatted = onbekend_1;
      winter_formatted = onbekend_1;
    }
    else {
      try {
        median_formatted = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.median.toFixed(2);
      } catch(error) {
        median_formatted = onbekend_1;
      }

      try {
        mean_formatted = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.mean.toFixed(2);
      } catch(error) {
        mean_formatted = onbekend_1;
      }

      try {
        date_formatted = (result.properties.boxplot_data === null) ?
          onbekend_2 : moment(result.properties.latest_datetime).format('L');
      } catch(error) {
        date_formatted = onbekend_1;
      }

      try {
        min_formatted = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.min.toFixed(2);
      } catch(error) {
        min_formatted = onbekend_1;
      }

      try {
        max_formatted = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.max.toFixed(2);
      } catch(error) {
        max_formatted = onbekend_1;
      }

      try {
        std_formatted = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.std.toFixed(2);
      } catch(error) {
        std_formatted = onbekend_1;
      }

      try {
        q1_formatted = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.q1.toFixed(2);
      } catch(error) {
        q1_formatted = onbekend_1;
      }

      try {
        q3_formatted  = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.q3.toFixed(2);
      } catch(error) {
        q3_formatted = onbekend_1;
      }

      try {
        p10_formatted  = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.p10.toFixed(2);
      } catch(error) {
        p10_formatted = onbekend_1;
      }

      try {
        p90_formatted  = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.p90.toFixed(2);
      } catch(error) {
        p90_formatted = onbekend_1;
      }

      try {
        summer_formatted  = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.summer_mean.toFixed(2);
      } catch(error) {
        summer_formatted = onbekend_1;
      }

      try {
        winter_formatted  = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.winter_mean.toFixed(2);
      } catch(error) {
        winter_formatted = onbekend_1;
      }

      try {
        num_values_formatted  = (result.properties.boxplot_data === null) ?
          onbekend_2 : result.properties.boxplot_data.num_values;
      } catch(error) {
        num_values_formatted = onbekend_1;
      }
    }

    if (result.properties.is_krw_score) {
      var returnString = `<dl class="dl-horizontal" width="200" style="overflow:hidden;">
        <dt style="width:100px;">ID</dt>
        <dd style="width:300px;margin-left:130px !important;">${result.properties.loc_id}</dd>
        <dt style="width:100px;">Omschrijving</dt>
        <dd style="width:300px;margin-left:130px !important;">${result.properties.loc_oms}</dd>`;
        if (result.properties.waarde_n !== undefined) {
          returnString += `<dt style="width:100px;">Waarde</dt>
                           <dd style="width:300px;margin-left:130px !important;">${result.properties.waarde_n}</dd>`;
        }
        returnString += `</dl> ${photo_url_div}`;
        return returnString;
    }
    else {
      return `<dl class="dl-horizontal" width="200" style="overflow:hidden;">
        <dt style="width:100px;">ID</dt>
        <dd style="width:300px;margin-left:130px !important;">${result.properties.loc_id}</dd>
        <dt style="width:100px;">Omschrijving</dt>
        <dd style="width:300px;margin-left:130px !important;">${result.properties.loc_oms}</dd>
        <dt style="width:100px;">Laatste waarde</dt>
        <dd style="width:300px;margin-left:130px !important;">${latest_value_formatted}</dd>
        <dt style="width:100px;">Gemeten op</dt>
        <dd style="width:300px;margin-left:130px !important;">${date_formatted}</dd>
        <dt style="width:100px;">Aantal</dt>
        <dd style="width:300px;margin-left:130px !important;">${num_values_formatted}</dd>
        <dt style="width:100px;">Min</dt>
        <dd style="width:300px;margin-left:130px !important;">${min_formatted}</dd>
        <dt style="width:100px;">Max</dt>
        <dd style="width:300px;margin-left:130px !important;">${max_formatted}</dd>
        <dt style="width:100px;">SD</dt>
        <dd style="width:300px;margin-left:130px !important;">${std_formatted}</dd>
        <dt style="width:100px;">Gemiddelde</dt>
        <dd style="width:300px;margin-left:130px !important;">${mean_formatted}</dd>
        <dt style="width:100px;">Mediaan</dt>
        <dd style="width:300px;margin-left:130px !important;">${median_formatted}</dd>
        <dt style="width:100px;">Q1</dt>
        <dd style="width:300px;margin-left:130px !important;">${q1_formatted}</dd>
        <dt style="width:100px;">Q3</dt>
        <dd style="width:300px;margin-left:130px !important;">${q3_formatted}</dd>
        <dt style="width:100px;">P10</dt>
        <dd style="width:300px;margin-left:130px !important;">${p10_formatted}</dd>
        <dt style="width:100px;">P90</dt>
        <dd style="width:300px;margin-left:130px !important;">${p90_formatted}</dd>
        <dt style="width:100px;">ZGM</dt>
        <dd style="width:300px;margin-left:130px !important;">${summer_formatted}</dd>
        <dt style="width:100px;">WGM</dt>
        <dd style="width:300px;margin-left:130px !important;">${winter_formatted}</dd>
        </dl> ${photo_url_div}`;
      }
  }

	render() {
		const colorBy = this.props.opnames.color_by;
		const selectedParameter = _.find(
			this.props.opnames.features.color_by_fields, (field) => {
			  return field.id === colorBy;
			}
		);

		const parameterButtonText = (selectedParameter) ?
			selectedParameter.wns_oms : 'Selecteer';

		const position = [this.props.opnames.map.lat,
											this.props.opnames.map.lng];

		return (
			<div>
				<div className='container-fluid'>
					<TopNav {...this.props} />
					<div className={`row ${sharedStyles.MainDiv}`}>
						<div className='col-md-2'>
						<Sidebar {...this.props} />
						</div>
						<div className='col-md-10' style={{
              height: this.state.height - 190
            }}>
						<Map
							style={{
								opacity: (this.props.opnames.isFetching) ? 0.5 : 1,
							}}
							ref='mapElement'
							className={styles.Map}
							center={position}
							onMoveend={this.handleMoveend}
							zoom={this.props.opnames.map.zoom}>
							<TileLayer
								url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png'
								attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							/>
							<GeoJsonUpdatable
								data={this.props.opnames.features.features}
                onEachFeature={(feature, layer) => {
                  layer.bindPopup(this.popupContent(feature));
                }}
								pointToLayer={(feature, latlng) => {

                  let scaleVariant = (this.props.opnames.features.is_krw_score) ?
                    colorbrewer.RdYlGn[this.props.opnames.mapSettings.numLegendIntervals]
                    :
                    ['#FF0000', '#FF9900', '#FFFD37', '#1ECA22', '#0000FF'];

                  const domain = (this.props.opnames.mapSettings.reverseLegend) ? [
                    (this.props.opnames.mapSettings.dataDomain) ?
                    this.props.opnames.features.max_value :
                    this.props.opnames.features.abs_max_value,
                    (this.props.opnames.mapSettings.dataDomain) ?
                    this.props.opnames.features.min_value :
                    this.props.opnames.features.abs_min_value,
                  ] : [
                    (this.props.opnames.mapSettings.dataDomain) ?
                    this.props.opnames.features.min_value :
                    this.props.opnames.features.abs_min_value,
                    (this.props.opnames.mapSettings.dataDomain) ?
                    this.props.opnames.features.max_value :
                    this.props.opnames.features.abs_max_value,
                  ];

                  const mapColors = scaleQuantize()
              					.domain(domain)
                        .range((this.props.opnames.mapSettings.reverseLegend) ?
                        scaleVariant.reverse() : scaleVariant);

									let geojsonMarkerOptions = {
										radius: 8,
										fillColor: '#999',
										color: '#fff',
										weight: 2,
										opacity: 1,
										fillOpacity: 0.8,
									};

									if (feature.properties.is_krw_area &&
											!this.props.opnames.features.isKrwScore) {

										geojsonMarkerOptions = {
											radius: 8,
											weight: 1,
											color: '#999',
											opacity: 1,
											fillColor: '#999',
											fillOpacity: 1,
										};
									}

									if (feature.properties.is_krw_area &&
											!this.props.opnames.features.isKrwScore &&
											feature.properties.latest_value === null) {

										geojsonMarkerOptions = {
											weight: 1,
											color: '#999',
											opacity: 1,
											fillColor: '#999',
											fillOpacity: 1,
										}
									}

									if (feature.properties.is_krw_area &&
											this.props.opnames.features.isKrwScore) {

										geojsonMarkerOptions = {
											weight: 1,
											color: mapColors(feature.properties.latest_value),
											opacity: 1,
											fillColor: mapColors(feature.properties.latest_value),
											fillOpacity: 0.8,
										}
									}

									let myFillColor;

									try {

										if(this.props.opnames.map_statistics === 'lastval') {
											myFillColor = (feature.properties.latest_value === null) ?
											 '#bbccff' : mapColors(feature.properties.latest_value);
										} else if(this.props.opnames.map_statistics === 'min') {
											myFillColor = (feature.properties.boxplot_data.min === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.min);
										} else if(this.props.opnames.map_statistics === 'max') {
											myFillColor = (feature.properties.boxplot_data.max === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.max);
										} else if(this.props.opnames.map_statistics === 'amount') {
											myFillColor = (feature.properties.boxplot_data.num_values === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.num_values);
										} else if(this.props.opnames.map_statistics === 'stdev') {
											myFillColor = (feature.properties.boxplot_data.std === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.std);
										} else if(this.props.opnames.map_statistics === 'mean') {
											myFillColor = (feature.properties.boxplot_data.mean === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.mean);
										} else if(this.props.opnames.map_statistics === 'median') {
											myFillColor = (feature.properties.boxplot_data.median === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.median);
										} else if(this.props.opnames.map_statistics === 'q1') {
											myFillColor = (feature.properties.boxplot_data.q1 === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.q1);
										} else if(this.props.opnames.map_statistics === 'q3') {
											myFillColor = (feature.properties.boxplot_data.q3 === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.q3);
										} else if(this.props.opnames.map_statistics === 'p10') {
											myFillColor = (feature.properties.boxplot_data.p10 === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.p10);
										} else if(this.props.opnames.map_statistics === 'p90') {
											myFillColor = (feature.properties.boxplot_data.p90 === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.p90);
										} else if(this.props.opnames.map_statistics === 'summer') {
											myFillColor = (feature.properties.boxplot_data.summer_mean === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.summer_mean);
										} else if(this.props.opnames.map_statistics === 'winter') {
											myFillColor = (feature.properties.boxplot_data.winter_mean === null) ?
											'#bbccff' : mapColors(feature.properties.boxplot_data.winter_mean);
										}
									} catch(error) {
										myFillColor = '#bbccff';
									}

									let opacity = 1;
									if (myFillColor === '#bbccff') {
										opacity = 0;
									}
									if (!feature.properties.is_krw_area) {
										geojsonMarkerOptions = {
											radius: (feature.properties.photo_url) ? 8 : 7,
											fillColor: myFillColor,
											color: (feature.properties.photo_url) ? '#fff' : '#000',
											weight: (feature.properties.photo_url) ? 1.5 : 0.75,
											opacity: opacity,
											fillOpacity: opacity
										};
										return L.circleMarker(latlng, geojsonMarkerOptions);
									}
									return L.circleMarker(latlng, geojsonMarkerOptions);
								}}
								filter={(f) => {
                  // console.log('filter', f);
                  return f;
                }}
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
									<i className='fa fa-cog'></i>&nbsp;Kaartinstellingen
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
						{(this.props.opnames.features.color_by_fields) ?
							this.props.opnames.features.color_by_fields.map((colorField, i) => {
							if (colorField.wns_oms.toLowerCase().indexOf(
								this.state.colorFilterValue.toLowerCase()) !== -1) {
								return (
									<li
										key={i}
										onClick={(e) => {
											this.props.dispatch(
												setColorBy(colorField.id)
											);
											this.props.dispatch(
												fetchFeatures()
											);
											this.hideColorByModal();
										}}
										style={{
											cursor: 'pointer',
											textDecoration: 'underline',
											backgroundColor: (colorField.id === this.props.opnames.color_by) ? '#ccc' : '',
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
                            this.props.dispatch(
                              toggleReverseLegend()
                            );
                            this.props.dispatch(
                              fetchFeatures()
                            );
                          }}
                          type='checkbox'
                          defaultChecked={this.props.opnames.mapSettings.reverseLegend} />
                          Omgekeerd kleurverloop
											</label>
										</div>
									</div>
									<div className='form-group'>
										<div className='checkbox'>
											<label>
												<input
                          onClick={() => {
                            this.props.dispatch(
                              useDataDomain()
                            );
                            this.props.dispatch(
                              fetchFeatures()
                            );
                          }}
                          type='checkbox'
                          defaultChecked={this.props.opnames.mapSettings.dataDomain} />
                          Schakel tussen alle data / geselecteerde data
											</label>
										</div>
									</div>
									<div className='form-group'>
										<label htmlFor='legendMin'>
											Minimumwaarde
										</label>
										<input type='number'
													 className='form-control'
													 id='legendMin'
													 placeholder='Minimumwaarde' />
								 </div>
								 <div className='form-group'>
									 <label htmlFor='legendMax'>
                    Maximumwaarde
                  </label>
								  <input type='number'
													className='form-control'
													id='legendMax'
													placeholder='Maximumwaarde' />
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
                           this.props.dispatch(setLegendIntervals(e.target.value));
                           this.props.dispatch(
                             fetchFeatures()
                           );
                         }}
                         defaultValue={this.props.opnames.mapSettings.numLegendIntervals}
												 placeholder='Het aantal legenda-intervallen 3 en 11.' />
							 </div>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => {
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
	// This function maps the Redux state to React Props.
	return {
		'opnames': state.opnames,
	};
}


export default connect(mapStateToProps)(MapApp);
