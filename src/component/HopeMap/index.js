import React, { Component } from 'react';
import withRef from './HOC/withRef';
import PropTypes from 'prop-types';

@withRef
class HopeMap extends Component {
  static propTypes = {
    level: PropTypes.number,
    center: PropTypes.array,
    services: PropTypes.array
  }
  static defaultProps = {
    level: 9,
    center: [122.11029052734375, 29.78668212890625],
    services: [
      { type: 'WMTS', url: 'http://169.169.213.123:9002/map/1947250607416/MapServer' },
      { type: 'WMTS', url: 'http://169.169.213.123:9002/map/1947249447288/MapServer' }
    ]
  }
  map = React.createRef()
  componentDidUpdate(prevProps) {
    if(prevProps.center !== this.props.center) {
      this.MAP.centerAt(0, this.props.center);
    }
  }
  componentDidMount() {
    let Hope;
    const { ak, center, level, onMapClick:click, services } = this.props;
    if(!window.Hope) {
      return console.error(`没有发现时空平台的天地图，请先通过script标签在头部引入`);
    } else {
      Hope = window.Hope;
    }
    const map = this.MAP = new Hope.HMap();
    map.accessToken(ak);
    map.render({
      contianer: this.map.current,
      center,
      level,
      click
    });
    map.addLayers(services);
    this.props.setRef(map);
    this.forceUpdate();
  }
  renderChildren(children, map) {
    return React.Children.map(children, child => {
      if(child.props.children) {
        return React.cloneElement(child, null, this.renderChildren(child.props.children, map))
      }
      return React.cloneElement(child, {
        map
      })
    })
  }
  render() {
    return (
      <div 
        style={styles.container} 
        ref={this.map} 
        className={this.props.className} 
      >
        { 
          this.MAP ? 
          this.renderChildren(this.props.children, this.MAP) : null
        }
      </div>
    )
  }
}

export default HopeMap;

export { default as Overlay } from './Overlay';

const styles = {
  container: {
    width: '100%',
    height: '100%'
  }
}