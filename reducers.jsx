import _ from 'lodash';
import moment from 'moment';
import { combineReducers } from 'redux';
// import undoable, { distinctState } from 'redux-undo';
import {
  ADD_LOCATION_TO_SELECTION,
  APPLY_FILTER,
  APPLY_SORTING,
  CLEAR_LOCATIONS_SELECTION,
  RECEIVE_FEATURES,
  RECEIVE_OPNAMES,
  REMOVE_LOCATION_FROM_SELECTION,
  REQUEST_FEATURES,
  REQUEST_OPNAMES,
  RESET_ALL_FILTERS,
  SET_COLOR_BY,
  SET_LOCATIONS,
  SET_MAP_POSITION,
  SET_MAP_STATISTICS,
  SET_MEETNETS,
  SET_PERIOD,
  SET_SEASON,
} from './actions.jsx';

const dateFormat = 'DD-MM-YYYY';

function opnames(state = {
  isFetching: false,
  results: {},
  page: 1,
  filters: {},
  sorting: {},
  start_date: moment().subtract(29, 'days').format(dateFormat),
  end_date: moment().format(dateFormat),
  parametergroeps: [],
  parameters: [],
  locations: [],
  locationIds: [],
  map_statistics: 'lastval',
  meetnets: [],
  features: [],
  season: undefined,
  color_by: undefined,
  map: {
    lat: 52.0741,
    lng: 5.1432,
    zoom: 11,
  },
}, action) {
  // console.log('reducer reports() was called with state', state, 'and action', action);
  switch (action.type) {
  case RESET_ALL_FILTERS:
    return Object.assign({}, state, {
      isFetching: false,
      results: {},
      page: 1,
      filters: {},
      sorting: {},
      start_date: moment().subtract(29, 'days').format(dateFormat),
      end_date: moment().format(dateFormat),
      parametergroeps: [],
      parameters: [],
      locations: [],
      locationIds: [],
      map_statistics: 'lastval',
      meetnets: [],
      features: [],
      season: undefined,
      color_by: undefined,
      map: {
        lat: 52.0741,
        lng: 5.1432,
        zoom: 11,
      },
    });
  case SET_MAP_POSITION:
    return Object.assign({}, state, {
      map: action.object,
    });
  case SET_SEASON:
    return Object.assign({}, state, {
      season: action.season,
    });
  case SET_PERIOD:
    return Object.assign({}, state, {
      start_date: action.startDate,
      end_date: action.endDate,
    });
  case SET_COLOR_BY:
    return Object.assign({}, state, {
      color_by: action.id,
    });
  case SET_MAP_STATISTICS:
    return Object.assign({}, state, {
      map_statistics: action.statisticsType,
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
  case APPLY_SORTING:
    return Object.assign({}, state, {
      sorting: action.sorting,
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
  case REQUEST_FEATURES:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_FEATURES:
    return Object.assign({}, state, {
      isFetching: false,
      features: action.results,
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
