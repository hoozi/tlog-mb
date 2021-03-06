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
import tide from './models/tide';
import sso from './models/sso';
import sso_v8 from './models/sso_v8';
import analysis from './models/analysis';
import vovage from './models/vovage';
import message from './models/message';
import invoice from './models/invoice';

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
    congestion,
    tide,
    sso,
    sso_v8,
    analysis,
    vovage,
    message,
    invoice
  },
  redux,
  plugins: [loading]
});

export { history }

export default store;