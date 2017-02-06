// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import styles from './SelectParameters.css';
import SelectParameterGroup from './SelectParameterGroup.jsx'
import SelectParameterList from './SelectParameterList.jsx'
import $ from 'jquery';

import {
  fetchFeatures,
  fetchOpnames,
  setParameterGroups,
  setParameters,
  clearParametersSelection
} from '../../actions.jsx';


class SelectParameters extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showParameterGroupsModal: false,
      showParametersModal: false,
    };
    this.hideParameterGroupsModal = this.hideParameterGroupsModal.bind(this);
    this.hideParametersModal = this.hideParametersModal.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  hideParameterGroupsModal() {
    this.setState({ showParameterGroupsModal: false });
  }

  hideParametersModal() {
    this.setState({ showParametersModal: false });
  }

  hideMapModal() {
    this.setState({ showMapModal: false });
  }

  render() {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'><i className='fa fa-sitemap'></i>&nbsp;Parameters</h3>
        </div>
        <div className='panel-body'>
	  <p>
            {(this.props.opnames && this.props.opnames.parametergroups.length > 0) ?
             <span>
               <span style={{
                 borderBottom: '1px dashed #000',
               }}>{`${this.props.opnames.parametergroups.length} parametergroep(en)`}
               </span>
               <span
                   style={{ cursor: 'pointer' }}
                   onClick={() => {
                       this.props.dispatch(setParameterGroups([]));
                       this.props.dispatch(fetchOpnames());
                       this.props.dispatch(fetchFeatures());
                     }}>&nbsp;<i className='fa fa-times'></i></span>
             </span> :
             'Geen filter'}
	</p>
        <Button
            onClick={
              () => this.setState({
                showParameterGroupsModal: true
              })}>
              <i className='fa fa-search'></i>&nbsp;Per groep
          </Button>
          <br/><br/>
          <p>
            {(this.props.opnames && this.props.opnames.parameterIds.length > 0) ?
             <span>
               <span style={{
                 borderBottom: '1px dashed #000',
               }}>{`${this.props.opnames.parameterIds.length} parameter(s)`}
               </span>
               <span
                   style={{ cursor: 'pointer' }}
                   onClick={() => {
                       this.props.dispatch(clearParametersSelection());
                       this.props.dispatch(fetchOpnames());
                       this.props.dispatch(fetchFeatures());
                     }}>&nbsp;<i className='fa fa-times'></i></span>
             </span> :
             'Geen filter'}
	</p>
          <Button
            onClick={
              () => this.setState({
                showParametersModal: true
              })}>
              <i className='fa fa-search'></i>&nbsp;Parameters
          </Button>
        </div>

        <Modal
          {...this.props}
          show={this.state.showParameterGroupsModal}
          onHide={this.hideParameterGroupsModal}
          dialogClassName={styles.WideModal}>
          <Modal.Header closeButton>
            <Modal.Title id='parameters-selectie'>Parametergroep selectie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
	    <SelectParameterGroup {...this.props} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideParameterGroupsModal()}>Sluiten</Button>
	    <Button onClick={() => {
		this.props.dispatch(
		  setParameterGroups(
                    $('#parametergroup-tree').jstree().get_selected()
		  )
		);
		this.props.dispatch(fetchOpnames());
		this.props.dispatch(fetchFeatures());
		this.hideParameterGroupsModal();
            }}>Selecteren &amp; sluiten</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          {...this.props}
          show={this.state.showParametersModal}
          onHide={this.hideParametersModal}
          dialogClassName={styles.WideModal}>
          <Modal.Header closeButton>
            <Modal.Title id='parameters'>Parameters selectie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
	    <SelectParameterList {...this.props} />
          </Modal.Body>
          <Modal.Footer>
	    <Button onClick={this.hideParametersModal}>Sluiten</Button>
	    <Button onClick={() => {
		this.props.dispatch(fetchOpnames());
		this.props.dispatch(fetchFeatures());
		this.hideParametersModal();
            }}>Selecteren &amp; sluiten</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

SelectParameters.propTypes = {};

export default SelectParameters;
