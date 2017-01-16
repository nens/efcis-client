import _ from 'lodash';
import { combineReducers } from 'redux';
// import undoable, { distinctState } from 'redux-undo';
import {
  ADD_LOCATION_TO_SELECTION,
  CLEAR_LOCATIONS_SELECTION,
  REMOVE_LOCATION_FROM_SELECTION,
  REQUEST_OPNAMES,
  RECEIVE_OPNAMES,
  APPLY_FILTER,
  SET_MEETNETS,
  SET_LOCATIONS,
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
  locationObjects: [],
  meetnets: [],
}, action) {
  // console.log('reducer reports() was called with state', state, 'and action', action);
  switch (action.type) {
  case CLEAR_LOCATIONS_SELECTION:
    return Object.assign({}, state, {locations: []});
  case ADD_LOCATION_TO_SELECTION:
    const locationsById = state.locations.filter((l) => {
      if (l.id === action.locationObject.id) return l;
    });
    if (locationsById.length === 0) {
      return Object.assign({}, state, {
        locations: [...state.locations, action.locationObject],
      });
    }
    else {
      return state;
    }
  case REMOVE_LOCATION_FROM_SELECTION:
    return Object.assign({}, state, {
      locations: state.locations.filter((l) => {
        if (l.id === action.id) {
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
