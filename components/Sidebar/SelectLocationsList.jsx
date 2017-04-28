import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import styles from './SelectLocationsList.css';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import $ from 'jquery';

import {
  addLocationToSelection,
  removeLocationFromSelection,
  fetchGreyFeatures,
  reloadDataForBoxplots,
  reloadAllLineCharts,
  reloadDataForScatterplot,
 } from '../../actions.jsx';

class SelectLocationsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      meetnet: [],
      locations: [],
      filterString: '',
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

        $('#meetnet-location-tree').jstree({
          'core': {
            'data': self.state.meetnet,
          },
        })
        .on('loaded.jstree', () => {
          $('.jstree').jstree('open_all');
          self.selectTreeNodesFromStore();
        })
        .on('select_node.jstree', self.filterLocationsByMeetnet);
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) ||
           !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  selectTreeNodesFromStore() {
    this.props.opnames.meetnets.map((id) => {
      $('#meetnet-location-tree').jstree('select_node', id);
    });
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

  filterLocationsByMeetnet() {
    const selectedMeetnetten = $('#meetnet-location-tree').jstree().get_selected();
    this.loadLocations(selectedMeetnetten);
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  render() {

    let filteredLocations = this.state.locations.filter((location) => {
      if (location.properties.loc_oms.toLowerCase().indexOf(this.state.filterString.toLowerCase()) != -1 ||
          location.properties.loc_id.toLowerCase().indexOf(this.state.filterString.toLowerCase()) != -1) {
        return location;
      }
    });

    filteredLocations = filteredLocations.sort((a, b) => {
      if(a.properties.loc_oms < b.properties.loc_oms) {
        return -1;
      }
      if(a.properties.loc_oms > b.properties.loc_oms) {
        return 1;
      }
      return 0;
    });

    const locationsList = filteredLocations.map((d, i) => {
      return (
        <li key={i}>
          <a ref='location'
             onClick={() => {
               this.props.dispatch(
                addLocationToSelection(d)
               );
             }}
             id={d.properties.id}
             style={{ cursor: 'pointer' }}>
            {d.properties.loc_oms} ({d.properties.loc_id})
          </a>
        </li>
      );
    });



    const selectedLocationsList = this.props.opnames.locations.map((l, i) => {
      return (
        <li key={i}>
          <a ref='selectedLocation'
             onClick={() => {
               this.props.dispatch(
                removeLocationFromSelection(l.id)
               );
             }}
             id={l.properties.id}
             style={{ cursor: 'pointer' }}>
            {l.properties.loc_oms} ({l.properties.loc_id})
          </a>
        </li>
      );
    });

    return (
      <div>
          <div className='row'>
            <div className='col-md-4'
                 style={{ overflowY: 'scroll', height: 600 }}>
               <div id='meetnet-location-tree' />
            </div>
            <div className='col-md-4'>
                 <input
                    type='text'
                    ref='filterText'
                    style={{ margin: 5 }}
                    className='form-control'
                    autoFocus='autofocus'
                    placeholder='Filter locaties'
                    onChange={(e) => this.setState({
                      filterString: e.target.value,
                    })} />
                 <ul className='from'
                     style={{ overflowY: 'scroll', height: 600 }}
                     id='location-list'>
                   {locationsList}
                 </ul>
            </div>
            <div className='col-md-4'
                 style={{
                   overflowY: 'scroll',
                   height: 600,
                  }}>
                {(selectedLocationsList.length > 0) ?
                  <ul className='to'
                      id='selection-location-list'>
                    {selectedLocationsList}
                  </ul>
                  :
                  <div style={{
                    position: 'absolute',
                    top: 100,
                    left: '20%',
                    color: '#ccc',
                    fontSize: '1.5em',
                  }}>Selecteer een of meerdere locatie(s)</div>
                }
            </div>
          </div>
       </div>
    );
  }
}

SelectLocationsList.propTypes = {};

export default SelectLocationsList;
