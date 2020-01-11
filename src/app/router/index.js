import React, { PureComponent, Suspense } from 'react';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ConnectedRouter } from 'connected-react-router';
import { ActivityIndicator } from 'antd-mobile';
/* import { connect } from 'react-redux';*/
import UpdateModal from '@/component/UpdateModal';
/*import { getToken } from '@/utils/token';
import { parse } from 'qs'; */
import routesConfig from './routesConfig';
import './screenTransition.css';
const DEFAULT_SCREEN_CONFIG = {
  enter: 'from-right',
  exit: 'to-exit'
}

const getCurrentRoute = location => {
  return routesConfig.find(route => new RegExp(`^${route.path}$`).test(location.pathname));
}

const getScreenConfig = location => {
  const matchedRoute = getCurrentRoute(location);
  return (matchedRoute && matchedRoute.transitionConfig) || DEFAULT_SCREEN_CONFIG;
}

const getScreenTitle = location => {
  const matchedRoute = getCurrentRoute(location);
  return (matchedRoute && matchedRoute.title) || '全程物流';
}

let oldLocation = null;

const Routes = withRouter(({location, history}) => {
  // 转场动画应该都是采用当前页面的sceneConfig，所以：
  // push操作时，用新location匹配的路由sceneConfig
  // pop操作时，用旧location匹配的路由sceneConfig
  let classNames = '';
  if(history.action === 'PUSH') {
    classNames = 'forward-' + getScreenConfig(location).enter;
  } else if(history.action === 'POP' && oldLocation) {
    classNames = 'back-' + getScreenConfig(oldLocation).exit;
  }
  // 更新旧location
  oldLocation = location;
  document.title = getScreenTitle(location);
  return (
    <TransitionGroup
      className='router-wrapper'
      childFactory={child => React.cloneElement(child, {classNames})}
    >
      <CSSTransition timeout={300} key={location.pathname} unmountOnExit>
        <Suspense fallback={<div style={styles.fullCenter}><ActivityIndicator size='large'/></div>}>
          <Switch location={location}>
            {routesConfig.map(config => (
              <Route exact key={config.path} {...config}/>
            ))}
          </Switch>
        </Suspense>
      </CSSTransition>
    </TransitionGroup>
  )
});

class AppRouter extends PureComponent {
  render() {
    return (
      <>
        {window.cordova && <UpdateModal/>}
        <ConnectedRouter history={this.props.history}>
          <Routes/>
        </ConnectedRouter>
      </>
    )
  }
}

export default AppRouter;

const styles = {
  fullCenter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f9',
    justifyContent: 'center'
  }
}
