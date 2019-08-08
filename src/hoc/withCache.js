import React, { forwardRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
export default WrappedComponent => {
  class CacheComp extends React.Component {
    cache = null;
    handleCache = cache => {
      if(this.cache) {
        this.cache = {
          ...this.cache,
          ...cache
        }
      } else {
        this.cache = cache
      }
    }
    componentDidMount() {
      const { match, cache, history } = this.props;
      if(cache[match.path] && history.action === 'PUSH') {
        this.props.dispatch({
          type: 'cache/saveCache',
          payload: {
            [match.path]: {}
          }
        });
      }
    }
    componentWillUnmount() {
      const { match } = this.props;
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      this.props.dispatch({
        type: 'cache/saveCache',
        payload: {
          [match.path]: {
            ...this.cache,
            scrollTop
          }
        }
      }) 
    }
    render() {
      const { forwardRef, cache, match } = this.props;
      const parentMethods = {
        onCache: this.handleCache
      }
      const props = {
        ...this.props,
        cache: cache[match.path],
        ...parentMethods
      }
      return <WrappedComponent {...props} ref={forwardRef}/>;
    }
  }
  const Cache = forwardRef((props, ref) => <CacheComp forwardRef={ref} {...props}/>)
  return compose(connect(({cache})=>({cache})), withRouter)(Cache);
}