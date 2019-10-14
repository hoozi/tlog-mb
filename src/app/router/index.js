import React, { PureComponent, Suspense } from 'react';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ConnectedRouter } from 'connected-react-router';
import { ActivityIndicator } from 'antd-mobile';
import UpdateModal from '@/component/UpdateModal';
import routesConfig from './routesConfig';
import './screenTransition.css';
const DEFAULT_SCREEN_CONFIG = {
  enter: 'from-right',
  exit: 'to-exit'
}

const getScreenConfig = location => {
  const matchedRoute = routesConfig.find(route => new RegExp(`^${route.path}$`).test(location.pathname));
  return (matchedRoute && matchedRoute.transitionConfig) || DEFAULT_SCREEN_CONFIG;
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

export default class AppRouter extends PureComponent {
  render() {
    return (
      <>
        { window.cordova && <UpdateModal/> }
        <ConnectedRouter history={this.props.history}>
          <Routes/>
        </ConnectedRouter>
      </>
    )
  }
}

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
