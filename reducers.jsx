import _ from 'lodash';
import moment from 'moment';
import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
// import undoable, { distinctState } from 'redux-undo';
import {
  ADD_LOCATION_TO_SELECTION,
  APPLY_FILTER,
  ADD_PARAMETER_TO_SELECTION,
  APPLY_SORTING,
  CLEAR_LOCATIONS_SELECTION,
  CLEAR_PARAMETERS_SELECTION,
  RECEIVE_CHARTS,
  RECEIVE_DATA_FOR_BOXPLOT,
  RECEIVE_DATA_FOR_LEFT_Y,
  RECEIVE_DATA_FOR_RIGHT_Y,
  RECEIVE_DATA_FOR_SCATTERPLOT,
  RECEIVE_FEATURES,
  RECEIVE_OPNAMES,
  RECEIVE_SCATTERPLOT_DATA,
  RECEIVE_SECOND_SCATTERPLOT_AXIS,
  REMOVE_FROM_BOXPLOTCHARTS_BY_ID,
  REMOVE_FROM_LINECHARTS_LEFT_Y_BY_ID,
  REMOVE_FROM_LINECHARTS_RIGHT_Y_BY_ID,
  REMOVE_FROM_SCATTERPLOTCHARTS_BY_ID,
  REMOVE_LOCATION_FROM_SELECTION,
  REMOVE_PARAMETER_FROM_SELECTION,
  REQUEST_CHARTS,
  REQUEST_DATA_FOR_BOXPLOT,
  REQUEST_DATA_FOR_LEFT_Y,
  REQUEST_DATA_FOR_RIGHT_Y,
  REQUEST_DATA_FOR_SCATTERPLOT,
  REQUEST_DATA_FOR_SELECTED_BOXPLOTS,
  RECEIVE_DATA_FOR_SELECTED_BOXPLOTS,
  REQUEST_FEATURES,
  REQUEST_OPNAMES,
  REQUEST_SCATTERPLOT_DATA,
  REQUEST_SECOND_SCATTERPLOT_AXIS,
  RESET_ALL_FILTERS,
  SET_LEGEND_MIN,
  SET_LEGEND_MAX,
  SET_COLOR_BY,
  SET_LEFT_LINECOLOR_BY_ID,
  SET_LEFT_LINESTYLE_BY_ID,
  SET_LEFT_LINEWIDTH_BY_ID,
  SET_RIGHT_LINEWIDTH_BY_ID,
  SET_RIGHT_LINESTYLE_BY_ID,
  SET_LEGEND_INTERVALS,
  SET_RIGHT_LINECOLOR_BY_ID,
  SET_LOCATIONS,
  SET_MAP_POSITION,
  SET_MAP_STATISTICS,
  SET_MEETNETS,
  SET_PARAMETERGROUPS,
  SET_PARAMETERS,
  SET_PERIOD,
  SET_SEASON,
  SET_SPLIT_BY_YEAR,
  SET_TITLE_FOR_TIJDREEKS,
  SET_TITLE_FOR_BOXPLOT,
  SET_TITLE_FOR_SCATTERPLOT,
  SET_TRESHOLD_FOR_LINECHART,
  SET_LEFT_AXIS_MIN_FOR_LINECHART,
  SET_LEFT_AXIS_MAX_FOR_LINECHART,
  SET_RIGHT_AXIS_MIN_FOR_LINECHART,
  SET_RIGHT_AXIS_MAX_FOR_LINECHART,
  TOGGLE_REVERSE_LEGEND,
  TOGGLE_USER_DATERANGE,
  TOGGLE_SYMBOLS,
  USE_DATA_DOMAIN,
} from './actions.jsx';

const dateFormat = 'DD-MM-YYYY';

function opnames(state = {
  isFetching: false,
  results: {},
  tijdreeksTitle: 'Tijdreeks',
  boxplotTitle: 'Boxplot',
  scatterplotTitle: 'Scatterplot',
  page: 1,
  filters: {},
  sorting: {},
  start_date: moment().subtract(29, 'days').format(dateFormat),
  end_date: moment().format(dateFormat),
  parametergroups: [],
  parameters: [],
  parameterIds: [],
  locations: [],
  locationIds: [],
  map_statistics: 'lastval',
  meetnets: [],
  features: [],
  charts: [],
  lineChartSettings: {
    treshold: undefined,
    leftMin: undefined,
    leftMax: undefined,
    rightMin: undefined,
    rightMax: undefined,
    userDefinedDaterange: false,
    showSymbols: true,
  },
  mapSettings: {
    reverseLegend: false,
    numLegendIntervals: 11,
    dataDomain: false,
    legendMin: undefined,
    legendMax: undefined,
  },
  boxplotCharts: [],
  splitByYear: false,
  scatterplotCharts: [],
  scatterplotData: undefined,
  linechartsLeftY: [],
  linechartsRightY: [],
  boxplotCharts: [],
  scatterplotCharts: [],
  secondScatterplotCharts: [],
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
      tijdreeksTitle: 'Tijdreeks',
      boxplotTitle: 'Boxplot',
      scatterplotTitle: 'Scatterplot',
      page: 1,
      filters: {},
      sorting: {},
      start_date: moment().subtract(29, 'days').format(dateFormat),
      end_date: moment().format(dateFormat),
      parametergroups: [],
      parameters: [],
      parameterIds: [],
      locations: [],
      locationIds: [],
      map_statistics: 'lastval',
      meetnets: [],
      features: [],
      charts: [],
      lineChartSettings: {
        treshold: undefined,
        leftMin: undefined,
        leftMax: undefined,
        rightMin: undefined,
        rightMax: undefined,
        userDefinedDaterange: false,
        showSymbols: true,
      },
      mapSettings: {
        reverseLegend: false,
        numLegendIntervals: 11,
        dataDomain: false,
        legendMin: undefined,
        legendMax: undefined,
      },
      boxplotCharts: [],
      splitByYear: false,
      scatterplotCharts: [],
      scatterplotData: undefined,
      secondScatterplotCharts: [],
      linechartsLeftY: [],
      linechartsRightY: [],
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
  case SET_SPLIT_BY_YEAR:
    return Object.assign({}, state, {
      splitByYear: action.splitByYear,
    });
  case CLEAR_LOCATIONS_SELECTION:
    return Object.assign({}, state, {
      locations: [],
      locationIds: [],
    });
  case CLEAR_PARAMETERS_SELECTION:
    return Object.assign({}, state, {
      parameters: [],
      parameterIds: [],
    });

  case ADD_PARAMETER_TO_SELECTION:
    const parametersById = state.parameters.filter((p) => {
      if (p.id === action.parameterObject.id) {
        return p;
      }
      return false;
    });
    if (parametersById.length === 0) {
      return Object.assign({}, state, {
        parameters: [...state.parameters, action.parameterObject],
        parameterIds: [...state.parameterIds, action.parameterObject.id],
      });
    }
    return state;
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
  case REMOVE_PARAMETER_FROM_SELECTION:
    return Object.assign({}, state, {
      parameters: state.parameters.filter((p) => {
        if (p.id === action.id) {
          return false;
        }
        return true;
      }),
      parameterIds: state.parameterIds.filter((p) => {
        if (p === action.id) {
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
  case REQUEST_CHARTS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_CHARTS:
    return Object.assign({}, state, {
      isFetching: false,
      charts: action.results,
    });
  case SET_MEETNETS:
    return Object.assign({}, state, {
      meetnets: action.ids,
    });
  case SET_PARAMETERGROUPS:
    return Object.assign({}, state, {
      parametergroups: action.ids,
    });
  case SET_PARAMETERS:
    return Object.assign({}, state, {
      parameters: action.ids,
    });
  case SET_LOCATIONS:
    return Object.assign({}, state, {
      locations: action.locations,
      locationIds: action.locations.map((location) => location.id),
    });
  case REMOVE_FROM_BOXPLOTCHARTS_BY_ID:
    return Object.assign({}, state, {
      boxplotCharts: state.boxplotCharts.filter((chart) => {
        if (chart.id === action.id) {
          return false;
        }
        return chart;
      }),
    });
  case REQUEST_DATA_FOR_BOXPLOT:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_DATA_FOR_BOXPLOT:
    return Object.assign({}, state, {
      isFetching: false,
      boxplotCharts: [...state.boxplotCharts, action.results],
    });
  case REMOVE_FROM_SCATTERPLOTCHARTS_BY_ID:
    return Object.assign({}, state, {
      scatterplotCharts: state.scatterplotCharts.filter((chart) => {
        if (chart.id === action.id) {
          return false;
        }
        return chart;
      }),
    });
  case REQUEST_DATA_FOR_SCATTERPLOT:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_DATA_FOR_SCATTERPLOT:
    return Object.assign({}, state, {
      isFetching: false,
      scatterplotCharts: [...state.scatterplotCharts, action.results],
    });
  case REQUEST_DATA_FOR_LEFT_Y:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_DATA_FOR_LEFT_Y:
    return Object.assign({}, state, {
      isFetching: false,
      linechartsLeftY: [...state.linechartsLeftY, action.results],
    });
  case REMOVE_FROM_LINECHARTS_LEFT_Y_BY_ID:
    return Object.assign({}, state, {
      linechartsLeftY: state.linechartsLeftY.filter((chart) => {
        if (chart.id === action.id) {
          return false;
        }
        return chart;
      }),
    });
  case REQUEST_DATA_FOR_RIGHT_Y:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_DATA_FOR_RIGHT_Y:
    return Object.assign({}, state, {
      isFetching: false,
      linechartsRightY: [...state.linechartsRightY, action.results],
    });
  case REMOVE_FROM_LINECHARTS_RIGHT_Y_BY_ID:
    return Object.assign({}, state, {
      linechartsRightY: state.linechartsRightY.filter((chart) => {
        if (chart.id === action.id) {
          return false;
        }
        return chart;
      }),
    });
  case REQUEST_SECOND_SCATTERPLOT_AXIS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_SECOND_SCATTERPLOT_AXIS:
    return Object.assign({}, state, {
      isFetching: false,
      secondScatterplotCharts: action.result,
    });
  case REQUEST_SCATTERPLOT_DATA:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_SCATTERPLOT_DATA:
    return Object.assign({}, state, {
      isFetching: false,
      scatterplotData: action.result,
    });
  case SET_TRESHOLD_FOR_LINECHART:
    return {
      ...state,
      lineChartSettings: {
        ...state.lineChartSettings,
        treshold: parseFloat(action.value),
      },
    };
  case SET_LEFT_AXIS_MIN_FOR_LINECHART:
    return {
      ...state,
      lineChartSettings: {
        ...state.lineChartSettings,
        leftMin: parseInt(action.value),
      },
    };
  case SET_LEFT_AXIS_MAX_FOR_LINECHART:
    return {
      ...state,
      lineChartSettings: {
        ...state.lineChartSettings,
        leftMax: parseInt(action.value),
      },
    };
  case SET_RIGHT_AXIS_MIN_FOR_LINECHART:
    return {
      ...state,
      lineChartSettings: {
        ...state.lineChartSettings,
        rightMin: parseInt(action.value),
      },
    };
  case SET_RIGHT_AXIS_MAX_FOR_LINECHART:
    return {
      ...state,
      lineChartSettings: {
        ...state.lineChartSettings,
        rightMax: parseInt(action.value),
      },
    };
  case SET_LEFT_LINESTYLE_BY_ID:
    return {
      ...state,
      linechartsLeftY: state.linechartsLeftY.filter((lcly) => {
        if (lcly.id === action.config.id) {
          lcly.style = action.config.style;
          return lcly;
        }
        return lcly;
      }),
    };
  case SET_RIGHT_LINESTYLE_BY_ID:
    return {
      ...state,
      linechartsRightY: state.linechartsRightY.filter((lcly) => {
        if (lcly.id === action.config.id) {
          lcly.style = action.config.style;
          return lcly;
        }
        return lcly;
      }),
    };
  case SET_LEFT_LINECOLOR_BY_ID:
    return {
      ...state,
      linechartsLeftY: state.linechartsLeftY.filter((lcly) => {
        if (lcly.id === action.config.id) {
          lcly.lineColor = action.config.color;
          return lcly;
        }
        return lcly;
      }),
    };
  case SET_RIGHT_LINECOLOR_BY_ID:
    return {
      ...state,
      linechartsRightY: state.linechartsRightY.filter((lcry) => {
        if (lcry.id === action.config.id) {
          lcry.lineColor = action.config.color;
          return lcry;
        }
        return lcry;
      }),
    };
  case SET_LEFT_LINEWIDTH_BY_ID:
    return {
      ...state,
      linechartsLeftY: state.linechartsLeftY.filter((lcry) => {
        if (lcry.id === action.config.id) {
          lcry.lineWidth = action.config.width;
          return lcry;
        }
        return lcry;
      }),
    };
  case SET_RIGHT_LINEWIDTH_BY_ID:
    return {
      ...state,
      linechartsRightY: state.linechartsRightY.filter((lcry) => {
        if (lcry.id === action.config.id) {
          lcry.lineWidth = action.config.width;
          return lcry;
        }
        return lcry;
      }),
    };
  case TOGGLE_USER_DATERANGE:
    return {
      ...state,
      lineChartSettings: {
        ...state.lineChartSettings,
        userDefinedDaterange: !state.lineChartSettings.userDefinedDaterange,
      },
    };
  case TOGGLE_SYMBOLS:
    return {
      ...state,
      lineChartSettings: {
        ...state.lineChartSettings,
        showSymbols: !state.lineChartSettings.showSymbols,
      },
    };
  case TOGGLE_REVERSE_LEGEND:
    return {
      ...state,
      mapSettings: {
        ...state.mapSettings,
        reverseLegend: !state.mapSettings.reverseLegend,
      },
    };
  case USE_DATA_DOMAIN:
    return {
      ...state,
      mapSettings: {
        ...state.mapSettings,
        dataDomain: !state.mapSettings.dataDomain,
      },
    };
  case SET_LEGEND_INTERVALS:
    return {
      ...state,
      mapSettings: {
        ...state.mapSettings,
        numLegendIntervals:
          (action.numberOfIntervals >= 3 &&
          action.numberOfIntervals <= 11) ?
            action.numberOfIntervals :
            state.mapSettings.numLegendIntervals,
      },
    };
  case SET_LEGEND_MIN:
    return {
      ...state,
      mapSettings: {
        ...state.mapSettings,
        legendMin: action.value,
      },
    };
  case SET_LEGEND_MAX:
    return {
      ...state,
      mapSettings: {
        ...state.mapSettings,
        legendMax: action.value,
      },
    };
  case SET_TITLE_FOR_TIJDREEKS:
    return {
      ...state,
      tijdreeksTitle: action.title,
    };
  case SET_TITLE_FOR_BOXPLOT:
    return {
      ...state,
      boxplotTitle: action.title,
    };
  case SET_TITLE_FOR_SCATTERPLOT:
    return {
      ...state,
      scatterplotTitle: action.title,
    };
  case REQUEST_DATA_FOR_SELECTED_BOXPLOTS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_DATA_FOR_SELECTED_BOXPLOTS:
    console.log('action.results', action.results);
    return Object.assign({}, state, {
      isFetching: false,
      // boxplotCharts: [...state.boxplotCharts, action.results],
    });
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  opnames,
  loadingBar: loadingBarReducer,
});

export default rootReducer;
