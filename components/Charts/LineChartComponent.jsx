import $ from 'jquery';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import styles from './LineChartComponent.css';
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


class LineChartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUnit: undefined,
      height: window.innerHeight,
      linechartSeriesLeftYFilter: '',
      linechartSeriesRightYFilter: '',
      showLeftYAxisModal: false,
      showLinechartSettingsModal: false,
      showRightYAxisModal: false,
      width: window.innerWidth,
    };
    this.renderChart = this.renderChart.bind(this);
    this.hideLinechartSettingsModal = this.hideLinechartSettingsModal.bind(this);
    this.hideLeftYAxisModal = this.hideLeftYAxisModal.bind(this);
    this.hideRightYAxisModal = this.hideRightYAxisModal.bind(this);
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


  hideLeftYAxisModal() {
    this.setState({ showLeftYAxisModal: false });
  }

  hideRightYAxisModal() {
    this.setState({ showRightYAxisModal: false });
  }


  hideLinechartSettingsModal() {
    this.setState({ showLinechartSettingsModal: false });
  }


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
        name: `${linechart.location} (${linechart.wns})`,
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
        name: `${linechart.location} (${linechart.wns})`,
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
          color: '#5A5859',
          value: (this.props.opnames.lineChartSettings.treshold) ?
                  this.props.opnames.lineChartSettings.treshold : 0,
          width: (this.props.opnames.lineChartSettings.treshold) ? 2 : 0,
        }]
      }, { // Secondary yAxis
        title: {
          text: (this.props.opnames.linechartsRightY.length > 0) ?
            this.props.opnames.linechartsRightY[0].unit : '',
          style: {
            color: Highcharts.getOptions().colors[1],
          }
        },
        min: (this.props.opnames.lineChartSettings.rightMin) ?
              this.props.opnames.lineChartSettings.rightMin : undefined,
        max: (this.props.opnames.lineChartSettings.rightMax) ?
              this.props.opnames.lineChartSettings.rightMax : undefined,
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[1],
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

    return (
      <div>
        <input
          onChange={(e) => this.props.dispatch(setTitleForTijdreeks(e.target.value))}
          defaultValue={this.props.opnames.tijdreeksTitle}
          style={{
            width: '100%',
            fontSize: 22,
            fontWeight: 'bold',
            padding: 10,
            border: 'none',
            margin: '10px 0 10px 0',
          }}
        />
        <Button
          bsSize='xsmall'
          style={{ margin: 5 }}
          onClick={() => this.setState({
            showLinechartSettingsModal: true,
          })}
          className='pull-right'>
          <i className='fa fa-area-chart'></i>&nbsp;Instellingen
        </Button>

        <div
          ref='linechartContainer'
          style={{ width: '100%', height: 600 }}
          id='linechart-container'>
        </div>

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
                          style={{
                            width: 250,
                          }}
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



        <Modal
          {...this.props}
          show={this.state.showLeftYAxisModal}
          dialogClassName={styles.WideModal}
          onHide={this.hideLeftYAxisModal}>
          <Modal.Header>
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
          <Modal.Header>
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
          <Modal.Header>
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
                    <input type='text'
                           onChange={(e) => this.props.dispatch(
                             setLeftAxisMinForLinechart(e.target.value)
                           )}
                           defaultValue={this.props.opnames.lineChartSettings.leftMin}
                           className='form-control'
                           id='leftMin' />
                  </div>
                  <div className='input-group'>
                    <label htmlFor='leftMax'>Maximumwaarde linker Y-as</label>
                    <input type='text'
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
                    <input type='text'
                           onChange={(e) => this.props.dispatch(
                             setRightAxisMinForLinechart(e.target.value)
                           )}
                           defaultValue={this.props.opnames.lineChartSettings.rightMin}
                           className='form-control'
                           id='rightMin' />
                  </div>
                  <div className='input-group'>
                    <label htmlFor='rightMin'>Maximumwaarde rechter Y-as</label>
                    <input type='text'
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


LineChartComponent.propTypes = {};

export default LineChartComponent;
