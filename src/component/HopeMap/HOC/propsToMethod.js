export default methods => WrappedComponent =>{
  const mapInstance = WrappedComponent.prototype.getInstanceFromComponent;
  const componentDidMount = WrappedComponent.prototype.componentDidMount;
  const componentDidUpdate = WrappedComponent.prototype.componentDidUpdate;
  WrappedComponent.prototype.componentDidMount = function() {
    if(componentDidMount) {
      componentDidMount.call(this);
    }
    if(this.props.ready) {
      this.props.ready(mapInstance(this))
    }
    Object.keys(methods).forEach(key => {
      if(this.props.hasOwnProperty(key)) {
        const fn = methods[key];
        if(fn) {
          fn(mapInstance(this), this.props[key]);
        }
      }
    })
  }
  WrappedComponent.prototype.componentDidUpdate = function(prevProps, prevState) {
    if(componentDidUpdate) {
      componentDidUpdate.call(this, prevProps, prevState);
    }
    Object.keys(methods).forEach(key => {
      if(this.props.hasOwnProperty(key)) {
        const nextValue = this.props[key]
        const fn = methods[key];
        if(fn && nextValue !== prevProps[key]) {
          fn(mapInstance(this), this.props[key]);
        }
      }
    })
  }
  return WrappedComponent;
}