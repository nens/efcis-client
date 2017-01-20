// @flow
import { connect } from 'react-redux';
import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import sharedStyles from './SharedStyles.css';
import TopNav from './TopNav.jsx';
import styles from './ChartApp.css';
import Sidebar from './Sidebar.jsx';
import {Button, Modal, Tabs, Tab} from 'react-bootstrap';
import {ScatterChart, Scatter, AreaChart, Area, Brush, LineChart, ReferenceLine, BarChart, Line, Bar, XAxis, YAxis,
        CartesianGrid, Tooltip, Legend} from 'recharts';
import _ from 'lodash';

import {
  fetchCharts,
  addToLinechartsLeftY,
  removeFromLinechartsLeftYById,
} from '../actions.jsx';


class LineChartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps, nextState) {
    // // console.log('nextProps', nextProps);
    // // console.log('nextState', nextState);
    // if (nextProps.opnames.linechartsLeftY.length > this.props.opnames.linechartsLeftY.length) {
    //   console.log('fetch line data');
    //   const chartLoaders = nextProps.opnames.linechartsLeftY.map((chart) => {
    //     return $.ajax({
    //       type: 'GET',
    //       url: `/api/lines/${chart.id}/`,
    //       success: (data) => {
    //         return data;
    //       }
    //     });
    //   });
    //   Promise.all([chartLoaders]).then(([chartResults]) => {
    //     console.log('------>', chartResults);
    //   });
    // }
  }

  render() {
    // const linedata = [
    //   {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    //   {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    // ];
    const dataArrays = this.props.opnames.linechartsLeftY.map((chartObject) => {
      return {
        'data': chartObject.data,
        'id': chartObject.id,
        'unit': chartObject.unit,
        'wns': chartObject.wns,
        'location': chartObject.location,
      };
    });
    const linedata = dataArrays.map((dataArray) => {
      return dataArray.data.map((d) => {
        return {
          name: dataArray.location,
          datetime: d.datetime,
          value: d.value,
        };
      });
    });

    console.log('----->', _.concat(linedata));

    return (
      <LineChart width={this.props.width}
                 height={500}
                 data={linedata[1]}
                 margin={{top: 20, right: 50, left: 20, bottom: 5}}>
        <XAxis dataKey='datetime'/>
        <YAxis/>
        <CartesianGrid strokeDasharray='3 3'/>
        <Tooltip/>
        <Legend />
        <ReferenceLine x='Page C' stroke='red' label='Max PV PAGE'/>
        <ReferenceLine y={9800} label='Max' stroke='red'/>
        <Line type='monotone' dataKey='value' stroke='#8884d8' />
        {/* <Line type='monotone' dataKey='uv' stroke='#82ca9d' /> */}
     </LineChart>
    );
  }
}


class ChartApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      showLeftYAxisModal: false,
      showRightYAxisModal: false,
      currentUnit: undefined,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.hideLeftYAxisModal = this.hideLeftYAxisModal.bind(this);
    this.hideRightYAxisModal = this.hideRightYAxisModal.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);

    Highcharts.chart(this.refs.boxplotContainer, {
       'chart':{
          'type':'boxplot'
       },
       'title':{
          'text':'test'
       },

       'xAxis':{
          'categories':[
             'Amerongerwetering bij Immenhof (MACFT_URTIDIOI[%][NVT][OW]) 01-01-2009 - 01-03-2012'
          ],
          'title':{
             'text':'Opnames'
          }
       },
       'yAxis':{
          'title':{
             'text':'test'
          }
       },
       'series':[
          {
             'name':'Opnames',
             'data':[
                [
                   0.5,
                   0.5,
                   0.5,
                   0.5,
                   0.5
                ]
             ],
             'tooltip':{
                'headerFormat':'<em>{series.name} - {point.key}</em><br/>'
             },
             '_colorIndex':0
          }
       ]
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  hideLeftYAxisModal() {
    this.setState({ showLeftYAxisModal: false });
  }

  hideRightYAxisModal() {
    this.setState({ showRightYAxisModal: false });
  }

  updateDimensions() {
    this.setState({
      width: document.getElementById('chart').offsetWidth - 20,
      height: document.getElementById('chart').offsetHeight,
    });
  }

  render() {
    const scatterdata = [{x: 100, y: 200, z: 200}, {x: 120, y: 100, z: 260},
                  {x: 170, y: 300, z: 400}, {x: 140, y: 250, z: 280},
                  {x: 150, y: 400, z: 500}, {x: 110, y: 280, z: 200}];



    const candledata = [
      {x: new Date(2016, 6, 1), open: 5, close: 10, high: 15, low: 0},
      {x: new Date(2016, 6, 2), open: 10, close: 15, high: 20, low: 5},
      {x: new Date(2016, 6, 3), open: 15, close: 20, high: 25, low: 10},
    ];

    return (
      <div>
        <div className='container-fluid'>
          <TopNav {...this.props} />
          <div className={`row ${sharedStyles.MainDiv}`}>
            <div className='col-md-2'>
            <Sidebar {...this.props} />
            </div>
            <div className='col-md-10' id='chart'>
            <Tabs activeKey={this.state.key} id='chart-tab'>
              <Tab eventKey={1} title='Tijdreeks'>
                <LineChartComponent
                  {...this.props}
                  width={this.state.width}
                />
                <hr/>
                <div className='col-md-6'>
                  <Button onClick={() => {
                    this.props.dispatch(fetchCharts());
                    this.setState({ showLeftYAxisModal: true, });
                  }}>
                    <i className='fa fa-plus-circle'></i>
                  </Button>
                </div>
                <div className='col-md-6'>
                  <Button
                    className='pull-right'
                    onClick={() => {
                      this.props.dispatch(fetchCharts());
                      this.setState({ showRightYAxisModal: true, });
                    }}>
                    <i className='fa fa-plus-circle'></i>
                  </Button>
                </div>
              </Tab>
              <Tab eventKey={2} title='Boxplot'>
                <div
                  ref='boxplotContainer'
                  style={{width: '100%'}}
                  id='boxplot-container'>
                </div>
              </Tab>
              <Tab eventKey={3} title='Scatterplot'>
                <ScatterChart
                  width={this.state.width}
                  height={500}
                  margin={{top: 20, right: 100, bottom: 20, left: 20}}>
                  <XAxis dataKey={'x'} name='stature' unit='cm'/>
                  <YAxis dataKey={'y'} name='weight' unit='kg'/>
                	<Scatter name='A school' data={scatterdata} fill='#8884d8'/>
                	<CartesianGrid />
                	<Tooltip cursor={{strokeDasharray: '3 3'}}/>
                </ScatterChart>
              </Tab>
            </Tabs>
            </div>
          </div>
        </div>
        <Modal
          {...this.props}
          show={this.state.showLeftYAxisModal}
          dialogClassName={styles.WideModal}
          onHide={this.hideLeftYAxisModal}>
          <Modal.Header closeButton>
            <Modal.Title id='leftYAxisModal'>
              Configureer linker Y-as
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className='row'>
          <div className='col-md-6'>
            <ul style={{
              height: 600,
              overflowY: 'scroll',
            }}>
              {this.props.opnames.charts.map((chart, i) => {
                return (
                  <li key={i}
                      onClick={() => {
                        if (this.state.currentUnit === chart.unit ||
                           !this.state.currentUnit) {
                          this.setState({
                            currentUnit: chart.unit,
                          });
                          this.props.dispatch(addToLinechartsLeftY(chart));
                        }
                      }}
                      style={{
                        cursor: (this.state.currentUnit === chart.unit ||
                                !this.state.currentUnit) ? 'pointer' : '',
                        opacity: (this.state.currentUnit === chart.unit ||
                                !this.state.currentUnit) ? 1 : 0.4,
                      }}>
                      {chart.wns} - {chart.location}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='col-md-6'>
            <ul>
              {this.props.opnames.linechartsLeftY.map((chart, i) => {
                return (
                  <li
                    style={{ cursor: 'pointer', }}
                    onClick={() => {
                      this.props.dispatch(
                        removeFromLinechartsLeftYById(chart.id)
                      );
                    }}
                    key={i}>
                    {/* {chart.wns} - {chart.location} */}
                  </li>
                );
              })}
            </ul>
          </div>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              this.hideLeftYAxisModal();
            }}>Toepassen</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          {...this.props}
          show={this.state.showRightYAxisModal}
          dialogClassName={styles.WideModal}
          onHide={this.hideRightYAxisModal}>
          <Modal.Header closeButton>
            <Modal.Title id='rightYAxisModal'>Configureer rechter Y-as</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul style={{
              height: 600,
              overflowY: 'scroll',
            }}>
              {this.props.opnames.charts.map((chart, i) => {
                return (
                  <li key={i}
                      style={{ cursor: 'pointer' }}>
                      {chart.wns} - {chart.location}
                  </li>
                );
              })}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              this.hideRightYAxisModal();
            }}>Toepassen</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

ChartApp.propTypes = {};

function mapStateToProps(state) {
  // This function maps the Redux state to React Props.
  return {
    'opnames': state.opnames,
  };
}

export default connect(mapStateToProps)(ChartApp);
