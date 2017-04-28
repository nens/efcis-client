import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import $ from 'jquery';
import swal from 'sweetalert';
import Spinner from 'better-react-spinkit';
import _ from 'lodash';

require('jstree');
require("!style!css!../../node_modules/sweetalert/lib/sweet-alert.css");
require("!style!css!./SelectParameters.css");

import {
  fetchOpnames,
  fetchFeatures,
  fetchGreyFeatures,
  addParameterToSelection,
  removeParameterFromSelection,
  reloadDataForBoxplots,
  reloadAllLineCharts,
  reloadDataForScatterplot,

} from '../../actions.jsx';


var ParameterList = React.createClass({
  render: function() {
    const dispatch = this.props.dispatch;
    var self = this;
    var filteredParameters = self.props.parameters.filter(function(obj) {
      if (obj.par_oms.toLowerCase().indexOf(self.props.filterString.toLowerCase()) != -1) {
        return obj
      }
      if (obj.par_oms_nl && (obj.par_oms_nl.toLowerCase().indexOf(self.props.filterString.toLowerCase()) != -1)) {
        return obj
      }
    });

    if(filteredParameters.length === 0) return <p className='bg-warning'>Geen resultaten...</p>;

    filteredParameters = filteredParameters.sort(function(a, b){
      if(a.par_oms < b.par_oms) return -1;
      if(a.par_oms > b.par_oms) return 1;
      return 0;
    });

    var parametersList = filteredParameters.map(function(d,i) {
      var itemLabel = d.par_oms;
      if (d.par_oms_nl) { itemLabel = itemLabel + ' - ' + d.par_oms_nl }

      return <li key={i} onClick={(e) => dispatch(addParameterToSelection(d))}>
      <a ref="parameter" id={d.id} style={{cursor:'pointer'}}>
      {itemLabel}
      </a>
      </li>;
    });
    return (<div>
    <ul className="from" id="parameter-list">{parametersList}</ul>
    </div>);
  }
});


var SelectedParameterList = React.createClass({
  render: function() {
    var self = this
    const dispatch = this.props.dispatch;
    var parametersList = []
    var i = 0;
    for (var item in self.props.data) {
      var itemLabel = self.props.data[item].par_oms;
      if (self.props.data[item].par_oms_nl) { itemLabel = itemLabel + ' - ' + self.props.data[item].par_oms_nl }
      i = i + 1;
      parametersList.push( <li key={i} onClick={(e) => dispatch(removeParameterFromSelection(self.props.data[item].id))}>
      <a ref="parameter" id={self.props.data[item].id} style={{cursor:'pointer'}}>
      {itemLabel}
      </a>
      </li>);
    }
    return <div>
    <ul id="parameter-list" className="to" ref="selected_parameters">{parametersList}</ul>
    </div>;
  }
});



class SelectParameterList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      parametergroups: [],
      parameters: [],
      filterString: ''
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadParameters = this.loadParameters.bind(this);
    this.filterParametersByGroup = this.filterParametersByGroup.bind(this);
    this.selectTreeNodesFromStorage = this.selectTreeNodesFromStorage.bind(this);

  }

  selectTreeNodesFromStorage() {
    this.props.opnames.parametergroups.map((id) => {
      $('#parameter-group-tree').jstree('select_node', id);
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    const self = this;

    $.ajax({
      type: "GET",
      url: config.parameterGroupTreeUrl,
      dataType: 'json',
      success: function(data) {
        self.setState({
          parametergroup: data
        });
        $('#parameter-group-tree').jstree({
          'core': {
            'data': self.state.parametergroup
          }
        })
        .on('loaded.jstree', function() {
          $(".jstree").jstree('open_all');
          self.selectTreeNodesFromStorage();
        })
        .on('select_node.jstree', self.filterParametersByGroup);
      }
    });
    //self.loadParameters();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  filterParametersList() {
    var self = this;
    var filterString = ReactDOM.findDOMNode(this.refs.filterText).value;
    if (filterString.length > 1) {
      // For performance reasons, only set new filterstring when more than 2 chars have been entered by the user
      self.setState({
        filterString: filterString
      });
    }
    if (filterString.length === 0) {
      self.setState({
        filterString: ''
      });
    }
  }

  filterParametersByGroup() {
    // console.log('filter parameters');
    var selectedGroups = $("#parameter-group-tree").jstree().get_selected();
    this.loadParameters(selectedGroups);
  }

  loadParameters(groups) {
    const self = this;
    let param = "";
    if (groups !== 'undefined' && groups != null) {
      param = "&parametergroups=" + groups.toString();
    }
    $.ajax({
      type: "GET",
      url: config.parametersUrl + param,
      dataType: 'json',
      success: function(data) {
        self.setState({
          parameters: data.results,
        });
      }
    });
  }

  handleClearSelection() {
    var self = this;
    swal({
      title: "Weet u het zeker?",
      text: "Uw selectie zal verloren gaan",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Ja, ik weet het zeker!",
      closeOnConfirm: false
    }, function() {
      self.setState({
        selectedParameters: {},
        loading: false
      });
      swal("Selectie verwijderd", "De selectie is succesvol verwijderd", "success");
    });
  }

  handleSaveState() {
    var self = this;

    var selectedTreeNodes = $('#parameter-group-tree').jstree('get_selected').toString();
    localStorage.setItem('parameterNodeIds', selectedTreeNodes);

    // localStorage.setItem('selectedLocations', JSON.stringify(self.state.selectedLocations));
    self.props.setSelectedParameters(this.state.selectedParameters);

    var parameterIds = Object.keys(this.state.selectedParameters);
    localStorage.setItem('parameters', parameterIds.toString());
    this.props.setParameterIds(parameterIds.toString());
    this.props.closeModal();
  }

  render() {

    let self = this;
    let parameterlist = <ParameterList
    {...this.props}
    filterString={this.state.filterString}
    parameters={this.state.parameters} />;

    return (
      <div>
      <div className="row">
      <div className="col-md-4" style={{height:50}}>
      <div>Parametergroepen</div>
      </div>
      <div className="col-md-4" style={{height:50}}>
      <input
      type='text'
      ref='filterText'
      style={{ margin: 5 }}
      className='form-control'
      autoFocus='autofocus'
      placeholder='Filter parameters'
      onChange={(e) => this.setState({
        filterString: e.target.value,
      })} />
      </div>
      <div className="col-md-4" style={{height:50}}>
      <div>Geselecteerde Parameters ({this.props.opnames.parameterIds.length})</div>
      </div>
      </div>
      <div className="row">
      <div className="col-md-4" style={{overflowY:'scroll', height:600}}>
      <div id="parameter-group-tree"></div>
      </div>
      <div className="col-md-4" style={{overflowY:'scroll', height:600}}>
      {parameterlist}
      </div>
      <div className="col-md-4" style={{overflowY:'scroll', height:600}}>
      <SelectedParameterList {...this.props} data={this.props.opnames.parameters}/>
      </div>
      </div>
      </div>
    );
  }
}

SelectedParameterList.propTypes = {};

export default SelectParameterList;
