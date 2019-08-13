import React from 'react';
import { Provider } from 'react-redux';
import AppRouter from './router';
import store, { history } from './store';

const createApp = store => (
  <Provider store={store}>
    <AppRouter history={history}/>
  </Provider>
)

export default createApp(store);