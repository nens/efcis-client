import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import styles from './SelectLocationsMeetnet.css';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import L from 'leaflet';
import $ from 'jquery';

import {
  setMeetnets,
  fetchOpnames,
  fetchFeatures,
  reloadDataForBoxplots,
  reloadAllLineCharts,
  reloadDataForScatterplot,
} from '../../actions.jsx';

class SelectLocationsMeetnet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      meetnet: [],
      locations: [],
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadLocations = this.loadLocations.bind(this);
    this.filterLocationsByMeetnet = this.filterLocationsByMeetnet.bind(this);
    this.selectTreeNodesFromStore = this.selectTreeNodesFromStore.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    const self = this;
    $.ajax({
      type: 'GET',
      url: config.meetnetTreeUrl,
      dataType: 'json',
      success: (data) => {
        self.setState({
          meetnet: data,
        });
        $('#meetnet-tree').jstree({
          'core': {
            'data': self.state.meetnet,
          },
        })
        .on('loaded.jstree', () => {
          $('.jstree').jstree('open_all');
          this.selectTreeNodesFromStore();
        })
        .on('deselect_node.jstree', self.filterLocationsByMeetnet)
        .on('select_node.jstree', self.filterLocationsByMeetnet);
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps) ||
  //          !_.isEqual(this.state, nextState);
  // }

  componentWillReceiveProps(newProps) {}

  selectTreeNodesFromStore() {
    this.props.opnames.meetnets.map((id) => {
      $('#meetnet-tree').jstree('select_node', id);
    });
  }

  filterLocationsByMeetnet() {
    const selectedMeetnetten = $('#meetnet-tree').jstree().get_selected();
    if (selectedMeetnetten.length > 0) {
      this.loadLocations(selectedMeetnetten);
    }
    else {
      this.setState({ locations: [] });
    }
  }

  loadLocations(meetnetten) {
    const self = this;
    let param = '';
    if (meetnetten !== 'undefined' && meetnetten !== null) {
      param = '&meetnets=' + meetnetten.toString();
    }

    $.ajax({
      type: 'GET',
      url: config.locationsUrl + param,
      dataType: 'json',
      success: (data) => {
        self.setState({
          locations: data.results,
        });
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

    let filteredLocations = this.state.locations;

    filteredLocations = filteredLocations.sort((a, b) => {
      if (a.properties.loc_oms < b.properties.loc_oms) {
        return -1;
      }
      if (a.properties.loc_oms > b.properties.loc_oms) {
        return 1;
      }
      return 0;
    });

    const locationsList = filteredLocations.map((d, i) => {
      return (
        <li key={i}>
          {d.properties.loc_oms} ({d.properties.loc_id})
        </li>
      );
    });

    return (
      <div>
        <Modal.Header>
          <Modal.Title id='kaartselectie'>Meetnetselectie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-md-6' style={{ overflowY: 'scroll', height: 600 }}>
               <div id='meetnet-tree' />
            </div>
            <div className='col-md-6' style={{ overflowY: 'scroll', height: 600 }}>
              {(locationsList.length > 0) ?
                locationsList :
                <div style={{
                  position: 'absolute',
                  top: 100,
                  left: '20%',
                  color: '#ccc',
                  fontSize: '1.5em',
                }}>Selecteer een of meerdere meetnet(ten)</div>
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {
            this.props.hideMeetnetModal();
            this.props.dispatch(
              setMeetnets(
                $('#meetnet-tree').jstree().get_selected()
              )
            );
            this.props.dispatch(fetchOpnames());
            this.props.dispatch(fetchFeatures());
            this.props.dispatch(reloadDataForBoxplots());
            this.props.dispatch(reloadAllLineCharts());
            this.props.dispatch(reloadDataForScatterplot());
          }}>Selecteren &amp; sluiten</Button>
        </Modal.Footer>
      </div>
    );
  }
}

SelectLocationsMeetnet.propTypes = {};

export default SelectLocationsMeetnet;
