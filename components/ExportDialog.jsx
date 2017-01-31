import React, { Component, PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';
import $ from 'jquery';
import _ from 'lodash';
import swal from 'sweetalert';
require("!style!css!../node_modules/sweetalert/lib/sweet-alert.css");

import {
  getSelectionObject,
} from '../actions.jsx';


class ExportDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      exportFormats: [],
    };
    this.handleExportClick = this.handleExportClick.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.getSelectionParams = this.getSelectionParams.bind(this);
  }

  componentDidMount() {
    $.getJSON(config.exportFormatsUrl, (data) => {
      this.setState({
        exportFormats: data,
      });
    });
  }

  getCookie(cName) {
    if (document.cookie.length > 0) {
      let cStart = document.cookie.indexOf(cName + '=');
      if (cStart !== -1) {
        cStart = cStart + cName.length + 1;
        let cEnd = document.cookie.indexOf(';', cStart);
        if (cEnd === -1) {
          cEnd = document.cookie.length;
        }
        return unescape(document.cookie.substring(cStart, cEnd));
      }
    }
    return '';
  }

  handleExportClick(format) {
    const self = this;
    $.ajaxSetup({
      headers: { 'X-CSRFToken': self.getCookie('csrftoken') }
    });
    $.ajax({
      method: 'POST',
      url: format.url,
      data: self.getSelectionParams(),
    })
    .done(function(msg) {
      swal(
        'Exporteren is gestart',
        `U ontvangt een e-mail (adres: ${msg.email}) met een downloadlink als de export gereed is. Deze link blijft geldig tot middernacht.`,
        'success'
      );
    });
  }

  getSelectionParams() {
    const filtersObject = this.props.opnames.filters;
    const meetnetids = this.props.opnames.meetnets;
    const parametergroupids = this.props.opnames.parametergroups;
    const locationids = this.props.opnames.locationIds;
    const start_date = this.props.opnames.start_date;
    const end_date = this.props.opnames.end_date;
    const season = this.props.opnames.season;
    const color_by = this.props.opnames.color_by;
    const dataObject = {
      meetnets: meetnetids.join(','),
      locations: locationids.join(','),
      start_date,
      end_date,
      season,
      color_by,
    };
    return _.merge(dataObject, filtersObject);
  }

  render() {
    const self = this;
    const selectionParams = this.getSelectionParams();

    return (
      <div>
      <table className='table table-striped table-bordered table-condensed'>
        <tbody>
          {
            this.state.exportFormats.map((format, i) => {
              let cookie = self.getCookie('csrftoken');
              let exportButton;
              if(format.url.toLowerCase().indexOf('xml') > -1) {
                exportButton = (
                  <form method='post' action={`${format.url}?${$.param(selectionParams)}`}>
                    <input type='hidden' name='csrfmiddlewaretoken' id='csrftoken' value={cookie} />
                    <input type='submit' className='pull-right btn btn-xs btn-default' value='Exporteer' />
                  </form>
                );
              } else {
                exportButton = (
                  <button
                    onClick={() => self.handleExportClick(format)}
                    className='pull-right btn btn-xs btn-default'>Exporteer</button>
                );
              }

              return (
                <tr key={i}>
                  <td>
                    {format.name}
                  </td>
                  <td>
                    {exportButton}
                  </td>
                </tr>
              );
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}


ExportDialog.propTypes = {};

module.exports = ExportDialog;
