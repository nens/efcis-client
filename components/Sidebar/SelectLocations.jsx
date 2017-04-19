// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import styles from './SelectLocations.css';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import $ from 'jquery';
import jstree from 'jstree';
import SelectLocationsMap from './SelectLocationsMap.jsx';
import SelectLocationsList from './SelectLocationsList.jsx';
import SelectLocationsMeetnet from './SelectLocationsMeetnet.jsx';
require('!style!css!../../node_modules/jstree/dist/themes/default/style.css');

import {
  clearLocationsSelection,
  fetchFeatures,
  fetchOpnames,
  setMeetnets,
  reloadDataForBoxplots,
  reloadAllLineCharts,
  reloadDataForScatterplot,
} from '../../actions.jsx';


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
    this.updateDimensions = this.updateDimensions.bind(this);
    this.hideMapModal = this.hideMapModal.bind(this);
    this.hideListModal = this.hideListModal.bind(this);
    this.hideMeetnetModal = this.hideMeetnetModal.bind(this);
  }

  componentDidMount() {
    const self = this;
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  // }

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

  render() {


    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'><i className='fa fa-map-marker'></i>
            &nbsp;<strong>Locaties</strong>
          </h3>
        </div>
        <div className='panel-body'>
        <p id='location-name'>
          {(this.props.opnames && this.props.opnames.meetnets.length > 0) ?
            <span>
              <span style={{
                borderBottom: '1px dashed #000',
              }}>{`${this.props.opnames.meetnets.length} meetnet(ten)`}
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.props.dispatch(setMeetnets([]));
                  this.props.dispatch(fetchOpnames());
                  this.props.dispatch(fetchFeatures());
                }}>&nbsp;<i className='fa fa-times'></i></span>
            </span> :
            'Geen filter'}
          </p>
          <Button onClick={() => this.setState({ showMeetnetModal: true })}>
            <i className='fa fa-search'></i>&nbsp;Per meetnet
          </Button>
        <br/><br/>
        <p id='location-name'>
        {(this.props.opnames && this.props.opnames.locations.length > 0) ?
          <span>
            <span style={{
              borderBottom: '1px dashed #000',
            }}>{`${this.props.opnames.locations.length} locatie(s)`}
            </span>
            <span
              onClick={() => {
                this.props.dispatch(clearLocationsSelection());
                this.props.dispatch(fetchOpnames());
                this.props.dispatch(fetchFeatures());
              }}
              style={{ cursor: 'pointer' }}>&nbsp;<i className='fa fa-times'></i></span>
          </span> :
          'Geen filter'}
        </p>
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
          <Modal.Header>
            <Modal.Title id='kaartselectie'>Selectie op kaart</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ height: this.state.height - 200 }}>
            <SelectLocationsMap
              {...this.props}
              hideMapModal={this.hideMapModal} />
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
          <Modal.Header>
            <Modal.Title id='kaartselectie'>Lijst selectie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SelectLocationsList {...this.props} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              this.props.dispatch(fetchOpnames());
              this.props.dispatch(fetchFeatures());
              this.props.dispatch(reloadDataForBoxplots());
              this.props.dispatch(reloadAllLineCharts());
              this.props.dispatch(reloadDataForScatterplot());
              this.hideListModal();
            }}>Selecteren &amp; sluiten</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          {...this.props}
          show={this.state.showMeetnetModal}
          onHide={this.hideMeetnetModal}
          dialogClassName={styles.WideModal}>
          <SelectLocationsMeetnet
            hideMeetnetModal={this.hideMeetnetModal}
            {...this.props}
          />
        </Modal>

      </div>
    );
  }
}

SelectLocations.propTypes = {};

export default SelectLocations;
