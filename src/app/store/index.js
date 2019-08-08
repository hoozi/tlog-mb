import { init } from '@rematch/core';
import createLoading from '@rematch/loading';

import any from './models/any';
import cache from './models/cache';

const loading = createLoading();

const store = init({
  models: {
    any,
    cache
  },
  plugins: [loading]
});

export default store;