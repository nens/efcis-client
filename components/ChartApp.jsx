  // @flow
  import { connect } from 'react-redux';

  import React, { Component, PropTypes } from 'react';
  import { Tabs, Tab } from 'react-bootstrap';
  import sharedStyles from './SharedStyles.css';

  import TopNav from './TopNav.jsx';
  import styles from './ChartApp.css';
  import Sidebar from './Sidebar.jsx';

  import ScatterChartComponent from './Charts/ScatterChartComponent.jsx';
  import BoxplotChartComponent from './Charts/BoxplotChartComponent.jsx';
  import LineChartComponent from './Charts/LineChartComponent.jsx';



  class ChartApp extends Component {

    constructor(props) {
      super(props);
      this.state = {
        height: window.innerHeight,
        width: window.innerWidth,
      };
      this.updateDimensions = this.updateDimensions.bind(this);
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
                    <LineChartComponent
                      {...this.props}
                      height={this.state.height}
                      width={this.state.width}
                    />
                  </Tab>
                  <Tab eventKey={2} title='Boxplot'>
                    <BoxplotChartComponent
                      {...this.props}
                      height={this.state.height}
                      width={this.state.width}
                    />
                  </Tab>
                  <Tab eventKey={3} title='Scatterplot'>
                    <ScatterChartComponent
                      {...this.props}
                      height={this.state.height}
                      width={this.state.width} />
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
    return {
      'opnames': state.opnames,
    };
  }

  export default connect(mapStateToProps)(ChartApp);
