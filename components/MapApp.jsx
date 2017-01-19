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

	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
	}

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
		const colorBy = this.props.opnames.color_by;
		const selectedParameter = _.find(
			this.props.opnames.features.color_by_fields, (field) => {
				return field.id === colorBy;
			}
		);

		const parameterButtonText = (selectedParameter) ?
			selectedParameter.wns_oms :
			'Selecteer';

		const position = [this.props.opnames.map.lat,
											this.props.opnames.map.lng];
		const scaleVariant = colorbrewer.RdYlGn[11];
		const mapColors = scaleQuantize()
					.domain([
							this.props.opnames.features.abs_min_value,
							this.props.opnames.features.abs_max_value,
					])
					.range(scaleVariant);

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
								pointToLayer={(feature, latlng) => {

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

												console.log('------->', mapColors(feature.properties.latest_value));

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
									if (myFillColor == '#bbccff') {
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
						<div className='col-md-2'/>
						<div className='col-md-10'>
							<hr/>
              <Legend {...this.props} />
							<ButtonGroup>
								<Button
									onClick={() => this.setState({ showColorByModal: true })}>
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
												<input type='checkbox' value='true' />Omgekeerd kleurverloop
											</label>
										</div>
									</div>
									<div className='form-group'>
										<div className='checkbox'>
											<label>
												<input type='checkbox' value='false' />Schakel tussen alle data / geselecteerde data
											</label>
										</div>
									</div>
									<div className='form-group'>
										<label labelFor='legendMin'>
											Minimumwaarde
										</label>
										<input type='number'
													 className='form-control'
													 id='legendMin'
													 placeholder='Minimumwaarde' />
								 </div>
								 <div className='form-group'>
									 <label labelFor='legendMax'>Maximumwaarde</label>
									 <input type='number'
													className='form-control'
													id='legendMax'
													placeholder='Maximumwaarde' />
								</div>
								<div className='form-group'>
									<label labelFor='legendLength'>
										Aantal legenda-intervallen
									</label>
									<input type='number'
												 className='form-control'
												 id='legendLength'
												 min='3'
												 max='11'
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
