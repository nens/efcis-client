// import persistState from 'redux-localstorage';
import { autoRehydrate } from 'redux-persist';
import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from './reducers.jsx';
import thunkMiddleware from 'redux-thunk';

const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware, loggerMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
      autoRehydrate()
    )
  );
}
