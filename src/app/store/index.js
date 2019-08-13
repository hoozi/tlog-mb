import { init } from '@rematch/core';
import { createHashHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createLoading from '@rematch/loading';

import any from './models/any';
import cache from './models/cache';

const history = createHashHistory();

const loading = createLoading();

const redux = {
  middlewares: [routerMiddleware(history)],
  reducers: {
    router: connectRouter(history)
  }
}

const store = init({
  models: {
    any,
    cache
  },
  redux,
  plugins: [loading]
});

export { history }

export default store;