import { createStore, combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function cache(state={}, action) {
  switch(action.type) {
    case 'ADD_CACHE':
      return {...state, ...action.payload}
    default: 
      return state;
  }
}

const allReducers = (history) => combineReducers({  //使用combineReducers 将两个reducer变为一个
  router: connectRouter(history), // 添加路由reducer通过传递history给connectRouter
  cache
})

export default createStore(allReducers(history));
export {history};