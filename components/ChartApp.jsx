// @flow
import { connect } from 'react-redux';
import $ from 'jquery';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import sharedStyles from './SharedStyles.css';
import { Wave } from 'better-react-spinkit';
import TopNav from './TopNav.jsx';
import styles from './ChartApp.css';
import Sidebar from './Sidebar.jsx';
import {Button, Modal, Tabs, Tab} from 'react-bootstrap';
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
  setTresholdForLinechart,
  setLeftAxisMinForLinechart,
  setLeftAxisMaxForLinechart,
  setRightAxisMinForLinechart,
  setRightAxisMaxForLinechart,
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

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  renderChart() {
    const dateTimes = this.props.opnames.linechartsLeftY.map((chart) => {
      return chart.data.map((data) => {
        return data.datetime;
      });
    });

    let flatDateTimes = _.flatten(dateTimes);

    const rightAxisDatetimes = this.props.opnames.linechartsRightY.map((chart) => {
      return chart.data.map((data) => {
        return data.datetime;
      });
    });

    flatDateTimes = _.concat(flatDateTimes, rightAxisDatetimes[0]);
    flatDateTimes = _.uniq(flatDateTimes);
    flatDateTimes.sort();

    const leftSeries = this.props.opnames.linechartsLeftY.map((linechart, i) => {
      return {
        animation: false,
        name: linechart.location,
        type: 'spline',
        data: linechart.data.map((d) => d.value),
        tooltip: {
          valueSuffix: ` (${linechart.unit})`,
        },
      };
    });

    const rightSeries = this.props.opnames.linechartsRightY.map((linechart, i) => {
      return {
        animation: false,
        name: linechart.location,
        type: 'spline',
        yAxis: 1,
        data: linechart.data.map((d) => d.value),
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
        categories: flatDateTimes.map((fd) => moment(fd).locale('nl').format('L')),
        crosshair: true,
      }],
      yAxis: [{ // Primary yAxis
        min: (this.props.opnames.lineChartSettings.leftMin) ? this.props.opnames.lineChartSettings.leftMin : undefined,
        max: (this.props.opnames.lineChartSettings.leftMax) ? this.props.opnames.lineChartSettings.leftMax : undefined,
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        title: {
          text: '',
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        plotLines: [{
          color: 'red',
          value: (this.props.opnames.lineChartSettings.treshold) ? this.props.opnames.lineChartSettings.treshold : 0,
          width: (this.props.opnames.lineChartSettings.treshold) ? 2 : 0,
        }]
      }, { // Secondary yAxis
        title: {
          text: '',
          style: {
            color: Highcharts.getOptions().colors[0],
          }
        },
        min: (this.props.opnames.lineChartSettings.rightMin) ? this.props.opnames.lineChartSettings.rightMin : undefined,
        max: (this.props.opnames.lineChartSettings.rightMax) ? this.props.opnames.lineChartSettings.rightMax : undefined,
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
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor: (
          Highcharts.theme &&
          Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
      },
      series: combinedSeries,
    });
  }

  render() {
    return (
      <div
        ref='linechartContainer'
        style={{width: '100%', height: 600}}
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
      categories.push(boxplotCharts[i - 1].location + ' (' + boxplotCharts[i-1].wns + ') ' +
                      boxplotCharts[i - 1].start_date + " - " + boxplotCharts[i-1].end_date);
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
          text: (scatterData) ? `${scatterData.x_location} (${scatterData.x_wns}` : '',
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
      },
      yAxis: {
        title: {
          text: (scatterData) ? `${scatterData.y_location} (${scatterData.y_wns}` : '',
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
        name: (scatterData) ? `${scatterData.x_wns} vs. ${scatterData.y_wns}` : '',
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
      width: window.innerWidth,
      height: window.innerHeight,
      showLeftYAxisModal: false,
      showRightYAxisModal: false,
      showLinechartSettingsModal: false,
      showBoxplotModal: false,
      showScatterplotModal: false,
      currentUnit: undefined,
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
                    showLinechartSettingsModal: true
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
                    this.setState({ showLeftYAxisModal: true });
                  }}>
                    <i className='fa fa-plus-circle'></i>
                  </Button>
                </div>
                <div className='col-md-6'>
                  <Button
                    className='pull-right'
                    onClick={() => {
                      this.setState({ currentUnit: undefined });
                      this.props.dispatch(fetchCharts());
                      this.setState({ showRightYAxisModal: true });
                    }}>
                    <i className='fa fa-plus-circle'></i>
                  </Button>
                </div>
              </Tab>
              <Tab eventKey={2} title='Boxplot'>
                <BoxplotChartComponent
                  {...this.props}
                  width={this.state.width} />
                  <hr/>
                  <div className='col-md-6'>
                    <Button onClick={() => {
                      this.setState({ currentUnit: undefined });
                      this.props.dispatch(fetchCharts());
                      this.setState({ showBoxplotModal: true });
                    }}>
                      <i className='fa fa-plus-circle'></i>
                    </Button>
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
                {(this.props.opnames.secondScatterplotCharts.second_axis_lines) ?
                  this.props.opnames.secondScatterplotCharts.second_axis_lines.map((chart, i) => {
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
                  );
                }) : ''}
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
                    <label htmlFor='tresholdValue'>Waarde normlijn o.b.v. linker Y-as</label>
                    <input type='number'
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
