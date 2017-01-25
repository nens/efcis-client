import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import $ from 'jquery';
import swal from 'sweetalert';
import Spinner from 'better-react-spinkit';
import _ from 'lodash';

require('jstree');
require("!style!css!../../node_modules/sweetalert/lib/sweet-alert.css");
require("!style!css!./SelectParameters.css");


class SelectParameterGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      parametergroups: [],
      parameters: [],
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadParameters = this.loadParameters.bind(this);
    this.filterParametersByGroup = this.filterParametersByGroup.bind(this);
    this.selectTreeNodesFromStore = this.selectTreeNodesFromStore.bind(this);
  }
  
  selectTreeNodesFromStore() {
    this.props.opnames.parametergroups.map((id) => {
      $('#parametergroup-tree').jstree('select_node', id);
    });
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
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
	  parametergroups: data,
	});
	// console.log('parameter tree');
	$('#parametergroup-tree').jstree({
	  'core': {
	    'data': self.state.parametergroups
	  }
	})
	.on('loaded.jstree', function() {
	  $(".jstree").jstree('open_all');
	  self.selectTreeNodesFromStore();
	})
	.on('deselect_node.jstree', self.filterParametersByGroup)
	.on('select_node.jstree', self.filterParametersByGroup);
      }
    });
  }

  removeSelectedParameter(par_id) {
    var params = _.omit(this.state.selectedParameters, par_id);
    this.setState({
      selectedParameters: params
    });
  }

  addSelectedParameter(par) {
    var params = this.state.selectedParameters;
    params[par.id] = par
    this.setState({
      selectedParameters: params
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
    var selectedGroups = $("#parametergroup-tree").jstree().get_selected();
    if (selectedGroups.length > 0) {
      this.loadParameters(selectedGroups);
    } else {
      this.setState({ parameters: [] });
    }
  }

  loadParameters(groups) {
    window.addEventListener('resize', this.updateDimensions);
    const self = this;
    var param = "";
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
        parameters: []
      });
      var groupTree = $("#parametergroup-tree").jstree();
      groupTree.deselect_all(true);
      swal("Selectie verwijderd", "De selectie is succesvol verwijderd", "success");
    });
  }

  handleSaveState() {
    // Store selection in local storage and reload the page.
    var selectedGroups = $("#parametergroup-tree").jstree().get_selected();
    localStorage.setItem('parametergroeps', selectedGroups.toString());
    this.props.setParameterGroupIds(selectedGroups.toString());
    this.props.closeModal();
  }

  render() {
      
    let filteredParameters = this.state.parameters;
    filteredParameters = filteredParameters.sort(function(a, b){
      if(a.par_oms < b.par_oms) return -1;
      if(a.par_oms > b.par_oms) return 1;
      return 0;
    });

    var parametersList = filteredParameters.map(function(d, i) {
      var itemLabel = d.par_oms;
      if (d.par_oms_nl) { itemLabel = itemLabel + ' - ' + d.par_oms_nl }
      return (
	<li key={i}>
          {itemLabel}
	</li>);
      });
      
    return (
      <div>
	<div className='row'>
          <div className='col-md-6' style={{ overflowY: 'scroll', height: 600 }}>
            <div id='parametergroup-tree' />
          </div>
          <div className='col-md-6' style={{ overflowY: 'scroll', height: 600 }}>
            {(parametersList.length > 0) ?
             parametersList :
             <div style={{
	       position: 'absolute',
	       top: 100,
               left: '20%',
               color: '#ccc',
               fontSize: '1.5em',
             }}>Geen resultaten...</div>}
            </div>
        </div>
      </div>
    );
  }
}

SelectParameterGroup.propTypes = {};

module.exports = SelectParameterGroup;
