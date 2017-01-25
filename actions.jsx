/* globals Promise:true */
import $ from 'jquery';
import _ from 'lodash';

export const ADD_LOCATION_TO_SELECTION = 'ADD_LOCATION_TO_SELECTION';
export const APPLY_FILTER = 'APPLY_FILTER';
export const APPLY_SORTING = 'APPLY_SORTING';
export const CLEAR_LOCATIONS_SELECTION = 'CLEAR_LOCATIONS_SELECTION';
export const RECEIVE_CHARTS = 'RECEIVE_CHARTS';
export const RECEIVE_DATA_FOR_LEFT_Y = 'RECEIVE_DATA_FOR_LEFT_Y';
export const RECEIVE_DATA_FOR_RIGHT_Y = 'RECEIVE_DATA_FOR_RIGHT_Y';
export const RECEIVE_FEATURES = 'RECEIVE_FEATURES';
export const RECEIVE_OPNAMES = 'RECEIVE_OPNAMES';
export const REMOVE_FROM_LINECHARTS_LEFT_Y_BY_ID = 'REMOVE_FROM_LINECHARTS_LEFT_Y_BY_ID';
export const REMOVE_FROM_LINECHARTS_RIGHT_Y_BY_ID = 'REMOVE_FROM_LINECHARTS_RIGHT_Y_BY_ID';
export const REMOVE_LOCATION_FROM_SELECTION = 'REMOVE_LOCATION_FROM_SELECTION';
export const REQUEST_CHARTS = 'REQUEST_CHARTS';
export const REQUEST_DATA_FOR_LEFT_Y = 'REQUEST_DATA_FOR_LEFT_Y';
export const REQUEST_DATA_FOR_RIGHT_Y = 'REQUEST_DATA_FOR_RIGHT_Y';
export const REQUEST_FEATURES = 'REQUEST_FEATURES';
export const REQUEST_OPNAMES = 'REQUEST_OPNAMES';
export const RESET_ALL_FILTERS = 'RESET_ALL_FILTERS';
export const SET_COLOR_BY = 'SET_COLOR_BY';
export const SET_LOCATIONS = 'SET_LOCATIONS';
export const SET_MAP_POSITION = 'SET_MAP_POSITION';
export const SET_MAP_STATISTICS = 'SET_MAP_STATISTICS';
export const SET_MEETNETS = 'SET_MEETNETS';
export const SET_PARAMETERGROUPS = 'SET_PARAMETERGROUPS';
export const SET_PERIOD = 'SET_PERIOD';
export const SET_SEASON = 'SET_SEASON';


function getCookie(c_name) {
  if (document.cookie.length > 0)
  {
    let c_start = document.cookie.indexOf(c_name + '=');
    if (c_start != -1)
    {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(';', c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return '';
}
$.ajaxSetup({
  headers: { 'X-CSRFToken': getCookie('csrftoken') }
});

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

export function removeLocationFromSelection(id) {
  return {
    type: REMOVE_LOCATION_FROM_SELECTION,
    id,
  };
}

export function addLocationToSelection(locationObject) {
  return {
    type: ADD_LOCATION_TO_SELECTION,
    locationObject,
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

export function setLocations(ids) {
  return {
    type: SET_LOCATIONS,
    ids,
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
    dispatch(requestOpnames());

    const filtersObject = getState().opnames.filters;
    const sort_fields = Object.keys(getState().opnames.sorting);
    const sort_dirs = Object.values(getState().opnames.sorting);
    const meetnetids = getState().opnames.meetnets;
    const parametergroupids = getState().opnames.parametergroups;
    const parameterids = getState().opnames.parameters;
    const locationids = getState().opnames.locationIds;
    const start_date = getState().opnames.start_date;
    const end_date = getState().opnames.end_date;
    const season = getState().opnames.season;
    const dataObject = {
      page: page,
      page_size: 200,
      meetnets: meetnetids.join(','),
      locations: locationids.join(','),
      parametergoups: parametergroupids.join(','),
      start_date,
      end_date,
      season,
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
    dispatch(requestFeatures());

    const filtersObject = getState().opnames.filters;
    const meetnetids = getState().opnames.meetnets;
    const parametergroupids = getState().opnames.parametergroups;
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
    dispatch(requestDataForRightY());

    const chartsEndpoint = $.ajax({
      type: 'GET',
      url: `/api/lines/${chart.id}/`,
      success: (data) => {
        return data;
      }
    });

    Promise.all([chartsEndpoint]).then(([chartsResults]) => {
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
    dispatch(requestDataForLeftY());

    const chartsEndpoint = $.ajax({
      type: 'GET',
      url: `/api/lines/${chart.id}/`,
      success: (data) => {
        return data;
      }
    });

    Promise.all([chartsEndpoint]).then(([chartsResults]) => {
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
    dispatch(requestCharts());

    const filtersObject = getState().opnames.filters;
    const meetnetids = getState().opnames.meetnets;
    const locationids = getState().opnames.locationIds;
    const start_date = getState().opnames.start_date;
    const end_date = getState().opnames.end_date;
    const season = getState().opnames.season;

    const dataObject = {
      meetnets: meetnetids.join(','),
      locations: locationids.join(','),
      start_date,
      end_date,
      season,
    };
    const mergedData = _.merge(dataObject, filtersObject);
    $.ajaxSetup({
      headers: { 'X-CSRFToken': getCookie("csrftoken") }
    });
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
      return dispatch(receiveCharts(chartsResults));
    });
  }
}
