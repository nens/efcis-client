// @flow
import { connect } from 'react-redux';
import $ from 'jquery';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import sharedStyles from './SharedStyles.css';
import { CompactPicker } from 'react-color';
import { Wave } from 'better-react-spinkit';
import TopNav from './TopNav.jsx';
import styles from './ChartApp.css';
import Sidebar from './Sidebar.jsx';
import { ButtonGroup, Button, Modal, Tabs, Tab, Table, OverlayTrigger, Popover } from 'react-bootstrap';
import _ from 'lodash';

import {
  addToBoxplotCharts,
  addToLinechartsLeftY,
  addToLinechartsRightY,
  fetchCharts,
  fetchScatterplotDataByUrl,
  fetchSecondScatterplotAxis,
  removeFromBoxplotChartsById,
  removeFromLinechartsLeftYById,
  removeFromLinechartsRightYById,
  setLeftAxisMaxForLinechart,
  setLeftLineColorById,
  setLeftLineStyleById,
  setLeftLineWidthById,
  setRightLineColorById,
  setRightLineStyleById,
  setRightLineWidthById,
  setLeftAxisMinForLinechart,
  setRightAxisMaxForLinechart,
  setRightAxisMinForLinechart,
  setTresholdForLinechart,
  toggleUserDaterange,
  toggleSymbols,
} from '../actions.jsx';


class LineChartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderChart = this.renderChart.bind(this);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  // }

  renderChart() {

    const leftSeries = this.props.opnames.linechartsLeftY.map((linechart, i) => {
      let dashStyle = undefined;
      let lineWidth = 1;

      switch (linechart.style) {
        case 1:
          dashStyle = undefined;
        break;
        case 2:
          dashStyle = 'shortdot';
        break;
        case 3:
          dashStyle = 'dot';
        break;
        case 4:
          dashStyle = 'longdash';
        break;
      }

      switch (linechart.lineWidth) {
        case 1:
          lineWidth = 1;
        break;
        case 2:
          lineWidth = 2;
        break;
        case 3:
          lineWidth = 3;
        break;
        case 4:
          lineWidth = 4;
        break;
        case 5:
          lineWidth = 5;
        break;
      }

      return {
        animation: false,
        name: `${linechart.location} (${linechart.unit})`,
        type: 'line',
        dashStyle,
        lineWidth,
        color: linechart.lineColor,
        data: linechart.data.map((d) =>
          [moment(d.datetime).valueOf(), d.value]),
        tooltip: {
          valueSuffix: ` (${linechart.unit})`,
        },
      };
    });

    const rightSeries = this.props.opnames.linechartsRightY.map((linechart, i) => {
      let dashStyle = undefined;
      let lineWidth = 1;

      switch (linechart.style) {
        case 1:
          dashStyle = undefined;
        break;
        case 2:
          dashStyle = 'shortdot';
        break;
        case 3:
          dashStyle = 'dot';
        break;
        case 4:
          dashStyle = 'longdash';
        break;
      }

      switch (linechart.lineWidth) {
        case 1:
          lineWidth = 1;
        break;
        case 2:
          lineWidth = 2;
        break;
        case 3:
          lineWidth = 3;
        break;
        case 4:
          lineWidth = 4;
        break;
        case 5:
          lineWidth = 5;
        break;
      }

      return {
        animation: false,
        name: `${linechart.location} (${linechart.unit})`,
        type: 'line',
        dashStyle,
        lineWidth,
        color: linechart.lineColor,
        yAxis: 1,
        data: linechart.data.map((d) =>
          [moment(d.datetime).valueOf(), d.value]),
        tooltip: {
          valueSuffix: ` (${linechart.unit})`,
        },
      };
    });

    const combinedSeries = [...leftSeries, ...rightSeries];

    Highcharts.chart(this.refs.linechartContainer, {
      chart: {
        animation: false,
        zoomType: 'xy',
      },
      title: {
        text: '',
      },
      xAxis: [{
        dateTimeLabelFormats: { // don't display the dummy year
          second: '%Y-%m-%d<br/>%H:%M:%S',
          minute: '%Y-%m-%d<br/>%H:%M',
          hour: '%Y-%m-%d<br/>%H:%M',
          day: '%Y<br/>%m-%d',
          week: '%Y<br/>%m-%d',
          month: '%Y-%m',
          year: '%Y'
        },
        type: 'datetime',
        min: (this.props.opnames.lineChartSettings.userDefinedDaterange) ?
          moment(this.props.opnames.start_date, 'DD-MM-YYYY').valueOf() : undefined,
        max: (this.props.opnames.lineChartSettings.userDefinedDaterange) ?
          moment(this.props.opnames.end_date, 'DD-MM-YYYY').valueOf() : undefined,
        crosshair: true,
      }],
      yAxis: [{ // Primary yAxis
        min: (this.props.opnames.lineChartSettings.leftMin) ?
              this.props.opnames.lineChartSettings.leftMin : undefined,
        max: (this.props.opnames.lineChartSettings.leftMax) ?
              this.props.opnames.lineChartSettings.leftMax : undefined,
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        title: {
          text: (this.props.opnames.linechartsLeftY.length > 0) ?
            this.props.opnames.linechartsLeftY[0].unit : '',
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        plotLines: [{
          color: 'red',
          value: (this.props.opnames.lineChartSettings.treshold) ?
                  this.props.opnames.lineChartSettings.treshold : 0,
          width: (this.props.opnames.lineChartSettings.treshold) ? 2 : 0,
        }]
      }, { // Secondary yAxis
        title: {
          text: (this.props.opnames.linechartsRightY.length > 0) ?
            this.props.opnames.linechartsRightY[0].unit : '',
          style: {
            color: Highcharts.getOptions().colors[0],
          }
        },
        min: (this.props.opnames.lineChartSettings.rightMin) ?
              this.props.opnames.lineChartSettings.rightMin : undefined,
        max: (this.props.opnames.lineChartSettings.rightMax) ?
              this.props.opnames.lineChartSettings.rightMax : undefined,
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        opposite: true,
      }],
      tooltip: {
        shared: true,
      },
      plotOptions: {
        line: {
          marker: {
            enabled: (this.props.opnames.lineChartSettings.showSymbols) ? true : false,
          },
        },
      },
      series: combinedSeries,
    });
  }

  render() {
    return (
      <div
        ref='linechartContainer'
        style={{ width: '100%', height: 600 }}
        id='linechart-container'>
      </div>
    );
  }
}



class BoxplotChartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderChart = this.renderChart.bind(this);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart() {
    let boxplotCharts = this.props.opnames.boxplotCharts;
    let categories = [];
    let series = [];
    let currYear = '';

    for (let i = 1; i < this.props.opnames.boxplotCharts.length + 1; i++) {
      categories.push(`${boxplotCharts[i - 1].location}
        (${boxplotCharts[i-1].wns})
        ${this.props.opnames.start_date} - ${this.props.opnames.end_date}`);
      series.push([
          boxplotCharts[i-1].boxplot_data.min,
          boxplotCharts[i-1].boxplot_data.q1,
          boxplotCharts[i-1].boxplot_data.median,
          boxplotCharts[i-1].boxplot_data.q3,
          boxplotCharts[i-1].boxplot_data.max,
      ]);
    }

    Highcharts.chart(this.refs.boxplotchartContainer, {
      chart: {
          animation: false,
          type: 'boxplot',
      },
      title: {
          text: '',
      },
      legend: {
          enabled: false,
      },
      xAxis: {
          categories: categories,
          title: {
              text: 'Opnames',
          },
      },
      yAxis: {
          title: {
              text: '',
          },
      },
      series: [{
          animation: false,
          name: 'Opnames',
          data: series,
          tooltip: {
              headerFormat: '<em>{series.name}</em><br/>'
          },
      }],
    });
  }

  render() {
    return (
      <div
        ref='boxplotchartContainer'
        style={{width: '100%', height: 600}}
        id='boxplotchart-container'>
      </div>
    );
  }
}



class ScatterChartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderChart = this.renderChart.bind(this);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart() {
    const scatterData = this.props.opnames.scatterplotData;

    let data_formatted = [];
    if (scatterData && scatterData.points) {
      data_formatted = scatterData.points.map((point) => {
        return [point.x, point.y];
      });
    }

    Highcharts.chart(this.refs.scatterchartContainer, {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
      },
      title:{
        text: ''
      },
      xAxis: {
        title: {
          enabled: true,
          text: (scatterData) ?
                `${scatterData.x_location} (${scatterData.x_wns}` : '',
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
      },
      yAxis: {
        title: {
          text: (scatterData) ?
                `${scatterData.y_location} (${scatterData.y_wns}` : '',
        }
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)',
              },
            },
          },
          states: {
            hover: {
              marker: {
                enabled: false,
              }
            }
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x}, {point.y}',
          },
        }
      },
      series: [{
        name: (scatterData) ?
              `${scatterData.x_wns} vs. ${scatterData.y_wns}` : '',
        color: '#337AB7',
        data: data_formatted,
        animation: false,
      }],
    });
  }

  render() {
    return (
      <div
        ref='scatterchartContainer'
        style={{width: '100%', height: 600}}
        id='scatterchart-container'>
      </div>
    );
  }
}


class ChartApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      boxplotSeriesFilter: '',
      currentUnit: undefined,
      height: window.innerHeight,
      linechartSeriesLeftYFilter: '',
      linechartSeriesRightYFilter: '',
      scatterplotSeriesFilter: '',
      scatterplotSeriesYAxisFilter: '',
      showBoxplotModal: false,
      showLeftYAxisModal: false,
      showLinechartSettingsModal: false,
      showRightYAxisModal: false,
      showScatterplotModal: false,
      width: window.innerWidth,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.hideLeftYAxisModal = this.hideLeftYAxisModal.bind(this);
    this.hideRightYAxisModal = this.hideRightYAxisModal.bind(this);
    this.hideBoxplotModal = this.hideBoxplotModal.bind(this);
    this.hideScatterplotModal = this.hideScatterplotModal.bind(this);
    this.hideLinechartSettingsModal = this.hideLinechartSettingsModal.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  // }

  componentWillReceiveProps(newProps) {}

  hideLeftYAxisModal() {
    this.setState({ showLeftYAxisModal: false });
  }

  hideRightYAxisModal() {
    this.setState({ showRightYAxisModal: false });
  }

  hideBoxplotModal() {
    this.setState({ showBoxplotModal: false });
  }

  hideScatterplotModal() {
    this.setState({ showScatterplotModal: false });
  }

  hideLinechartSettingsModal() {
    this.setState({ showLinechartSettingsModal: false });
  }

  updateDimensions() {
    this.setState({
      width: document.getElementById('chart').offsetWidth - 20,
      height: document.getElementById('chart').offsetHeight,
    });
  }

  render() {

    let filteredScatterplotSeries = this.props.opnames.charts.filter((location) => {
      if (location.wns.toLowerCase().indexOf(this.state.scatterplotSeriesFilter.toLowerCase()) != -1 ||
          location.wns.toLowerCase().indexOf(this.state.scatterplotSeriesFilter.toLowerCase()) != -1) {
        return location;
      }
      else if (location.location.toLowerCase().indexOf(this.state.scatterplotSeriesFilter.toLowerCase()) != -1 ||
          location.location.toLowerCase().indexOf(this.state.scatterplotSeriesFilter.toLowerCase()) != -1) {
        return location;
      }
    });

    filteredScatterplotSeries = filteredScatterplotSeries.sort((a, b) => {
      if(a.wns < b.wns) {
        return -1;
      }
      if(a.wns > b.wns) {
        return 1;
      }
      return 0;
    });

    let filteredBoxplotSeries = this.props.opnames.charts.filter((location) => {
      if (location.wns.toLowerCase().indexOf(this.state.boxplotSeriesFilter.toLowerCase()) != -1 ||
          location.wns.toLowerCase().indexOf(this.state.boxplotSeriesFilter.toLowerCase()) != -1) {
        return location;
      }
      else if (location.location.toLowerCase().indexOf(this.state.boxplotSeriesFilter.toLowerCase()) != -1 ||
          location.location.toLowerCase().indexOf(this.state.boxplotSeriesFilter.toLowerCase()) != -1) {
        return location;
      }
    });

    filteredBoxplotSeries = filteredBoxplotSeries.sort((a, b) => {
      if(a.wns < b.wns) {
        return -1;
      }
      if(a.wns > b.wns) {
        return 1;
      }
      return 0;
    });



    let filteredLinechartSeriesLeftY = this.props.opnames.charts.filter((location) => {
      if (location.wns.toLowerCase().indexOf(this.state.linechartSeriesLeftYFilter.toLowerCase()) != -1 ||
          location.wns.toLowerCase().indexOf(this.state.linechartSeriesLeftYFilter.toLowerCase()) != -1) {
        return location;
      }
      else if (location.location.toLowerCase().indexOf(this.state.linechartSeriesLeftYFilter.toLowerCase()) != -1 ||
          location.location.toLowerCase().indexOf(this.state.linechartSeriesLeftYFilter.toLowerCase()) != -1) {
        return location;
      }
    });

    filteredLinechartSeriesLeftY = filteredLinechartSeriesLeftY.sort((a, b) => {
      if(a.wns < b.wns) {
        return -1;
      }
      if(a.wns > b.wns) {
        return 1;
      }
      return 0;
    });



    let filteredLinechartSeriesRightY = this.props.opnames.charts.filter((location) => {
      if (location.wns.toLowerCase().indexOf(this.state.linechartSeriesRightYFilter.toLowerCase()) != -1 ||
          location.wns.toLowerCase().indexOf(this.state.linechartSeriesRightYFilter.toLowerCase()) != -1) {
        return location;
      }
      else if (location.location.toLowerCase().indexOf(this.state.linechartSeriesRightYFilter.toLowerCase()) != -1 ||
          location.location.toLowerCase().indexOf(this.state.linechartSeriesRightYFilter.toLowerCase()) != -1) {
        return location;
      }
    });

    filteredLinechartSeriesRightY = filteredLinechartSeriesRightY.sort((a, b) => {
      if(a.wns < b.wns) {
        return -1;
      }
      if(a.wns > b.wns) {
        return 1;
      }
      return 0;
    });


    const secondAxisScatterplots = (this.props.opnames.secondScatterplotCharts.second_axis_lines) ?
      this.props.opnames.secondScatterplotCharts.second_axis_lines.filter((chart, i) => {
        if (chart.location.toLowerCase().indexOf(this.state.scatterplotSeriesYAxisFilter.toLowerCase()) !== -1 ||
            chart.wns.toLowerCase().indexOf(this.state.scatterplotSeriesYAxisFilter.toLowerCase()) !== -1) {
          return chart;
        }
    }) : [];

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
                <Button
                  bsSize='xsmall'
                  style={{ margin: 5 }}
                  onClick={() => this.setState({
                    showLinechartSettingsModal: true,
                  })}
                  className='pull-right'>
                  <i className='fa fa-area-chart'></i>&nbsp;Instellingen
                </Button>
                <LineChartComponent
                  {...this.props}
                  width={this.state.width}
                />
                <hr/>
                <div className='col-md-6'>
                  <Button onClick={() => {
                    this.setState({ currentUnit: undefined });
                    this.props.dispatch(fetchCharts());
                    this.setState({
                      showLeftYAxisModal: true,
                      linechartSeriesLeftYFilter: '',
                      linechartSeriesRightYFilter: '',
                      scatterplotSeriesFilter: '',
                      boxplotSeriesFilter: '',
                    });
                  }}>
                    <i className='fa fa-plus-circle'></i>
                  </Button>

                  <div style={{
                    position: 'absolute',
                    top: 50,
                    borderTop: '1px solid #ccc',
                    width: '90%',
                    padding: 10,
                    margin: '0 10px 0 0' }}>
                  {this.props.opnames.linechartsLeftY.map((linechart, i) => {
                    return (
                      <div key={i} style={{ marginTop: 5 }}>
                        <div className={styles.LinesList}>
                          <div style={{
                            overflowX: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            width: '80%',
                          }}>
                            {linechart.wns} - {linechart.location} ({linechart.unit})
                          </div>
                          <OverlayTrigger
                            trigger='click'
                            placement='top'
                            rootClose={true}
                            overlay={
                              <Popover id='filter-popover' title='Lijnstijl'>
                                <h4>Lijnkleur</h4>
                                <CompactPicker
                                  color={(linechart.lineColor) ?
                                    linechart.lineColor : '#fff'}
                                  onChangeComplete={(e) => this.props.dispatch(
                                    setLeftLineColorById({
                                      color: e.hex, id: linechart.id,
                                    })
                                  )} />
                                <h4>Lijnstijl</h4>
                                <ButtonGroup bsSize='small'>
                                  <Button
                                    active={(linechart.style === 1) ? true : false}
                                    onClick={() => {
                                      this.props.dispatch(
                                        setLeftLineStyleById({
                                          style: 1, id: linechart.id,
                                        })
                                      )
                                    }}>
                                    -
                                  </Button>
                                  <Button
                                    active={(linechart.style === 2) ? true : false}
                                    onClick={() => {
                                      this.props.dispatch(
                                        setLeftLineStyleById({
                                          style: 2, id: linechart.id,
                                        })
                                      )
                                    }}>
                                    -----
                                  </Button>
                                  <Button
                                    active={(linechart.style === 3) ? true : false}
                                    onClick={() => {
                                      this.props.dispatch(
                                        setLeftLineStyleById({
                                          style: 3, id: linechart.id,
                                        })
                                      )
                                    }}>
                                    - - - -
                                  </Button>
                                  <Button
                                    active={(linechart.style === 4) ? true : false}
                                    onClick={() => {
                                      this.props.dispatch(
                                        setLeftLineStyleById({
                                          style: 4, id: linechart.id,
                                        })
                                      )
                                    }}>
                                    -  -  -  -  -
                                  </Button>
                                </ButtonGroup>
                                <h4>Lijndikte</h4>
                                <ButtonGroup bsSize='xsmall'>
                                  <Button
                                    onClick={() => {
                                      this.props.dispatch(
                                        setLeftLineWidthById({
                                          width: 1, id: linechart.id,
                                        })
                                      )
                                    }}
                                    active={(linechart.lineWidth === 1) ? true : false}>1 punts
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      this.props.dispatch(
                                        setLeftLineWidthById({
                                          width: 2, id: linechart.id,
                                        })
                                      )
                                    }}
                                    active={(linechart.lineWidth === 2) ? true : false}>2 punts
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      this.props.dispatch(
                                        setLeftLineWidthById({
                                          width: 3, id: linechart.id,
                                        })
                                      )
                                    }}
                                    active={(linechart.lineWidth === 3) ? true : false}>3 punts
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      this.props.dispatch(
                                        setLeftLineWidthById({
                                          width: 4, id: linechart.id,
                                        })
                                      )
                                    }}
                                    active={(linechart.lineWidth === 4) ? true : false}>4 punts
                                  </Button>
                                </ButtonGroup>
                              </Popover>
                            }>
                            <span
                              style={{
                                backgroundColor: (linechart.lineColor) ?
                                linechart.lineColor : '#fff',
                              }}
                              className={`${styles.ColorPickerButton} pull-right`} />
                          </OverlayTrigger>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
                <div className='col-md-6'>
                  <Button
                    className='pull-right'
                    onClick={() => {
                      this.setState({ currentUnit: undefined });
                      this.props.dispatch(fetchCharts());
                      this.setState({
                        showRightYAxisModal: true,
                        linechartSeriesLeftYFilter: '',
                        linechartSeriesRightYFilter: '',
                        scatterplotSeriesFilter: '',
                        boxplotSeriesFilter: '',
                      });
                    }}>
                    <i className='fa fa-plus-circle'></i>
                  </Button>
                  <div style={{
                    position: 'absolute',
                    top: 50,
                    borderTop: '1px solid #ccc',
                    width: '90%',
                    padding: 10,
                    margin: '0 0 0 10px' }}>
                    {this.props.opnames.linechartsRightY.map((linechart, i) => {
                      return (
                        <div key={i} style={{ marginTop: 5 }}>
                          <div className={styles.LinesList}>
                            <div style={{
                              overflowX: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              width: '80%',
                            }}>
                              {linechart.wns} - {linechart.location} ({linechart.unit})
                            </div>
                            <OverlayTrigger
                              trigger='click'
                              placement='top'
                              rootClose={true}
                              overlay={
                                <Popover id='filter-popover' title='Lijnstijl'>
                                  <h4>Lijnkleur</h4>
                                  <CompactPicker
                                    color={(linechart.lineColor) ?
                                      linechart.lineColor : '#fff'}
                                    onChangeComplete={(e) => this.props.dispatch(
                                      setRightLineColorById({
                                        color: e.hex, id: linechart.id,
                                      })
                                    )} />
                                  <h4>Lijnstijl</h4>
                                  <ButtonGroup bsSize='small'>
                                    <Button
                                      active={(linechart.style === 1) ? true : false}
                                      onClick={() => {
                                        this.props.dispatch(
                                          setRightLineStyleById({
                                            style: 1, id: linechart.id,
                                          })
                                        )
                                      }}>
                                      -
                                    </Button>
                                    <Button
                                      active={(linechart.style === 2) ? true : false}
                                      onClick={() => {
                                        this.props.dispatch(
                                          setRightLineStyleById({
                                            style: 2, id: linechart.id,
                                          })
                                        )
                                      }}>
                                      -----
                                    </Button>
                                    <Button
                                      active={(linechart.style === 3) ? true : false}
                                      onClick={() => {
                                        this.props.dispatch(
                                          setRightLineStyleById({
                                            style: 3, id: linechart.id,
                                          })
                                        )
                                      }}>
                                      - - - -
                                    </Button>
                                    <Button
                                      active={(linechart.style === 4) ? true : false}
                                      onClick={() => {
                                        this.props.dispatch(
                                          setRightLineStyleById({
                                            style: 4, id: linechart.id,
                                          })
                                        )
                                      }}>
                                      -  -  -  -  -
                                    </Button>
                                  </ButtonGroup>
                                  <h4>Lijndikte</h4>
                                  <ButtonGroup bsSize='xsmall'>
                                    <Button
                                      onClick={() => {
                                        this.props.dispatch(
                                          setRightLineWidthById({
                                            width: 1, id: linechart.id,
                                          })
                                        )
                                      }}
                                      active={(linechart.lineWidth === 1) ? true : false}>1 punts
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        this.props.dispatch(
                                          setRightLineWidthById({
                                            width: 2, id: linechart.id,
                                          })
                                        )
                                      }}
                                      active={(linechart.lineWidth === 2) ? true : false}>2 punts
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        this.props.dispatch(
                                          setRightLineWidthById({
                                            width: 3, id: linechart.id,
                                          })
                                        )
                                      }}
                                      active={(linechart.lineWidth === 3) ? true : false}>3 punts
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        this.props.dispatch(
                                          setRightLineWidthById({
                                            width: 4, id: linechart.id,
                                          })
                                        )
                                      }}
                                      active={(linechart.lineWidth === 4) ? true : false}>4 punts
                                    </Button>
                                  </ButtonGroup>
                                </Popover>
                              }>
                              <div
                                style={{
                                  backgroundColor: (linechart.lineColor) ? linechart.lineColor : '#fff',
                                }}
                                className={`${styles.ColorPickerButton}`} />
                            </OverlayTrigger>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Tab>
              <Tab eventKey={2} title='Boxplot'>
                <Button bsSize='xsmall' className='pull-right'>
                  <i className='fa fa-deviantart'></i>&nbsp;Splitsen/samenvoegen
                </Button>
                <BoxplotChartComponent
                  {...this.props}
                  width={this.state.width} />
                  <hr/>
                  <div className='col-md-12'>
                    <Button onClick={() => {
                      this.setState({ currentUnit: undefined });
                      this.props.dispatch(fetchCharts());
                      this.setState({ showBoxplotModal: true });
                    }}>
                      <i className='fa fa-plus-circle'></i>
                    </Button>
                    <hr/>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Periode</th>
                          <th>Locatie code</th>
                          <th>Tijdreeks</th>
                          <th>Eenheid</th>
                          <th>Aantal</th>
                          <th>Min</th>
                          <th>Max</th>
                          <th>SD</th>
                          <th>Mediaan</th>
                          <th>Gemiddelde</th>
                          <th>Q1</th>
                          <th>Q3</th>
                          <th>P10</th>
                          <th>P90</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.opnames.boxplotCharts.map((s, i) => {
                          return (
                            <tr key={i}>
                              <td style={{width:'100px'}}>{this.props.opnames.start_date} - {this.props.opnames.end_date}</td>
                              <td style={{width:'100px'}}>{s.location_id}</td>
                              <td style={{width:'100px'}}>{s.location} ({s.wns})</td>
                              <td style={{width:'15px'}}>({s.unit})</td>
                              <td style={{width:'10px'}}>{s.boxplot_data.num_values}</td>
                              <td style={{width:'15px'}}>{s.boxplot_data.min.toFixed(2)}</td>
                              <td style={{width:'15px'}}>{s.boxplot_data.max.toFixed(2)}</td>
                              <td style={{width:'15px'}}>{s.boxplot_data.std.toFixed(2)}</td>
                              <td style={{width:'15px'}}>{s.boxplot_data.median.toFixed(2)}</td>
                              <td style={{width:'15px'}}>{s.boxplot_data.mean.toFixed(2)}</td>
                              <td style={{width:'15px'}}>{s.boxplot_data.q1.toFixed(2)}</td>
                              <td style={{width:'15px'}}>{s.boxplot_data.q3.toFixed(2)}</td>
                              <td style={{width:'15px'}}>{s.boxplot_data.p10.toFixed(2)}</td>
                              <td style={{width:'15px'}}>{s.boxplot_data.p90.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
              </Tab>
              <Tab eventKey={3} title='Scatterplot'>
                <ScatterChartComponent
                  {...this.props}
                  width={this.state.width} />
                  <hr/>
                  <div className='col-md-6'>
                    <Button onClick={() => {
                      this.setState({ currentUnit: undefined });
                      this.props.dispatch(fetchCharts());
                      this.setState({ showScatterplotModal: true });
                    }}>
                      <i className='fa fa-plus-circle'></i>
                    </Button>
                  </div>
              </Tab>
            </Tabs>
            </div>
          </div>
        </div>




        <Modal
          {...this.props}
          show={this.state.showScatterplotModal}
          dialogClassName={styles.WideModal}
          onHide={this.hideScatterplotModal}>
          <Modal.Header closeButton>
            <Modal.Title id='scatterplotModal'>
              Configureer Scatterplot
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className='row'>
          <div className='col-md-6'>
          <h4>X as</h4>
            <input
              type='text'
              ref='filterText'
              style={{ margin: 5 }}
              className='form-control'
              autoFocus='autofocus'
              placeholder='Filter tijdseries'
              onChange={(e) => this.setState({
                scatterplotSeriesFilter: e.target.value,
              })}
            />
            <ul style={{
              height: 600,
              overflowY: 'scroll',
            }}>
              {filteredScatterplotSeries.map((chart, i) => {
                return (
                  <li key={i}
                      onClick={() => {
                        if (this.state.currentUnit === chart.unit ||
                           !this.state.currentUnit) {
                          this.setState({
                            currentUnit: chart.unit,
                          });
                          this.props.dispatch(fetchSecondScatterplotAxis(chart));
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
          <h4>Y as</h4>
            <input
              type='text'
              ref='filterText'
              style={{ margin: 5 }}
              className='form-control'
              placeholder='Filter tijdseries'
              onChange={(e) => this.setState({
                scatterplotSeriesYAxisFilter: e.target.value,
              })}
            />
            {(this.props.opnames.isFetching) ?
              <div style={{
                position: 'absolute',
                left: 50,
                top: 200,
                zIndex: 9999,
              }}>
                <Wave size={50} />
              </div>
              :
              <ul style={{
                height: 600,
                overflowY: 'scroll',
              }}>
                {secondAxisScatterplots.map((chart, i) => {
                  return (
                    <li
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        this.props.dispatch(
                          fetchScatterplotDataByUrl(chart.url)
                        );
                      }}
                      key={i}>
                      {chart.wns} - {chart.location}
                    </li>
                  )
                })}
              </ul>
            }
          </div>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              this.hideScatterplotModal();
            }}>Toepassen</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          {...this.props}
          show={this.state.showBoxplotModal}
          dialogClassName={styles.WideModal}
          onHide={this.hideBoxplotModal}>
          <Modal.Header closeButton>
            <Modal.Title id='boxplotModal'>
              Configureer Boxplot
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className='row'>
          <div className='col-md-6'>
            <input
              type='text'
              ref='filterText'
              style={{ margin: 5 }}
              className='form-control'
              autoFocus='autofocus'
              placeholder='Filter tijdseries'
              onChange={(e) => this.setState({
                boxplotSeriesFilter: e.target.value,
              })}
            />
            <ul style={{
              height: 600,
              overflowY: 'scroll',
            }}>
              {filteredBoxplotSeries.map((chart, i) => {
                return (
                  <li key={i}
                      onClick={() => {
                        if (this.state.currentUnit === chart.unit ||
                           !this.state.currentUnit) {
                          this.setState({
                            currentUnit: chart.unit,
                          });
                          this.props.dispatch(addToBoxplotCharts(chart));
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
              {this.props.opnames.boxplotCharts.map((chart, i) => {
                return (
                  <li
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      this.props.dispatch(
                        removeFromBoxplotChartsById(chart.id)
                      );
                    }}
                    key={i}>
                    {chart.wns} - {chart.location}
                  </li>
                );
              })}
            </ul>
          </div>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              this.hideBoxplotModal();
            }}>Toepassen</Button>
          </Modal.Footer>
        </Modal>

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
            <input
              type='text'
              ref='filterText'
              style={{ margin: 5 }}
              className='form-control'
              autoFocus='autofocus'
              placeholder='Filter tijdseries'
              onChange={(e) => this.setState({
                linechartSeriesLeftYFilter: e.target.value,
              })}
            />
            <ul style={{
              height: 600,
              overflowY: 'scroll',
            }}>
              {filteredLinechartSeriesLeftY.map((chart, i) => {
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
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      this.props.dispatch(
                        removeFromLinechartsLeftYById(chart.id)
                      );
                    }}
                    key={i}>
                    {chart.wns} - {chart.location}
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
            <Modal.Title id='rightYAxisModal'>
              Configureer rechter Y-as
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className='row'>
          <div className='col-md-6'>
            <input
              type='text'
              ref='filterText'
              style={{ margin: 5 }}
              className='form-control'
              autoFocus='autofocus'
              placeholder='Filter tijdseries'
              onChange={(e) => this.setState({
                linechartSeriesRightYFilter: e.target.value,
              })}
            />
            <ul style={{
              height: 600,
              overflowY: 'scroll',
            }}>
              {filteredLinechartSeriesRightY.map((chart, i) => {
                return (
                  <li key={i}
                      onClick={() => {
                        if (this.state.currentUnit === chart.unit ||
                           !this.state.currentUnit) {
                          this.setState({
                            currentUnit: chart.unit,
                          });
                          this.props.dispatch(addToLinechartsRightY(chart));
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
              {this.props.opnames.linechartsRightY.map((chart, i) => {
                return (
                  <li
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      this.props.dispatch(
                        removeFromLinechartsRightYById(chart.id)
                      );
                    }}
                    key={i}>
                    {chart.wns} - {chart.location}
                  </li>
                );
              })}
            </ul>
          </div>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              this.hideRightYAxisModal();
            }}>Toepassen</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          {...this.props}
          show={this.state.showLinechartSettingsModal}
          dialogClassName={styles.WideModal}
          onHide={this.hideLinechartSettingsModal}>
          <Modal.Header closeButton>
            <Modal.Title id='linechart-settings-modal'>
              Configureer Lijngrafiek
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className='panel panel-default'>
                <div className='panel-body'>
                  <div className='input-group'>
                    <form>
                      <div className='form-group'>
                        <div className='checkbox'>
                          <label>
                          <input type='checkbox'
                                 onClick={() => this.props.dispatch(
                                   toggleUserDaterange()
                                 )}
                                 defaultChecked={this.props.opnames.lineChartSettings.userDefinedDaterange} />
                                 Gebruik periode uit selectie
                          </label>
                        </div>
                      </div>
                      <div className='form-group'>
                        <div className='checkbox'>
                          <label>
                          <input type='checkbox'
                                 onClick={() => this.props.dispatch(
                                   toggleSymbols()
                                 )}
                                 defaultChecked={this.props.opnames.lineChartSettings.showSymbols} />
                                 Toon symbolen
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className='panel panel-default'>
                <div className='panel-body'>
                  <div className='input-group'>
                    <label htmlFor='leftMin'>Minimumwaarde linker Y-as</label>
                    <input type='number'
                           onChange={(e) => this.props.dispatch(
                             setLeftAxisMinForLinechart(e.target.value)
                           )}
                           defaultValue={this.props.opnames.lineChartSettings.leftMin}
                           className='form-control'
                           id='leftMin' />
                  </div>
                  <div className='input-group'>
                    <label htmlFor='leftMax'>Maximumwaarde linker Y-as</label>
                    <input type='number'
                           onChange={(e) => this.props.dispatch(
                             setLeftAxisMaxForLinechart(e.target.value)
                           )}
                           defaultValue={this.props.opnames.lineChartSettings.leftMax}
                           className='form-control'
                           id='leftMax' />
                  </div>
                </div>
              </div>
              <div className='panel panel-default'>
                <div className='panel-body'>
                  <div className='input-group'>
                    <label htmlFor='rightMin'>Minimumwaarde rechter Y-as</label>
                    <input type='number'
                           onChange={(e) => this.props.dispatch(
                             setRightAxisMinForLinechart(e.target.value)
                           )}
                           defaultValue={this.props.opnames.lineChartSettings.rightMin}
                           className='form-control'
                           id='rightMin' />
                  </div>
                  <div className='input-group'>
                    <label htmlFor='rightMin'>Maximumwaarde rechter Y-as</label>
                    <input type='number'
                           onChange={(e) => this.props.dispatch(
                             setRightAxisMaxForLinechart(e.target.value)
                           )}
                           defaultValue={this.props.opnames.lineChartSettings.rightMax}
                           className='form-control'
                           id='rightMax' />
                  </div>
                </div>
              </div>
              <div className='panel panel-default'>
                <div className='panel-body'>
                  <div className='input-group'>
                    <label htmlFor='tresholdValue'>Waarde normlijn o.b.v. linker Y-as (punt als decimaalteken)</label>
                    <input type='text'
                           onChange={(e) => this.props.dispatch(
                             setTresholdForLinechart(e.target.value)
                           )}
                           defaultValue={this.props.opnames.lineChartSettings.treshold}
                           className='form-control'
                           id='tresholdValue' />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              this.hideLinechartSettingsModal();
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
