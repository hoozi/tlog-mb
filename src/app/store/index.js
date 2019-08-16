import { init } from '@rematch/core';
import { createHashHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createLoading from '@rematch/loading';

import common from './models/common';
import cache from './models/cache';
import any from './models/any';
import user from './models/user';
import cargo from './models/cargo';
import transport from './models/transport';

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
    common,
    cache,
    any,
    user,
    cargo,
    transport
  },
  redux,
  plugins: [loading]
});

export { history }

export default store;