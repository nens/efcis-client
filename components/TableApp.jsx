// @flow
import { connect } from 'react-redux';
import TopNav from './TopNav.jsx';
import Sidebar from './Sidebar.jsx';
import { Wave } from 'better-react-spinkit';
import { Button, Popover, OverlayTrigger, Modal } from 'react-bootstrap';
import Highlighter from 'react-highlight-words';
import 'react-datagrid/index.css';
import { Table } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';
import styles from './TableApp.css';
import sharedStyles from './SharedStyles.css';
import _ from 'lodash';


import {
  fetchOpnames,
  applyFilter,
} from '../actions.jsx';


class TableApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showExportModal: false,
      width: window.innerWidth,
      height: window.innerHeight,
      modalResult: {},
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.gotoPage = _.debounce(this.gotoPage.bind(this), 500);
    this.setFilter = this.setFilter.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideExportModal = this.hideExportModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.props.dispatch(fetchOpnames(this.props.opnames.page));
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  showModal() {
    this.setState({ showModal: true });
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  hideExportModal() {
    this.setState({ showExportModal: false });
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  gotoPage() {
    const page = parseInt(this.refs.gotoPageInput.value) - 1;
    this.props.dispatch(fetchOpnames(page));
  }

  setFilter(q, colName) {
    this.props.dispatch(applyFilter(q, colName));
    this.props.dispatch(fetchOpnames(this.props.opnames.page));
  }

  render() {

    const totalResults = (this.props.opnames.results.count) ?
      this.props.opnames.results.count : 0;
    const totalPages = parseInt(totalResults / 200);

    let admin_dt = '';
    let admin_dd = '';
    if (this.state.modalResult.admin_link) {
      admin_dt = <dt>Admin-link</dt>;
      admin_dd = <dd>
      <a target="_blank"
         href={this.state.modalResult.admin_link}>
         {this.state.modalResult.admin_link}
      </a></dd>;
    }

    return (
      <div>
        <div className='container-fluid'>
          <TopNav {...this.props} />
          <div className={`row ${sharedStyles.MainDiv}`}>
            <div className='col-md-2'>
            <Sidebar {...this.props} />
            </div>
            <div className='col-md-10' >
              <div className={styles.TableDiv}>
                {(this.props.opnames.isFetching) ?
                  <div style={{
                    position: 'absolute',
                    left: this.state.width / 2.7,
                    top: 200,
                  }}>
                    <Wave size={50} />
                  </div>
                  :
                <Table striped bordered condensed hover
                       className={styles.Table}>
                    <thead>
                    <tr style={{ fontWeight: 'bold' }}>
                      <th style={{ width: 300 }}>
                        Locatie omschrijving<br/>
                      <OverlayTrigger
                        trigger='click'
                        placement='bottom'
                        rootClose={true}
                        overlay={
                        <Popover id='filter-popover' title={
                          <span>{'Filter'}
                            {(this.props.opnames.filters.loc_oms) ? <a
                              onClick={() => this.setFilter('', 'loc_oms')}
                              className='btn btn-text btn-xs pull-right'>
                              Wis
                            </a> : ''}
                          </span>
                        }>
                          <input
                            defaultValue={(this.props.opnames.filters.loc_oms) ?
                            this.props.opnames.filters.loc_oms : '' }
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                this.setFilter(
                                  e.target.value, 'loc_oms');
                                }
                              }
                            } />
                        </Popover>
                        }>
                        <Button bsSize='xsmall'>
                          Filter
                        </Button>
                      </OverlayTrigger>
                      <div className='pull-right'>
                        <Button bsSize='xsmall' onClick={(e) => {
                          console.log('sort');
                          // this.props.dispatch(setOrder('loc_oms'))
                        }}>
                          <i className='fa fa-long-arrow-up'></i>
                        </Button>
                      </div>
                      </th>
                      <th style={{ width: 100 }}>
                        ID<br/>
                      <OverlayTrigger
                        trigger='click'
                        placement='bottom'
                        rootClose={true}
                        overlay={
                        <Popover id='filter-popover' title='Filter'>
                          <input
                            defaultValue={(this.props.opnames.filters.id) ?
                            this.props.opnames.filters.id : ''}
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                this.setFilter(
                                  e.target.value, 'id');
                                }
                              }
                            } />
                        </Popover>
                        }>
                        <Button bsSize='xsmall'>
                          Filter
                        </Button>
                      </OverlayTrigger>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Datum<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Tijd<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Parameteromschrijving<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Parameteromschrijving (NL)<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>WNS omschrijving<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Detectiegrens<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Waarde N<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Waarde A<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Activiteit<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Eenheid omschrijving<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Hoedanigheid omschrijving<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Bodemtype<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Afvoergebied<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Watertype<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                      <th>Validatiestatus<br/>
                      <Button bsSize='xsmall'>
                        Filter
                      </Button>
                      <div className='pull-right'>
                        <Button bsSize='xsmall'><i className='fa fa-long-arrow-up'></i></Button>
                      </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{
                    height: this.state.height - 250,
                  }}>
                  {(this.props.opnames.results.results) ?
                    this.props.opnames.results.results.map((result, i) => {
                      return (
                        <tr key={i} onClick={() => this.setState({
                          showModal: true,
                          modalResult: result,
                        })}>
                          <td style={{ width: 300 }}>
                            {result.loc_oms}
                            <Highlighter
                              highlightClassName={styles.Highlight}
                              searchWords={[this.props.opnames.filters.loc_oms]}
                              textToHighlight={result.loc_oms}
                            />
                          </td>
                          <td style={{ width: 100 }}>{result.id}</td>
                          <td>{result.datum}</td>
                          <td>{result.tijd}</td>
                          <td>{result.par_oms}</td>
                          <td>{result.par_oms_nl}</td>
                          <td>{result.wns_oms}</td>
                          <td>{result.detectiegrens}</td>
                          <td>{result.waarde_n}</td>
                          <td>{result.waarde_a}</td>
                          <td>{result.activiteit}</td>
                          <td>{result.eenheid_oms}</td>
                          <td>{result.hoed_oms}</td>
                          <td>{result.grondsoort}</td>
                          <td>{result.afvoergebied}</td>
                          <td>{result.watertype}</td>
                          <td>{result.validatiestatus}</td>
                        </tr>
                      );
                    }) : <tr/>
                  }
                  </tbody>
                  </Table>
                }
              </div>
              <hr/>
              {_.range(1, totalPages).map((r, i) => {
                if (i > 11 ) return false;
                return (
                  <span key={i} style={{ overflowY: 'hidden' }}>
                    <a
                      onClick={(e) => this.props.dispatch(
                        fetchOpnames(r))}
                      style={{
                        cursor: 'pointer',
                        textDecoration: (this.props.opnames.page === r) ? 'underline' : '',
                      }}>{r}</a>&nbsp;
                  </span>
                );
              })}
              &nbsp;
              <input
                type='number'
                min='12'
                ref='gotoPageInput'
                max={totalPages}
                // defaultValue={this.props.opnames.page}
                onChange={this.gotoPage} />
              &nbsp;
              {_.range(1, totalPages).map((r, i) => {
                if (i < totalPages - 10 || totalPages < 11 ) return false;
                return (
                  <span key={i} style={{ overflowY: 'hidden' }}>
                    <a
                      onClick={(e) => this.props.dispatch(
                        fetchOpnames(r))}
                      style={{
                        cursor: 'pointer',
                        textDecoration: (this.props.opnames.page === r) ? 'underline' : '',
                      }}>{r}</a>&nbsp;
                  </span>
                );
              })}&nbsp;

              <a
                onClick={() => this.setState({ showExportModal: true })}
                role='button'
                className='btn btn-default btn-xm pull-right'>
                Exporteren
              </a>
            </div>
          </div>
        </div>

        <Modal
          show={this.state.showModal}
          onHide={this.hideModal}
          dialogClassName={styles.WideModal}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">
              {this.state.modalResult.wns_oms}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <dl className="dl-horizontal">
              {admin_dt}{admin_dd}
              <dt>Location ID</dt>
              <dd>{this.state.modalResult.loc_id}</dd>
              <dt>Locatie Omschrijving</dt>
              <dd>{this.state.modalResult.loc_oms}</dd>
              <dt>WNS Omschrijving</dt>
              <dd>{this.state.modalResult.wns_oms}</dd>
              <dt>WNS Code</dt>
              <dd>{this.state.modalResult.wns_code}</dd>
              <dt>Parameter Code</dt>
              <dd>{this.state.modalResult.par_code}</dd>
              <dt>Parameter Omschrijving</dt>
              <dd>{this.state.modalResult.par_oms}</dd>
              <dt>(NL)Parameter Omschrijving</dt>
              <dd>{this.state.modalResult.par_oms_nl}</dd>
              <dt>Waarde_N</dt>
              <dd>{this.state.modalResult.waarde_n}</dd>
              <dt>Waarde_A</dt>
              <dd>{this.state.modalResult.waarde_a}</dd>
              <dt>Detectiegrens</dt>
              <dd>{this.state.modalResult.detectiegrens}</dd>
              <dt>Datum</dt>
              <dd>{this.state.modalResult.datum}</dd>
              <dt>Tijd</dt>
              <dd>{this.state.modalResult.tijd}</dd>
              <dt>Validatiestatus</dt>
              <dd>{this.state.modalResult.validatiestatus}</dd>
              <dt>Meetnet</dt>
              <dd>{this.state.modalResult.meetnet}</dd>
              <dt>X1_COORD</dt>
              <dd>{this.state.modalResult.x1}</dd>
              <dt>Y1_COORD</dt>
              <dd>{this.state.modalResult.y1}</dd>
              <dt>X2_COORD</dt>
              <dd>{this.state.modalResult.x2}</dd>
              <dt>Y2_COORD</dt>
              <dd>{this.state.modalResult.y2}</dd>
              <dt>Waterlichaam</dt>
              <dd>{this.state.modalResult.waterlichaam}</dd>
              <dt>Water Type</dt>
              <dd>{this.state.modalResult.watertype}</dd>
              <dt>Status KRW</dt>
              <dd>{this.state.modalResult.status_krw}</dd>
              <dt>Activiteit</dt>
              <dd>{this.state.modalResult.activiteit}</dd>
              <dt>Activiteit Oms.</dt>
              <dd>{this.state.modalResult.act_oms}</dd>
              <dt>Activiteit Type</dt>
              <dd>{this.state.modalResult.activiteit_type}</dd>
              <dt>Uitvoerende</dt>
              <dd>{this.state.modalResult.uitvoerende}</dd>
              <dt>MET_MAFA</dt>
              <dd>{this.state.modalResult.met_mafa}</dd>
              <dt>MET_MAFY</dt>
              <dd>{this.state.modalResult.met_MAFY}</dd>
              <dt>MET_FYT</dt>
              <dd>{this.state.modalResult.met_fyt}</dd>
              <dt>MET_VIS</dt>
              <dd>{this.state.modalResult.met_vis}</dd>
              <dt>MET_FC</dt>
              <dd>{this.state.modalResult.met_fc}</dd>
              <dt>MET_TOETS</dt>
              <dd>{this.state.modalResult.met_toets}</dd>
              <dt>Eenheid</dt>
              <dd>{this.state.modalResult.eenheid}</dd>
              <dt>Eenheid Oms.</dt>
              <dd>{this.state.modalResult.eenheid_oms}</dd>
              <dt>Hoedanigheid</dt>
              <dd>{this.state.modalResult.hoedanigheid}</dd>
              <dt>Hoedanigheid Oms.</dt>
              <dd>{this.state.modalResult.hoed_oms}</dd>
              <dt>Compartiment</dt>
              <dd>{this.state.modalResult.compartiment}</dd>
              <dt>Compartiment Oms.</dt>
              <dd>{this.state.modalResult.comp_oms}</dd>
              <dt>Bodemtype</dt>
              <dd>{this.state.modalResult.grondsoort}</dd>
              <dt>Landgebruik</dt>
              <dd>{this.state.modalResult.landgebruik}</dd>
              <dt>Afvoergebied</dt>
              <dd>{this.state.modalResult.afvoergebied}</dd>
              <dt>Opmerkingen</dt>
              <dd>{this.state.modalResult.opmerkingen}</dd>
              <dt>VIS_OPP_HA</dt>
              <dd>{this.state.modalResult.vis_opp_ha}</dd>
              <dt>VIS_KG</dt>
              <dd>{this.state.modalResult.vis_kg}</dd>
              <dt>VIS_CM</dt>
              <dd>{this.state.modalResult.vis_cm}</dd>
              <dt>Locatiestatus</dt>
              <dd>{this.state.modalResult.meet_status}</dd>
          </dl>

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideModal}>Sluiten</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.showExportModal}
          onHide={this.hideExportModal}
          dialogClassName={styles.WideModal}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">
              Exporteren
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>


          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideExportModal}>Sluiten</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

TableApp.propTypes = {};

function mapStateToProps(state) {
  // This function maps the Redux state to React Props.
  return {
    'opnames': state.opnames,
  };
}


export default connect(mapStateToProps)(TableApp);
