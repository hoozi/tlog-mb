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
import priceReply from './models/priceReply';
import order from './models/order';

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
    transport,
    priceReply,
    order
  },
  redux,
  plugins: [loading]
});

export { history }

export default store;