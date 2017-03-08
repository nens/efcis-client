import $ from 'jquery';
import moment from 'moment';
import styles from './ScatterChartComponent.css';
import React, { Component, PropTypes } from 'react';
import { CompactPicker } from 'react-color';
import { Wave } from 'better-react-spinkit';
import { ButtonGroup, Button, Modal, Tabs, Tab, Table, OverlayTrigger, Popover } from 'react-bootstrap';
import _ from 'lodash';

import {
  addToBoxplotCharts,
  addToLinechartsLeftY,
  addToLinechartsRightY,
  fetchCharts,
  fetchScatterplotDataByUrl,
  fetchSecondScatterplotAxis,
  reloadDataForBoxplots,
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
  setTitleForTijdreeks,
  setTitleForBoxplot,
  setTitleForScatterplot,
  setLeftAxisMinForLinechart,
  setRightAxisMaxForLinechart,
  setRightAxisMinForLinechart,
  setTresholdForLinechart,
  setSplitByYear,
  toggleUserDaterange,
  toggleSymbols,
} from '../../actions.jsx';


class ScatterChartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scatterplotSeriesFilter: '',
      scatterplotSeriesYAxisFilter: '',
      showScatterplotModal: false,
    };
    this.renderChart = this.renderChart.bind(this);
    this.hideScatterplotModal = this.hideScatterplotModal.bind(this);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }


  hideScatterplotModal() {
    this.setState({ showScatterplotModal: false });
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
      title: {
        text: '',
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
        },
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
              },
            },
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x}, {point.y}',
          },
        },
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

    const { dispatch, opnames } = this.props;

    let filteredScatterplotSeries = opnames.charts.filter((location) => {
      if (location.wns.toLowerCase().indexOf(this.state.scatterplotSeriesFilter.toLowerCase()) !== -1 ||
          location.wns.toLowerCase().indexOf(this.state.scatterplotSeriesFilter.toLowerCase()) !== -1) {
        return location;
      }
      else if (location.location.toLowerCase().indexOf(this.state.scatterplotSeriesFilter.toLowerCase()) !== -1 ||
          location.location.toLowerCase().indexOf(this.state.scatterplotSeriesFilter.toLowerCase()) !== -1) {
        return location;
      }
    });

    filteredScatterplotSeries = filteredScatterplotSeries.sort((a, b) => {
      if (a.wns < b.wns) {
        return -1;
      }
      if (a.wns > b.wns) {
        return 1;
      }
      return 0;
    });

    const secondAxisScatterplots = (opnames.secondScatterplotCharts.second_axis_lines) ?
      opnames.secondScatterplotCharts.second_axis_lines.filter((chart, i) => {
        if (chart.location.toLowerCase().indexOf(this.state.scatterplotSeriesYAxisFilter.toLowerCase()) !== -1 ||
            chart.wns.toLowerCase().indexOf(this.state.scatterplotSeriesYAxisFilter.toLowerCase()) !== -1) {
          return chart;
        }
      }) : [];

    return (
      <div>
        <input
          onChange={(e) => dispatch(setTitleForScatterplot(e.target.value))}
          defaultValue={opnames.scatterplotTitle}
          style={{
            width: '100%',
            fontSize: 22,
            fontWeight: 'bold',
            padding: 10,
            border: 'none',
            margin: '10px 0 10px 0',
          }}
        />
        <div
          ref='scatterchartContainer'
          style={{ width: '100%', height: 600 }}
          id='scatterchart-container' />
        <hr/>
        <div className='col-md-6'>
          <Button onClick={() => {
            this.setState({ currentUnit: undefined });
            this.setState({ showScatterplotModal: true }, () => {
              dispatch(fetchCharts());
            });
          }}>
            <i className='fa fa-plus-circle' />
          </Button>
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
                            dispatch(fetchSecondScatterplotAxis(chart));
                          }
                        }}
                        style={{
                          textDecoration: (
                          opnames.secondScatterplotCharts.id &&
                          chart.id === opnames.secondScatterplotCharts.id) ? 'underline' : '',
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
                {(opnames.isFetching) ?
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
                          style={{
                            cursor: 'pointer',
                            textDecoration: (opnames.scatterplotData) ?
                            (chart.id === opnames.scatterplotData.y_id) ? 'underline' : '' : '',
                          }}
                          onClick={() => {
                            dispatch(
                              fetchScatterplotDataByUrl(chart.url)
                            );
                          }}
                          key={i}>
                          {chart.wns} - {chart.location}
                        </li>
                      );
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
      </div>
    );
  }
}


ScatterChartComponent.propTypes = {
  dispatch: PropTypes.func,
  opnames: PropTypes.object,
};

export default ScatterChartComponent;
