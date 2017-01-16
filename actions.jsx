/* globals Promise:true */
import $ from 'jquery';
import _ from 'lodash';

export const CLEAR_LOCATIONS_SELECTION = 'CLEAR_LOCATIONS_SELECTION';
export const REQUEST_OPNAMES = 'REQUEST_OPNAMES';
export const RECEIVE_OPNAMES = 'RECEIVE_OPNAMES';
export const APPLY_FILTER = 'APPLY_FILTER';
export const SET_MEETNETS = 'SET_MEETNETS';
export const SET_LOCATIONS = 'SET_LOCATIONS';
export const ADD_LOCATION_TO_SELECTION = 'ADD_LOCATION_TO_SELECTION';
export const REMOVE_LOCATION_FROM_SELECTION = 'REMOVE_LOCATION_FROM_SELECTION';


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
    const dataObject = {
      page: page,
      page_size: 200,
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
