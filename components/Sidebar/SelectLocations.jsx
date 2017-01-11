// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import styles from './SelectLocations.css';
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
// import {} from '../actions.jsx';


class SelectLocations extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMapModal: false,
      showMeetnetModal: false,
      showListModal: false,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.clusteredMarkers = new L.MarkerClusterGroup({
        disableClusteringAtZoom: 12,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });
    this.updateDimensions = this.updateDimensions.bind(this);
    this.hideMapModal = this.hideMapModal.bind(this);
    this.hideListModal = this.hideListModal.bind(this);
    this.hideMeetnetModal = this.hideMeetnetModal.bind(this);
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

  hideMeetnetModal() {
    this.setState({ showMeetnetModal: false });
  }

  hideMapModal() {
    this.setState({ showMapModal: false });
  }

  hideListModal() {
    this.setState({ showListModal: false });
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

    const position = [52.0741, 5.1032];

    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'><i className='fa fa-map-marker'></i>
            &nbsp;Locaties
          </h3>
        </div>
        <div className='panel-body'>
        <p id='location-name'>Geen filter</p>
          <Button onClick={() => this.setState({ showMeetnetModal: true })}>
            <i className='fa fa-search'></i>&nbsp;Per meetnet
          </Button>
        <br/><br/>
        <p id='location-name'>Geen filter</p>
        <ButtonGroup>
          <Button onClick={() => this.setState({ showListModal: true })}>
            <i className='fa fa-list-alt'></i>&nbsp;Lijst
          </Button>
          <Button onClick={() => this.setState({ showMapModal: true })}>
            <i className='fa fa-globe'></i>&nbsp;Kaart
          </Button>
        </ButtonGroup>
        </div>

        <Modal
          {...this.props}
          show={this.state.showMapModal}
          onHide={this.hideMapModal}
          dialogClassName={styles.WideModal}>
          <Modal.Header closeButton>
            <Modal.Title id='kaartselectie'>Selectie op kaart</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ height: this.state.height - 200 }}>
            <Map
              ref='mapElement'
              className={styles.Map}
              center={position} zoom={10}>
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
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideMapModal}>Sluiten</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          {...this.props}
          show={this.state.showListModal}
          onHide={this.hideListModal}
          dialogClassName={styles.WideModal}>
          <Modal.Header closeButton>
            <Modal.Title id='kaartselectie'>Lijst selectie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Lijst selectie</h4>
            <p>Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde commodi aspernatur enim, consectetur. Cumque deleniti temporibus ipsam atque a dolores quisquam quisquam adipisci possimus laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod accusamus eos quod. Ab quos consequuntur eaque quo rem!
             Mollitia reiciendis porro quo magni incidunt dolore amet atque facilis ipsum deleniti rem! Dolores debitis voluptatibus ipsum dicta. Dolor quod amet ab sint esse distinctio tenetur. Veritatis laudantium quibusdam quidem corporis architecto veritatis. Ex facilis minima beatae sunt perspiciatis placeat. Quasi corporis
             odio eaque voluptatibus ratione magnam nulla? Amet cum maiores consequuntur totam dicta! Inventore adipisicing vel vero odio modi doloremque? Vitae porro impedit ea minima laboriosam quisquam neque. Perspiciatis omnis obcaecati consequatur sunt deleniti similique facilis sequi. Ipsum harum vitae modi reiciendis officiis.
             Quas laudantium laudantium modi corporis nihil provident consectetur omnis, natus nulla distinctio illum corporis. Sit ex earum odio ratione consequatur odit minus laborum? Eos? Sit ipsum illum architecto aspernatur perspiciatis error fuga illum, tempora harum earum, a dolores. Animi facilis inventore harum dolore accusamus
             fuga provident molestiae eum! Odit dicta error dolorem sunt reprehenderit. Sit similique iure quae obcaecati harum. Eum saepe fugit magnam dicta aliquam? Sapiente possimus aliquam fugiat officia culpa sint! Beatae voluptates voluptatem excepturi molestiae alias in tenetur beatae placeat architecto. Sit possimus rerum
             fugiat sapiente aspernatur. Necessitatibus tempora animi dicta perspiciatis tempora a velit in! Doloribus perspiciatis doloribus suscipit nam earum. Deleniti veritatis eaque totam assumenda fuga sapiente! Id recusandae. Consectetur necessitatibus eaque velit nobis aliquid? Fugit illum qui suscipit aspernatur alias ipsum
             repudiandae! Quia omnis quisquam dignissimos a mollitia. Suscipit aspernatur eum maiores repellendus ipsum doloribus alias voluptatum consequatur. Consectetur quibusdam veniam quas tenetur necessitatibus repudiandae? Rem optio vel alias neque optio sapiente quidem similique reiciendis tempore. Illum accusamus officia
             cum enim minima eligendi consectetur nemo veritatis nam nisi! Adipisicing nobis perspiciatis dolorum adipisci soluta architecto doloremque voluptatibus omnis debitis quas repellendus. Consequuntur assumenda illum commodi mollitia asperiores? Quis aspernatur consequatur modi veritatis aliquid at? Atque vel iure quos.
             Amet provident voluptatem amet aliquam deserunt sint, elit dolorem ipsa, voluptas? Quos esse facilis neque nihil sequi non? Voluptates rem ab quae dicta culpa dolorum sed atque molestias debitis omnis! Sit sint repellendus deleniti officiis distinctio. Impedit vel quos harum doloribus corporis. Laborum ullam nemo quaerat
             reiciendis recusandae minima dicta molestias rerum. Voluptas et ut omnis est ipsum accusamus harum. Amet exercitationem quasi velit inventore neque doloremque! Consequatur neque dolorem vel impedit sunt voluptate. Amet quo amet magni exercitationem libero recusandae possimus pariatur. Cumque eum blanditiis vel vitae
             distinctio! Tempora! Consectetur sit eligendi neque sunt soluta laudantium natus qui aperiam quisquam consectetur consequatur sit sint a unde et. At voluptas ut officiis esse totam quasi dolorem! Hic deserunt doloribus repudiandae! Lorem quod ab nostrum asperiores aliquam ab id consequatur, expedita? Tempora quaerat
             ex ea temporibus in tempore voluptates cumque. Quidem nam dolor reiciendis qui dolor assumenda ipsam veritatis quasi. Esse! Sit consectetur hic et sunt iste! Accusantium atque elit voluptate asperiores corrupti temporibus mollitia! Placeat soluta odio ad blanditiis nisi. Eius reiciendis id quos dolorum eaque suscipit
             magni delectus maxime. Sit odit provident vel magnam quod. Possimus eligendi non corrupti tenetur culpa accusantium quod quis. Voluptatum quaerat animi dolore maiores molestias voluptate? Necessitatibus illo omnis laborum hic enim minima! Similique. Dolor voluptatum reprehenderit nihil adipisci aperiam voluptatem soluta
             magnam accusamus iste incidunt tempore consequatur illo illo odit. Asperiores nesciunt iusto nemo animi ratione. Sunt odit similique doloribus temporibus reiciendis! Ullam. Dolor dolores veniam animi sequi dolores molestias voluptatem iure velit. Elit dolore quaerat incidunt enim aut distinctio. Ratione molestiae laboriosam
             similique laboriosam eum et nemo expedita. Consequuntur perspiciatis cumque dolorem.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideListModal}>Sluiten</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          {...this.props}
          show={this.state.showMeetnetModal}
          onHide={this.hideMeetnetModal}
          dialogClassName={styles.WideModal}>
          <Modal.Header closeButton>
            <Modal.Title id='kaartselectie'>Meetnetselectie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Meetnetselectie</h4>
            <p>Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde commodi aspernatur enim, consectetur. Cumque deleniti temporibus ipsam atque a dolores quisquam quisquam adipisci possimus laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod accusamus eos quod. Ab quos consequuntur eaque quo rem!
             Mollitia reiciendis porro quo magni incidunt dolore amet atque facilis ipsum deleniti rem! Dolores debitis voluptatibus ipsum dicta. Dolor quod amet ab sint esse distinctio tenetur. Veritatis laudantium quibusdam quidem corporis architecto veritatis. Ex facilis minima beatae sunt perspiciatis placeat. Quasi corporis
             odio eaque voluptatibus ratione magnam nulla? Amet cum maiores consequuntur totam dicta! Inventore adipisicing vel vero odio modi doloremque? Vitae porro impedit ea minima laboriosam quisquam neque. Perspiciatis omnis obcaecati consequatur sunt deleniti similique facilis sequi. Ipsum harum vitae modi reiciendis officiis.
             Quas laudantium laudantium modi corporis nihil provident consectetur omnis, natus nulla distinctio illum corporis. Sit ex earum odio ratione consequatur odit minus laborum? Eos? Sit ipsum illum architecto aspernatur perspiciatis error fuga illum, tempora harum earum, a dolores. Animi facilis inventore harum dolore accusamus
             fuga provident molestiae eum! Odit dicta error dolorem sunt reprehenderit. Sit similique iure quae obcaecati harum. Eum saepe fugit magnam dicta aliquam? Sapiente possimus aliquam fugiat officia culpa sint! Beatae voluptates voluptatem excepturi molestiae alias in tenetur beatae placeat architecto. Sit possimus rerum
             fugiat sapiente aspernatur. Necessitatibus tempora animi dicta perspiciatis tempora a velit in! Doloribus perspiciatis doloribus suscipit nam earum. Deleniti veritatis eaque totam assumenda fuga sapiente! Id recusandae. Consectetur necessitatibus eaque velit nobis aliquid? Fugit illum qui suscipit aspernatur alias ipsum
             repudiandae! Quia omnis quisquam dignissimos a mollitia. Suscipit aspernatur eum maiores repellendus ipsum doloribus alias voluptatum consequatur. Consectetur quibusdam veniam quas tenetur necessitatibus repudiandae? Rem optio vel alias neque optio sapiente quidem similique reiciendis tempore. Illum accusamus officia
             cum enim minima eligendi consectetur nemo veritatis nam nisi! Adipisicing nobis perspiciatis dolorum adipisci soluta architecto doloremque voluptatibus omnis debitis quas repellendus. Consequuntur assumenda illum commodi mollitia asperiores? Quis aspernatur consequatur modi veritatis aliquid at? Atque vel iure quos.
             Amet provident voluptatem amet aliquam deserunt sint, elit dolorem ipsa, voluptas? Quos esse facilis neque nihil sequi non? Voluptates rem ab quae dicta culpa dolorum sed atque molestias debitis omnis! Sit sint repellendus deleniti officiis distinctio. Impedit vel quos harum doloribus corporis. Laborum ullam nemo quaerat
             reiciendis recusandae minima dicta molestias rerum. Voluptas et ut omnis est ipsum accusamus harum. Amet exercitationem quasi velit inventore neque doloremque! Consequatur neque dolorem vel impedit sunt voluptate. Amet quo amet magni exercitationem libero recusandae possimus pariatur. Cumque eum blanditiis vel vitae
             distinctio! Tempora! Consectetur sit eligendi neque sunt soluta laudantium natus qui aperiam quisquam consectetur consequatur sit sint a unde et. At voluptas ut officiis esse totam quasi dolorem! Hic deserunt doloribus repudiandae! Lorem quod ab nostrum asperiores aliquam ab id consequatur, expedita? Tempora quaerat
             ex ea temporibus in tempore voluptates cumque. Quidem nam dolor reiciendis qui dolor assumenda ipsam veritatis quasi. Esse! Sit consectetur hic et sunt iste! Accusantium atque elit voluptate asperiores corrupti temporibus mollitia! Placeat soluta odio ad blanditiis nisi. Eius reiciendis id quos dolorum eaque suscipit
             magni delectus maxime. Sit odit provident vel magnam quod. Possimus eligendi non corrupti tenetur culpa accusantium quod quis. Voluptatum quaerat animi dolore maiores molestias voluptate? Necessitatibus illo omnis laborum hic enim minima! Similique. Dolor voluptatum reprehenderit nihil adipisci aperiam voluptatem soluta
             magnam accusamus iste incidunt tempore consequatur illo illo odit. Asperiores nesciunt iusto nemo animi ratione. Sunt odit similique doloribus temporibus reiciendis! Ullam. Dolor dolores veniam animi sequi dolores molestias voluptatem iure velit. Elit dolore quaerat incidunt enim aut distinctio. Ratione molestiae laboriosam
             similique laboriosam eum et nemo expedita. Consequuntur perspiciatis cumque dolorem.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideMeetnetModal}>Sluiten</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

SelectLocations.propTypes = {};

export default SelectLocations;
