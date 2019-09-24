import { init } from '@rematch/core';
import { createHashHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createLoading from '@rematch/loading';

import common from './models/common';
import cache from './models/cache';
import user from './models/user';
import cargo from './models/cargo';
import transport from './models/transport';
import priceReply from './models/priceReply';
import order from './models/order';
import product from './models/product';
import news from './models/news';
import sock from './models/sock';
import task from './models/task';
import congestion from './models/congestion';

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
    user,
    cargo,
    transport,
    priceReply,
    order,
    product,
    news,
    sock,
    task,
    congestion
  },
  redux,
  plugins: [loading]
});

export { history }

export default store;