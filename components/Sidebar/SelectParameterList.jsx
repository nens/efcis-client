import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import $ from 'jquery';
import swal from 'sweetalert';
import Spinner from 'better-react-spinkit';
import _ from 'lodash';

require('jstree');
require("!style!css!../../node_modules/sweetalert/lib/sweet-alert.css");
require("!style!css!./SelectParameters.css");


var ParameterList = React.createClass({
    render: function() {
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

          return <li key={i} onClick={self.props.addSelectedParameter.bind(null, d)}>
                   <a ref="parameter" id={d.id} style={{cursor:'pointer'}}>
                     {itemLabel}
                   </a>
           </li>;
      });
      return <div>
                 <ul className="from" id="parameter-list">{parametersList}</ul>
             </div>;
    }
});


var SelectedParameterList = React.createClass({
    render: function() {
        var self = this
        var parametersList = []
        var i = 0;
        for (var item in self.props.data) {
	    var itemLabel = self.props.data[item].par_oms;
	    if (self.props.data[item].par_oms_nl) { itemLabel = itemLabel + ' - ' + self.props.data[item].par_oms_nl }
            i = i + 1;
            parametersList.push( <li key={i} onClick={self.props.removeSelectedParameter.bind(null, item)}>
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
    console.log("Run Constructor");
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      parametergroups: [],
      parameters: [],
      filterString: ''
      //selectedParameters: JSON.parse(localStorage.getItem('selectedParameters')) || {},
    }
  }

  selectTreeNodesFromLocalStorage() {
    try {
      var ids = localStorage.getItem('parameterNodeIds').split(',');
      _.each(ids, function(id) {
        $('#parameter-group-tree').jstree('select_node', id);
      });
    } catch (e) {}
  }

  componentDidMount() {

    // console.log('comp didmount');
    const self = this;
    console.log("RUN MOUNT");
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
	  self.selectTreeNodesFromLocalStorage();
	})
	.on('select_node.jstree', self.filterParametersByGroup);
      }
    });
    // self.loadParameters();
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
    // console.log('filter parameters');
    var selectedGroups = $("#parameter-group-tree").jstree().get_selected();
    this.loadParameters(selectedGroups);  
  }

  loadParameters(groups) {
    // console.log('load');
    var self = this;
    self.setState({
      loading: true
    });
    var param = "";
    if (groups !== 'undefined' && groups != null) {
      param = "&parametergroups=" + groups.toString();
    }
    $.ajax({
      type: "GET",
      url: config.parametersUrl + param,
      dataType: 'json',
      success: function(data) {
        // console.log('groups', groups);
        self.setState({
          parameters: data.results,
          loading: false
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
    var self = this;
    if(self.state.loading === true) {
      var parameterlist = (
        <Spinner spinnerName='three-bounce' noFadeIn />
      );
    } else {
      var parameterlist = <ParameterList
                              filterString={this.state.filterString}
                              parameters={this.state.parameters}
                              addSelectedParameter={this.addSelectedParameter} />;
    }
    
    

        return (
            <div>
          <div className="row">
            <div className="col-md-4" style={{height:50}}>
              <div>Parametergroepen</div>
            </div>
            <div className="col-md-4" style={{height:50}}>
              <input type="text" ref="filterText"
                           className="form-control" placeholder="Filter resultaten"
                           onChange={this.filterParametersList} />
            </div>
            <div className="col-md-4" style={{height:50}}>
              <div>Geselecteerde Parameters ({_.size(this.state.selectedParameters)})</div>
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
              <SelectedParameterList
                      data={this.state.selectedParameters}
                removeSelectedParameter={this.removeSelectedParameter}/>
            </div>
          </div>
              <div className="row">

                  <div className="modal-footer btn-group" role="group" aria-label="..." style={{float:'right',paddingRight:10}}>
                    <div className="btn-group" role="group" aria-label="..." style={{float:'right',paddingRight:10}}>
                      <button type="button" className="btn btn-default" onClick={this.handleClearSelection}>Leegmaken</button>
                      <button type="button" className="btn btn-default" onClick={this.handleSaveState}>Toepassen</button>
                    </div>
                  </div>
              </div>
           </div>
        );
      }


}

module.exports = SelectParameterList;
