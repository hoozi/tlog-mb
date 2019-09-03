import React, { forwardRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
export default (WrappedComponent, functional) => {
  class CacheComp extends React.Component {
    constructor(props) {
      super(props);
      this.childInstance = null;
      this.cache = {};
    }
    getChildInstance = inst => {
      this.childInstance = inst;
    }
    handleCache = cache => {
      this.cache = {
        ...this.cache,
        ...cache
      }
    }
    componentDidMount() {
      //this.getChildInstance();
      const { match, cache, history } = this.props;
      if(cache[match.path] && history.action === 'PUSH') {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
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
      const needCache = functional ? {} : this.childInstance.state.needCache;
      this.props.dispatch({
        type: 'cache/saveCache',
        payload: {
          [match.path]: {
            scrollTop,
            ...this.props.cache[match.path],
            ...needCache,
            ...this.cache
          }
        }
      }) 
    }
    render() {
      const { forwardRef, cache, match, ...restProps } = this.props;
      const parentMethods = {
        onCache: this.handleCache,
        getInstance: this.getChildInstance
      }
      const props = {
        cache: cache[match.path],
        ...parentMethods,
        ...restProps
      }
      return <WrappedComponent  ref={forwardRef} {...props}/>;
    }
  }
  const Cache = forwardRef((props, ref) => <CacheComp forwardRef={ref} {...props}/>)
  return compose(connect(({cache})=>({cache})), withRouter)(Cache);
}