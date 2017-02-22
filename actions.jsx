/* globals Promise:true */
import $ from 'jquery';
import _ from 'lodash';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

export const ADD_LOCATION_TO_SELECTION = 'ADD_LOCATION_TO_SELECTION';
export const ADD_PARAMETER_TO_SELECTION = 'ADD_PARAMETER_TO_SELECTION';
export const APPLY_FILTER = 'APPLY_FILTER';
export const APPLY_SORTING = 'APPLY_SORTING';
export const CLEAR_LOCATIONS_SELECTION = 'CLEAR_LOCATIONS_SELECTION';
export const CLEAR_PARAMETERS_SELECTION = 'CLEAR_PARAMETERS_SELECTION';
export const RECEIVE_CHARTS = 'RECEIVE_CHARTS';
export const RECEIVE_DATA_FOR_BOXPLOT = 'RECEIVE_DATA_FOR_BOXPLOT';
export const RECEIVE_DATA_FOR_LEFT_Y = 'RECEIVE_DATA_FOR_LEFT_Y';
export const RECEIVE_DATA_FOR_RIGHT_Y = 'RECEIVE_DATA_FOR_RIGHT_Y';
export const RECEIVE_DATA_FOR_SCATTERPLOT = 'RECEIVE_DATA_FOR_SCATTERPLOT';
export const REQUEST_DATA_FOR_SELECTED_BOXPLOTS = 'REQUEST_DATA_FOR_SELECTED_BOXPLOTS';
export const RECEIVE_DATA_FOR_SELECTED_BOXPLOTS = 'RECEIVE_DATA_FOR_SELECTED_BOXPLOTS';
export const RECEIVE_FEATURES = 'RECEIVE_FEATURES';
export const RECEIVE_OPNAMES = 'RECEIVE_OPNAMES';
export const RECEIVE_SCATTERPLOT_DATA = 'RECEIVE_SCATTERPLOT_DATA';
export const RECEIVE_SECOND_SCATTERPLOT_AXIS = 'RECEIVE_SECOND_SCATTERPLOT_AXIS';
export const REMOVE_FROM_BOXPLOTCHARTS_BY_ID = 'REMOVE_FROM_BOXPLOTCHARTS_BY_ID';
export const REMOVE_FROM_LINECHARTS_LEFT_Y_BY_ID = 'REMOVE_FROM_LINECHARTS_LEFT_Y_BY_ID';
export const REMOVE_FROM_LINECHARTS_RIGHT_Y_BY_ID = 'REMOVE_FROM_LINECHARTS_RIGHT_Y_BY_ID';
export const REMOVE_FROM_SCATTERPLOTCHARTS_BY_ID = 'REMOVE_FROM_SCATTERPLOTCHARTS_BY_ID';
export const REMOVE_LOCATION_FROM_SELECTION = 'REMOVE_LOCATION_FROM_SELECTION';
export const REMOVE_PARAMETER_FROM_SELECTION = 'REMOVE_PARAMETER_FROM_SELECTION';
export const REQUEST_CHARTS = 'REQUEST_CHARTS';
export const REQUEST_DATA_FOR_BOXPLOT = 'REQUEST_DATA_FOR_BOXPLOT';
export const REQUEST_DATA_FOR_LEFT_Y = 'REQUEST_DATA_FOR_LEFT_Y';
export const REQUEST_DATA_FOR_RIGHT_Y = 'REQUEST_DATA_FOR_RIGHT_Y';
export const REQUEST_DATA_FOR_SCATTERPLOT = 'REQUEST_DATA_FOR_SCATTERPLOT';
export const REQUEST_FEATURES = 'REQUEST_FEATURES';
export const REQUEST_OPNAMES = 'REQUEST_OPNAMES';
export const REQUEST_SCATTERPLOT_DATA = 'REQUEST_SCATTERPLOT_DATA';
export const REQUEST_SECOND_SCATTERPLOT_AXIS = 'REQUEST_SECOND_SCATTERPLOT_AXIS';
export const RESET_ALL_FILTERS = 'RESET_ALL_FILTERS';
export const SET_LEFT_LINEWIDTH_BY_ID = 'SET_LEFT_LINEWIDTH_BY_ID';
export const SET_RIGHT_LINEWIDTH_BY_ID = 'SET_RIGHT_LINEWIDTH_BY_ID';
export const SET_AS_SCATTERPLOTCHARTS_X = 'SET_AS_SCATTERPLOTCHARTS_X';
export const SET_AS_SCATTERPLOTCHARTS_Y = 'SET_AS_SCATTERPLOTCHARTS_Y';
export const SET_COLOR_BY = 'SET_COLOR_BY';
export const SET_LEGEND_MIN = 'SET_LEGEND_MIN';
export const SET_LEGEND_MAX = 'SET_LEGEND_MAX';
export const SET_LEFT_LINECOLOR_BY_ID = 'SET_LEFT_LINECOLOR_BY_ID';
export const SET_LEFT_LINESTYLE_BY_ID = 'SET_LEFT_LINESTYLE_BY_ID';
export const SET_RIGHT_LINECOLOR_BY_ID = 'SET_RIGHT_LINECOLOR_BY_ID';
export const SET_RIGHT_LINESTYLE_BY_ID = 'SET_RIGHT_LINESTYLE_BY_ID';
export const SET_LOCATIONS = 'SET_LOCATIONS';
export const SET_MAP_POSITION = 'SET_MAP_POSITION';
export const SET_MAP_STATISTICS = 'SET_MAP_STATISTICS';
export const SET_MEETNETS = 'SET_MEETNETS';
export const SET_LEGEND_INTERVALS = 'SET_LEGEND_INTERVALS';
export const SET_PARAMETERGROUPS = 'SET_PARAMETERGROUPS';
export const SET_PARAMETERS = 'SET_PARAMETERS';
export const SET_PERIOD = 'SET_PERIOD';
export const SET_SEASON = 'SET_SEASON';
export const SET_SPLIT_BY_YEAR = 'SET_SPLIT_BY_YEAR';
export const SET_TITLE_FOR_TIJDREEKS = 'SET_TITLE_FOR_TIJDREEKS';
export const SET_TITLE_FOR_BOXPLOT = 'SET_TITLE_FOR_BOXPLOT';
export const SET_TITLE_FOR_SCATTERPLOT = 'SET_TITLE_FOR_SCATTERPLOT';
export const SET_TRESHOLD_FOR_LINECHART = 'SET_TRESHOLD_FOR_LINECHART';
export const SET_LEFT_AXIS_MIN_FOR_LINECHART = 'SET_LEFT_AXIS_MIN_FOR_LINECHART';
export const SET_LEFT_AXIS_MAX_FOR_LINECHART = 'SET_LEFT_AXIS_MAX_FOR_LINECHART';
export const SET_RIGHT_AXIS_MIN_FOR_LINECHART = 'SET_RIGHT_AXIS_MIN_FOR_LINECHART';
export const SET_RIGHT_AXIS_MAX_FOR_LINECHART = 'SET_RIGHT_AXIS_MAX_FOR_LINECHART';
export const TOGGLE_REVERSE_LEGEND = 'TOGGLE_REVERSE_LEGEND';
export const TOGGLE_USER_DATERANGE = 'TOGGLE_USER_DATERANGE';
export const TOGGLE_SYMBOLS = 'TOGGLE_SYMBOLS';
export const USE_DATA_DOMAIN = 'USE_DATA_DOMAIN';

// The following makes sure that the XHR POST requests in this file get a
// CRSFToken header with the contents of the crsftoken cookie that's set by
// Django in production. It's doesn't affect the requests in development mode.

function getCookie(cName) {
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

$.ajaxSetup({
  headers: { 'X-CSRFToken': getCookie('csrftoken') }
});

// End of XHR Header setup



export function setMapPosition(object) {
  return {
    type: SET_MAP_POSITION,
    object,
  };
}

export function setMapStatistics(statisticsType) {
  return {
    type: SET_MAP_STATISTICS,
    statisticsType,
  };
}

export function resetAllFilters() {
  return {
    type: RESET_ALL_FILTERS,
  };
}

export function setSeason(season) {
  return {
    type: SET_SEASON,
    season,
  };
}

export function setPeriod(startDate, endDate) {
  return {
    type: SET_PERIOD,
    startDate,
    endDate,
  };
}

export function clearLocationsSelection() {
  return {
    type: CLEAR_LOCATIONS_SELECTION,
  };
}

export function clearParametersSelection() {
  return {
    type: CLEAR_PARAMETERS_SELECTION,
  };
}
export function removeLocationFromSelection(id) {
  return {
    type: REMOVE_LOCATION_FROM_SELECTION,
    id,
  };
}

export function removeParameterFromSelection(id) {
  return {
    type: REMOVE_PARAMETER_FROM_SELECTION,
    id,
  };
}

export function addLocationToSelection(locationObject) {
  return {
    type: ADD_LOCATION_TO_SELECTION,
    locationObject,
  };
}

export function addParameterToSelection(parameterObject) {
  return {
    type: ADD_PARAMETER_TO_SELECTION,
    parameterObject,
  };
}

export function setMeetnets(ids) {
  return {
    type: SET_MEETNETS,
    ids,
  };
}

export function setParameterGroups(ids) {
  return {
    type: SET_PARAMETERGROUPS,
    ids,
  };
}

export function setParameters(ids) {
  return {
    type: SET_PARAMETERS,
    ids,
  };
}

export function setLocations(locations) {
  return {
    type: SET_LOCATIONS,
    locations,
  };
}

export function setSplitByYear(splitByYear) {
  return {
    type: SET_SPLIT_BY_YEAR,
    splitByYear,
  };
}

export function applyFilter(q, colName) {
  return {
    type: APPLY_FILTER,
    q,
    colName,
  };
}

export function applySorting(sorting) {
  return {
    type: APPLY_SORTING,
    sorting,
  };
}


function requestOpnames() {
  return {
    type: REQUEST_OPNAMES,
  };
}

function receiveOpnames(results, page) {
  return {
    type: RECEIVE_OPNAMES,
    page,
    results,
  };
}


export function fetchOpnames(page) {
  return (dispatch, getState) => {
    // if (getState().opnames.page === page && page !== 1) {
    //   // Page stayed the same, don't refetch!
    //   return Promise.resolve();
    // }
    dispatch(showLoading());
    dispatch(requestOpnames());

    const filtersObject = getState().opnames.filters;
    const sort_fields = Object.keys(getState().opnames.sorting);
    const sort_dirs = Object.values(getState().opnames.sorting);
    const meetnetids = getState().opnames.meetnets;
    const parametergroupids = getState().opnames.parametergroups;
    const parameterids = getState().opnames.parameterIds;
    const locationids = getState().opnames.locationIds;
    const start_date = getState().opnames.start_date;
    const end_date = getState().opnames.end_date;
    const season = getState().opnames.season;
    const split_by_year = getState().opnames.split_by_year
    const dataObject = {
      page: page,
      page_size: 200,
      meetnets: meetnetids.join(','),
      locations: locationids.join(','),
      parametergroups: parametergroupids.join(','),
      parameters: parameterids.join(','),
      start_date,
      end_date,
      season,
      split_by_year,
      sort_fields: sort_fields.join(','),
      sort_dirs: sort_dirs.join(','),
    };
    const mergedData = _.merge(dataObject, filtersObject);
    const opnamesEndpoint = $.ajax({
      url: '/api/opnames/',
      type: 'post',
      dataType: 'json',
      data: mergedData,
      success: (data) => {
        return data;
      },
    });
    Promise.all([opnamesEndpoint]).then(([opnamesResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveOpnames(opnamesResults, page));
    });
  };
}

export function setColorBy(id) {
  return {
    type: SET_COLOR_BY,
    id,
  };
}

function requestFeatures() {
  return {
    type: REQUEST_FEATURES,
  };
}

function receiveFeatures(results) {
  return {
    type: RECEIVE_FEATURES,
    results,
  };
}



export function fetchFeatures() {
  return (dispatch, getState) => {
    dispatch(showLoading());
    dispatch(requestFeatures());

    const filtersObject = getState().opnames.filters;
    const meetnetids = getState().opnames.meetnets;
    const parametergroupids = getState().opnames.parametergroups;
    const parameterids = getState().opnames.parameterIds;
    const locationids = getState().opnames.locationIds;
    const start_date = getState().opnames.start_date;
    const end_date = getState().opnames.end_date;
    const season = getState().opnames.season;
    const color_by = getState().opnames.color_by;

    const dataObject = {
      meetnets: meetnetids.join(','),
      locations: locationids.join(','),
      start_date,
      end_date,
      season,
      color_by,
    };
    const mergedData = _.merge(dataObject, filtersObject);
    const featuresEndpoint = $.ajax({
      url: '/api/map/',
      type: 'post',
      dataType: 'json',
      data: mergedData,
      success: (data) => {
        return data;
      },
    });
    Promise.all([featuresEndpoint]).then(([featuresResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveFeatures(featuresResults));
    });
  }
}

export function removeFromLinechartsRightYById(id) {
  return {
    type: REMOVE_FROM_LINECHARTS_RIGHT_Y_BY_ID,
    id,
  }
}


function requestDataForRightY() {
  return {
    type: REQUEST_DATA_FOR_RIGHT_Y,
  };
}

function receiveDataForRightY(chart, results) {
  return {
    type: RECEIVE_DATA_FOR_RIGHT_Y,
    chart,
    results,
  };
}

export function addToLinechartsRightY(chart) {
  return (dispatch, getState) => {
    dispatch(showLoading());
    dispatch(requestDataForRightY());

    const chartsEndpoint = $.ajax({
      type: 'GET',
      url: `/api/lines/${chart.id}/`,
      success: (data) => {
        return data;
      }
    });

    Promise.all([chartsEndpoint]).then(([chartsResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveDataForRightY(chart, chartsResults));
    });
  }
}




export function removeFromLinechartsLeftYById(id) {
  return {
    type: REMOVE_FROM_LINECHARTS_LEFT_Y_BY_ID,
    id,
  }
}


function requestDataForLeftY() {
  return {
    type: REQUEST_DATA_FOR_LEFT_Y,
  };
}

function receiveDataForLeftY(chart, results) {
  return {
    type: RECEIVE_DATA_FOR_LEFT_Y,
    chart,
    results,
  };
}

export function addToLinechartsLeftY(chart) {
  return (dispatch, getState) => {
    dispatch(showLoading());
    dispatch(requestDataForLeftY());

    const chartsEndpoint = $.ajax({
      type: 'GET',
      url: `/api/lines/${chart.id}/`,
      success: (data) => {
        return data;
      }
    });

    Promise.all([chartsEndpoint]).then(([chartsResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveDataForLeftY(chart, chartsResults));
    });
  }
}


function requestCharts() {
  return {
    type: REQUEST_CHARTS,
  };
}

function receiveCharts(results) {
  return {
    type: RECEIVE_CHARTS,
    results,
  };
}


export function fetchCharts() {
  return (dispatch, getState) => {
    dispatch(showLoading());
    dispatch(requestCharts());

    const filtersObject = getState().opnames.filters;
    const meetnetids = getState().opnames.meetnets;
    const locationids = getState().opnames.locationIds;
    const start_date = getState().opnames.start_date;
    const end_date = getState().opnames.end_date;
    const season = getState().opnames.season;
    const split_by_year = getState().opnames.split_by_year;

    const dataObject = {
      meetnets: meetnetids.join(','),
      locations: locationids.join(','),
      start_date,
      end_date,
      season,
      split_by_year,
    };
    const mergedData = _.merge(dataObject, filtersObject);
    const chartsEndpoint = $.ajax({
      url: '/api/graphs/',
      type: 'post',
      dataType: 'json',
      data: mergedData,
      success: (data) => {
        return data;
      },
    });
    Promise.all([chartsEndpoint]).then(([chartsResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveCharts(chartsResults));
    });
  }
}


function requestDataForSelectedBoxplots() {
  return {
    type: REQUEST_DATA_FOR_SELECTED_BOXPLOTS,
  };
}

function receiveDataForSelectedBoxplots(results) {
  return {
    type: RECEIVE_DATA_FOR_SELECTED_BOXPLOTS,
    results,
  };
}


export function reloadDataForBoxplots() {
  return (dispatch, getState) => {
    dispatch(showLoading());
    dispatch(requestDataForSelectedBoxplots());

    const startDate = getState().opnames.start_date;
    const endDate = getState().opnames.end_date;
    const splitByYear = getState().opnames.split_by_year;

    const urls = getState().opnames.boxplotCharts.map((chart) => {
      return $.ajax({
        type: 'GET',
        url: `/api/boxplots/${chart.id}/?start_date=${startDate}&end_date=${endDate}&split_by_year=${splitByYear}`,
      });
    });

    Promise.all(urls).then(([boxplotResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveDataForSelectedBoxplots(boxplotResults));
    });
  };
}


function requestDataForBoxplot() {
  return {
    type: REQUEST_DATA_FOR_BOXPLOT,
  };
}

function receiveDataForBoxplot(chart, results) {
  return {
    type: RECEIVE_DATA_FOR_BOXPLOT,
    chart,
    results,
  };
}

export function addToBoxplotCharts(chart) {
  return (dispatch, getState) => {
    dispatch(showLoading());
    dispatch(requestDataForBoxplot());

    const startDate = getState().opnames.start_date;
    const endDate = getState().opnames.end_date;
    const splitByYear = getState().opnames.split_by_year;

    const chartsEndpoint = $.ajax({
      type: 'GET',
      url: `/api/boxplots/${chart.id}/?start_date=${startDate}&end_date=${endDate}&split_by_year=${splitByYear}`,
      success: (data) => {
        return data;
      },
    });

    Promise.all([chartsEndpoint]).then(([chartsResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveDataForBoxplot(chart, chartsResults));
    });
  };
}

export function removeFromBoxplotChartsById(id) {
  return {
    type: REMOVE_FROM_BOXPLOTCHARTS_BY_ID,
    id,
  };
}




function requestDataForScatterplot() {
  return {
    type: REQUEST_DATA_FOR_SCATTERPLOT,
  };
}

function receiveDataForScatterplot(chart, results) {
  return {
    type: RECEIVE_DATA_FOR_SCATTERPLOT,
    chart,
    results,
  };
}

export function addToScatterplotCharts(chart) {
  return (dispatch, getState) => {
    dispatch(showLoading());
    dispatch(requestDataForScatterplot());

    const chartsEndpoint = $.ajax({
      type: 'GET',
      url: `/api/scatterplots/${chart.id}/`,
      success: (data) => {
        return data;
      }
    });

    Promise.all([chartsEndpoint]).then(([chartsResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveDataForScatterplot(chart, chartsResults));
    });
  }
}

export function removeFromScatterplotChartsById(id) {
  return {
    type: REMOVE_FROM_SCATTERPLOTCHARTS_BY_ID,
    id,
  }
}



function requestSecondScatterplotAxis() {
  return {
    type: REQUEST_SECOND_SCATTERPLOT_AXIS,
  };
}

function receiveSecondScatterplotAxis(result) {
  return {
    type: RECEIVE_SECOND_SCATTERPLOT_AXIS,
    result,
  };
}


export function fetchSecondScatterplotAxis(chart) {

  return (dispatch, getState) => {
    dispatch(showLoading());
    dispatch(requestSecondScatterplotAxis());

    const chartsEndpoint = $.ajax({
      type: 'GET',
      url: chart['scatterplot-second-axis-url'].replace(
        'https://efcis.staging.lizard.net', ''),
      success: (data) => {
        return data;
      }
    });
    Promise.all([chartsEndpoint]).then(([chartsResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveSecondScatterplotAxis(chartsResults));
    });
  }

}

export function setAsScatterplotChartsY(chart) {
  return {
    type: SET_AS_SCATTERPLOTCHARTS_Y,
    chart,
  };
}





function requestScatterplotData() {
  return {
    type: REQUEST_SCATTERPLOT_DATA,
  };
}

function receiveScatterplotData(result) {
  return {
    type: RECEIVE_SCATTERPLOT_DATA,
    result,
  };
}


export function fetchScatterplotDataByUrl(scatterplotUrl) {
  return (dispatch, getState) => {
    dispatch(requestScatterplotData());
    dispatch(showLoading());

    const chartsEndpoint = $.ajax({
      type: 'GET',
      url: scatterplotUrl.replace(
        'https://efcis.staging.lizard.net', ''),
      success: (data) => {
        return data;
      }
    });
    Promise.all([chartsEndpoint]).then(([chartsResults]) => {
      dispatch(hideLoading());
      return dispatch(receiveScatterplotData(chartsResults));
    });
  }
}

export function setTresholdForLinechart(value) {
  return {
    type: SET_TRESHOLD_FOR_LINECHART,
    value,
  };
}



export function setLeftAxisMinForLinechart(value) {
  return {
    type: SET_LEFT_AXIS_MIN_FOR_LINECHART,
    value,
  };
}

export function setLeftAxisMaxForLinechart(value) {
  return {
    type: SET_LEFT_AXIS_MAX_FOR_LINECHART,
    value,
  };
}

export function setRightAxisMinForLinechart(value) {
  return {
    type: SET_RIGHT_AXIS_MIN_FOR_LINECHART,
    value,
  };
}

export function setRightAxisMaxForLinechart(value) {
  return {
    type: SET_RIGHT_AXIS_MAX_FOR_LINECHART,
    value,
  };
}


export function setLeftLineColorById(config) {
  return {
    type: SET_LEFT_LINECOLOR_BY_ID,
    config,
  };
}

export function setRightLineColorById(config) {
  return {
    type: SET_RIGHT_LINECOLOR_BY_ID,
    config,
  };
}

export function setLeftLineStyleById(config) {
  return {
    type: SET_LEFT_LINESTYLE_BY_ID,
    config,
  };
}

export function setRightLineStyleById(config) {
  return {
    type: SET_RIGHT_LINESTYLE_BY_ID,
    config,
  };
}


export function setLeftLineWidthById(config) {
  return {
    type: SET_LEFT_LINEWIDTH_BY_ID,
    config,
  };
}

export function setRightLineWidthById(config) {
  return {
    type: SET_RIGHT_LINEWIDTH_BY_ID,
    config,
  };
}

export function toggleSymbols() {
  return {
    type: TOGGLE_SYMBOLS,
  };
}


export function toggleUserDaterange() {
  return {
    type: TOGGLE_USER_DATERANGE,
  };
}

export function toggleReverseLegend() {
  return {
    type: TOGGLE_REVERSE_LEGEND,
  };
}

export function useDataDomain() {
  return {
    type: USE_DATA_DOMAIN,
  };
}

export function setLegendIntervals(numberOfIntervals) {
  return {
    type: SET_LEGEND_INTERVALS,
    numberOfIntervals: parseInt(numberOfIntervals),
  };
}

export function setLegendMin(value) {
  return {
    type: SET_LEGEND_MIN,
    value: parseFloat(value),
  };
}

export function setLegendMax(value) {
  return {
    type: SET_LEGEND_MAX,
    value: parseFloat(value),
  };
}



export function setTitleForTijdreeks(title) {
  return {
    type: SET_TITLE_FOR_TIJDREEKS,
    title,
  };
}

export function setTitleForBoxplot(title) {
  return {
    type: SET_TITLE_FOR_BOXPLOT,
    title,
  };
}

export function setTitleForScatterplot(title) {
  return {
    type: SET_TITLE_FOR_SCATTERPLOT,
    title,
  };
}
