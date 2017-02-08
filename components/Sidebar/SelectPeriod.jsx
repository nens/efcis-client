// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Button } from 'react-bootstrap';
import _ from 'lodash';
require('!style!css!../../node_modules/bootstrap-daterangepicker/daterangepicker.css');

const dateFormat = 'DD-MM-YYYY';

import {
  fetchFeatures,
  fetchOpnames,
  setPeriod,
  setSeason,
} from '../../actions.jsx';

class SelectPeriod extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ranges: {
        'Vandaag': [
          moment(),
          moment(),
        ],
        'Gisteren': [
          moment().subtract(1, 'days'),
          moment().subtract(1, 'days'),
        ],
        'Laatste 7 dagen': [
          moment().subtract(6, 'days'),
          moment(),
        ],
        'Laatste 30 dagen': [
          moment().subtract(29, 'days'),
          moment(),
        ],
        'Deze maand': [
          moment().startOf('month'),
          moment().endOf('month'),
        ],
        'Vorige maand': [
          moment().subtract(1, 'month').startOf('month'),
          moment().subtract(1, 'month').endOf('month'),
        ],
      },
      locale: {
        daysOfWeek: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
        format: dateFormat,
        applyLabel: 'Toepassen',
        cancelLabel: 'Annuleren',
        fromLabel: 'Van',
        toLabel: 'Tot',
        customRangeLabel: 'Anders',
        monthNames: [
          'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli',
          'Augustus', 'September', 'Oktober', 'November', 'December',
        ],
        firstDay: 1,
      },
    };
    this.applyDateRange = this.applyDateRange.bind(this);
    this.handleSeasonChange = this.handleSeasonChange.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  applyDateRange(event, picker) {
    this.props.dispatch(setPeriod(
      picker.startDate.format(dateFormat),
      picker.endDate.format(dateFormat)
    ));
    this.props.dispatch(fetchFeatures());
    this.props.dispatch(fetchOpnames());
  }

  handleSeasonChange() {
    const season = this.refs.season.value;
    this.props.dispatch(setSeason(season));
    this.props.dispatch(fetchFeatures());
    this.props.dispatch(fetchOpnames());
  }

  render() {
    const start = this.props.opnames.start_date;
    const end = this.props.opnames.end_date;
    let label = `${start} - ${end}`;
    if (start === end) {
        label = start;
    }

    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>
            <i className='fa fa-clock-o'></i>&nbsp;<strong>Periode</strong>
          </h3>
        </div>
        <div className='panel-body'>
        <DateRangePicker
          locale={this.state.locale}
          startDate={moment(this.props.opnames.start_date, dateFormat)}
          endDate={moment(this.props.opnames.end_date, dateFormat)}
          ranges={this.state.ranges}
          onApply={this.applyDateRange}>
          <Button className='selected-date-range-btn' style={{width:'100%'}}>
            <div className='pull-left'><i className='fa fa-calendar'></i></div>
              <div style={{overflow: 'hidden', 'whiteSpace': 'initial'}}>
                {label}&nbsp;
              <div className='pull-right'>
                <span className='caret'/>
              </div>
            </div>
          </Button>
        </DateRangePicker>

      <br/>Seizoen<br/>
        <div className='input-group'>
          <select
            ref='season'
            value={this.props.opnames.season}
            className='form-control'
            id='season'
            onChange={this.handleSeasonChange}>
            <option value=''>Alle maanden</option>
            <option value='summer'>April – September</option>
            <option value='winter'>Oktober - Maart</option>
          </select>
        </div>
      </div>
    </div>
    );
  }
}

SelectPeriod.propTypes = {};

export default SelectPeriod;
