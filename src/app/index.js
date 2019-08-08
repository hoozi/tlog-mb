import React from 'react';
import { Provider } from 'react-redux';
import AppRouter from './router';
import store from './store';

const createApp = store => (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
)

export default createApp(store);