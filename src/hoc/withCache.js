import React, { forwardRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
export default WrappedComponent => {
  class CacheComp extends React.Component {
    getChildInstance = inst => {
      this.childInstance = inst;
    }
    componentDidMount() {
      //this.getChildInstance();
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
      const { needCache=null } = this.childInstance.state; 
      this.props.dispatch({
        type: 'cache/saveCache',
        payload: {
          [match.path]: {
            ...needCache,
            scrollTop
          }
        }
      }) 
    }
    render() {
      const { forwardRef, cache, match } = this.props;
      const parentMethods = {
        onCache: this.handleCache,
        getInstance: this.getChildInstance
      }
      const props = {
        ...this.props,
        cache: cache[match.path],
        ...parentMethods
      }
      return <WrappedComponent  ref={forwardRef} {...props}/>;
    }
  }
  const Cache = forwardRef((props, ref) => <CacheComp forwardRef={ref} {...props}/>)
  return compose(connect(({cache})=>({cache})), withRouter)(Cache);
}