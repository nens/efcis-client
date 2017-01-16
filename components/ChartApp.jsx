// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import sharedStyles from './SharedStyles.css';
import TopNav from './TopNav.jsx';
import Sidebar from './Sidebar.jsx';
import {Tabs, Tab} from 'react-bootstrap';
import {ScatterChart, Scatter, AreaChart, Area, Brush, LineChart, ReferenceLine, BarChart, Line, Bar, XAxis, YAxis,
        CartesianGrid, Tooltip, Legend} from 'recharts';

import _ from 'lodash';

// import {} from '../actions.jsx';

class ChartApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
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

  updateDimensions() {
    this.setState({
      width: document.getElementById('chart').offsetWidth-20,
      height: document.getElementById('chart').offsetHeight,
    });
  }

  render() {
    const scatterdata = [{x: 100, y: 200, z: 200}, {x: 120, y: 100, z: 260},
                  {x: 170, y: 300, z: 400}, {x: 140, y: 250, z: 280},
                  {x: 150, y: 400, z: 500}, {x: 110, y: 280, z: 200}];

    const linedata = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];

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
                <LineChart width={this.state.width} height={500} data={linedata}
                           margin={{top: 20, right: 50, left: 20, bottom: 5}}>
                 <XAxis dataKey='name'/>
                 <YAxis/>
                 <CartesianGrid strokeDasharray='3 3'/>
                 <Tooltip/>
                 <Legend />
                 <ReferenceLine x='Page C' stroke='red' label='Max PV PAGE'/>
                 <ReferenceLine y={9800} label='Max' stroke='red'/>
                 <Line type='monotone' dataKey='pv' stroke='#8884d8' />
                 <Line type='monotone' dataKey='uv' stroke='#82ca9d' />
                </LineChart>
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
