import { PureComponent } from 'react';
import withRef from '../HOC/withRef';
import propsToMethod from '../HOC/propsToMethod';
const Hope = window.Hope;

@withRef
@propsToMethod({
  render: (instance, options) => instance.render(options),
  className: (instance, options) => instance.addClass(options),
  show: (instance, options) => options ? instance.show() : instance.hide(),
  style: (instance, options) => instance.setStyle(options)
})
class HopeOverlay extends PureComponent {
  getInstanceFromComponent(component) {
    return component.overlay;
  }
  shouldComponentUpdate() {
    return !this.overlay;
  }
  componentDidMount() {
    const { map } = this.props;
    const overlay = this.overlay = new Hope.HOverlay(map);
    this.props.setRef(overlay);
  }
  render() {
    return null;
  }
  componentWillMount() {
    this.overlay && this.overlay.destroy();
    this.overlay = null;
  }
}

export default HopeOverlay;
