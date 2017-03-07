import $ from 'jquery';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import styles from './BoxplotChartComponent.css';
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



class BoxplotChartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boxplotSeriesFilter: '',
      showBoxplotModal: false,

    };
    this.renderChart = this.renderChart.bind(this);
    this.hideBoxplotModal = this.hideBoxplotModal.bind(this);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  hideBoxplotModal() {
    this.setState({ showBoxplotModal: false });
  }


  renderChart() {
    let boxplotCharts = this.props.opnames.boxplotCharts;
    let categories = [];
    let series = [];
    let currYear = '';
    for (let i = 0; i < this.props.opnames.boxplotCharts.length; i++) {
      for (let j = 0; j < this.props.opnames.boxplotCharts[i].length; j++) {
	let bD = this.props.opnames.boxplotCharts[i][j]
	categories.push(`${bD.location}
        (${bD.wns})
        ${bD.start_date} - ${bD.end_date}`);
	series.push([
          bD.boxplot_data.min,
          bD.boxplot_data.q1,
          bD.boxplot_data.median,
          bD.boxplot_data.q3,
          bD.boxplot_data.max,
	]);
      }
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


    return (
      <div>

      <input
        onChange={(e) => this.props.dispatch(setTitleForBoxplot(e.target.value))}
        defaultValue={this.props.opnames.boxplotTitle}
        style={{
          width: '100%',
          fontSize: 22,
          fontWeight: 'bold',
          padding: 10,
          border: 'none',
          margin: '10px 0 10px 0',
        }}
      />
      <Button bsSize='xsmall' className='pull-right'  onClick={() => {
        this.props.dispatch(setSplitByYear(!this.props.opnames.split_by_year));
        this.props.dispatch(reloadDataForBoxplots());
      }}>
        <i className='fa fa-deviantart'></i>&nbsp;Splitsen/samenvoegen
      </Button>

        <div
          ref='boxplotchartContainer'
          style={{width: '100%', height: 600}}
          id='boxplotchart-container'>
        </div>

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
              { this.props.opnames.boxplotCharts.map(function(d, i){
      return d.map(function(s, j) {
                    return (
                      <tr key={100*i+j}>
                        <td style={{width:'100px'}}>{s.start_date} - {s.end_date}</td>
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
                    )}
      )}
                )}
            </tbody>
          </Table>
        </div>

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
		if (chart.length <= 0) { return; }
                return (
                  <li
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      this.props.dispatch(
                        removeFromBoxplotChartsById(chart[0].id)
                      );
                    }}
                    key={i}>
                    {chart[0].wns} - {chart[0].location}
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

      </div>
    );
  }
}


BoxplotChartComponent.propTypes = {};

export default BoxplotChartComponent;
