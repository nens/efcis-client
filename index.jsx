/* globals Promise:true */
import 'babel-polyfill';
import {persistStore} from 'redux-persist';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './configureStore.jsx';
import * as localForage from 'localforage';

import TableApp from './components/TableApp.jsx';
import MapApp from './components/MapApp.jsx';
import ChartApp from './components/ChartApp.jsx';

const store = configureStore();
const persistor = persistStore(store, { storage: localForage });

class App extends Component {

  constructor() {
    super();
    this.state = { rehydrated: false };
  }

  componentWillMount() {
    persistStore(store, {
      storage: localForage,
      blacklist: ['loadingBarReducer'],
      keyPrefix: 'efcis:',
    }, () => {
      this.setState({ rehydrated: true });
    });
  }

  render() {
    if (!this.state.rehydrated) {
      return <div>Laden...</div>;
    }
    return (
       <Provider store={store} persistor={persistor}>
         <Router history={hashHistory}>
           <Route path='/' component={TableApp
            //  require('react-router?name=[name]!./components/TableApp.jsx')
           } />
           <Route path='map' component={MapApp
            //  require('react-router?name=[name]!./components/MapApp.jsx')
           } />
           <Route path='chart' component={ChartApp
            //  require('react-router?name=[name]!./components/ChartApp.jsx')
           } />
         </Router>
       </Provider>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
