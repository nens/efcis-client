import _ from 'lodash';
import { combineReducers } from 'redux';
// import undoable, { distinctState } from 'redux-undo';
import {
  REQUEST_OPNAMES,
  RECEIVE_OPNAMES,
  APPLY_FILTER,
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
  meetnets: undefined,
  parametergroeps: undefined,
  parameters: undefined,
}, action) {
  // console.log('reducer reports() was called with state', state, 'and action', action);
  switch (action.type) {
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
  default:
    return state;
  }
}


const rootReducer = combineReducers({
  opnames,
});

export default rootReducer;
