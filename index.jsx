/* globals Promise:true */
import 'babel-polyfill';
import {persistStore} from 'redux-persist';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './configureStore.jsx';
import * as localForage from 'localforage';

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
           <Route path='/' component={
             require('react-router?name=[name]!./components/TableApp.jsx')
           } />
           <Route path='table' component={
             require('react-router?name=[name]!./components/TableApp.jsx')
           } />
           <Route path='map' component={
             require('react-router?name=[name]!./components/MapApp.jsx')
           } />
           <Route path='chart' component={
             require('react-router?name=[name]!./components/ChartApp.jsx')
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
