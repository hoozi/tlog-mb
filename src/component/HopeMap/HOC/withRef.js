import React from 'react';

export default WrappedComponent => {
  class MapHoc extends React.Component {
    _setRef = instance =>{
      const { forwardRef } = this.props;
      if(!forwardRef) return;
      if(typeof forwardRef === 'function') {
        forwardRef(instance);
      } else {
        forwardRef.current = instance;
      }
    }
    render() {
      return <WrappedComponent setRef={this._setRef} {...this.props}/>
    }
  }
  return React.forwardRef((props, ref) => <MapHoc forwardRef={ref} {...props}/>);
}