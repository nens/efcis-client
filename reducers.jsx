import _ from 'lodash';
import { combineReducers } from 'redux';
// import undoable, { distinctState } from 'redux-undo';
import {
  ADD_LOCATION_TO_SELECTION,
  APPLY_FILTER,
  CLEAR_LOCATIONS_SELECTION,
  RECEIVE_OPNAMES,
  REMOVE_LOCATION_FROM_SELECTION,
  REQUEST_OPNAMES,
  RESET_ALL_FILTERS,
  SET_LOCATIONS,
  SET_MEETNETS,
  SET_PERIOD,
} from './actions.jsx';


function opnames(state = {
  isFetching: false,
  results: {},
  page: 1,
  filters: {},
  sort_fields: undefined,
  sort_dirs: undefined,
  start_date: undefined,
  end_date: undefined,
  parametergroeps: [],
  parameters: [],
  locations: [],
  locationIds: [],
  meetnets: [],
}, action) {
  // console.log('reducer reports() was called with state', state, 'and action', action);
  switch (action.type) {
  case RESET_ALL_FILTERS:
    return Object.assign({}, state, {
      isFetching: false,
      results: {},
      page: 1,
      filters: {},
      sort_fields: undefined,
      sort_dirs: undefined,
      start_date: undefined,
      end_date: undefined,
      parametergroeps: [],
      parameters: [],
      locations: [],
      locationIds: [],
      meetnets: [],
    });
  case SET_PERIOD:
    return Object.assign({}, state, {
      startDate: action.startDate,
      endDate: action.endDate,
    });
  case CLEAR_LOCATIONS_SELECTION:
    return Object.assign({}, state, {
      locations: [],
      locationIds: [],
    });
  case ADD_LOCATION_TO_SELECTION:
    const locationsById = state.locations.filter((l) => {
      if (l.id === action.locationObject.id) {
        return l;
      }
      return false;
    });
    if (locationsById.length === 0) {
      return Object.assign({}, state, {
        locations: [...state.locations, action.locationObject],
        locationIds: [...state.locationIds, action.locationObject.id],
      });
    }
    return state;
  case REMOVE_LOCATION_FROM_SELECTION:
    return Object.assign({}, state, {
      locations: state.locations.filter((l) => {
        if (l.id === action.id) {
          return false;
        }
        return true;
      }),
      locationIds: state.locationIds.filter((l) => {
        if (l === action.id) {
          return false;
        }
        return true;
      }),
    });
  case APPLY_FILTER:
    return Object.assign({}, state, {
      filters: {
        ...state.filters, [action.colName]: action.q,
      },
    });
  case REQUEST_OPNAMES:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_OPNAMES:
    return Object.assign({}, state, {
      isFetching: false,
      page: action.page,
      results: action.results,
    });
  case SET_MEETNETS:
    return Object.assign({}, state, {
      meetnets: action.ids,
    });
  case SET_LOCATIONS:
    return Object.assign({}, state, {
      locations: action.ids,
    });
  default:
    return state;
  }
}


const rootReducer = combineReducers({
  opnames,
});

export default rootReducer;
