import React, { Component } from 'react';
import { Icon } from 'antd-mobile';
import { connect } from 'react-redux';
import { BaiduMap, Overlay } from 'react-baidu-maps';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import Debounce from 'lodash-decorators/debounce';
import SearchModal from '@/component/SearchModal';
import { mapLoading, mapEffects } from '@/utils';
import styles from '@/style/map.module.less';

const mapStateToProps = ({ sock }) => {
  return {
    sock,
    ...mapLoading('sock',{
      fetchTerminalLocationing: 'fetchTerminalLocation',
      fetchTerminalSocking: 'fetchTerminalSock',
      fetchSockCustomering: 'fetchSockCustomer'
    })
  }
}

const mapDispatchToProps = ({ sock }) => ({
  ...mapEffects(sock, ['fetchTerminalLocation', 'fetchTerminalSock', 'fetchSockCustomer', 'findSockCustomerByName'])
});

@connect(mapStateToProps, mapDispatchToProps)
class WharfSock extends Component {
  state = {
    center: [121.84922218322755, 30.673635005950928],
    zoom: 8,
    customerCode: undefined
  }
  overlays = []
  /* shouldComponentUpdate(prevProps) {
    return this.props.fetchTerminalLocationing !== prevProps.fetchTerminalLocationing;
  } */
  componentDidMount() { 
    this.props.fetchTerminalLocation();
    this.props.fetchSockCustomer();
  }
  handleOverlaySelected = e => {
    const { sock: { location } } = this.props;
    const locationIndex = e.target.dataset.index;
    // eslint-disable-next-line
    const { code: terminalCode, name } = location[locationIndex]; 

    this.props.history.push(`/wharf-sock-detail?customerCode=${this.state.customerCode || ''}&terminalCode=${terminalCode}&terminalName=${name}`)
    //this.props.fetchTerminalSock({terminalCode,customerCode});
  }
  componentWillUnmount() {
    this.overlays.forEach(div => {
      div.removeEventListener('touchstart', this.handleOverlaySelected, false);
    });
    this.overlays = null;
  }
  overlayConstructor = (self, params) => {
    self.point = new BMap.Point(params.point.lng, params.point.lat); // eslint-disable-line no-undef
    self.text = params.text;
    self.index = params.index;
  }
  overlayInitialize = (self, map) => {
    self.map = map;
    const div = document.createElement('div');
    div.className = styles.overlay;
    div.style.cssText='height:20px; line-height:20px; padding:0 6px';
    const span = document.createElement('span');
    span.dataset.index = self.index;
    span.appendChild(document.createTextNode(self.text));
    
    div.appendChild(span);
    map.getPanes().labelPane.appendChild(div);
    div.addEventListener('touchstart', this.handleOverlaySelected, false)
    self.div = div;
    this.overlays.push(div);
    return div;
  }
  overlayDraw = self => {
    const map = self.map;
    const pixel = map.pointToOverlayPixel(self.point);
    self.div.style.left = `${pixel.x-self.div.offsetWidth/2}px`;
    self.div.style.top = `${pixel.y-30}px`;
  }
  handleCustomerChange = customerCode => {
    this.setState({
      customerCode
    }, () => this.props.fetchTerminalLocation({customerCode}));
  }
  @Debounce(200)
  handleCustomerSearchChange = name => {
    this.props.findSockCustomerByName({name}, () => this.forceUpdate())
  }
  render(){
    // eslint-disable-next-line
    const { sock: {location,sockCustomerSlice}, fetchTerminalLocationing, history, fetchSockCustomering } = this.props;
    const { zoom, customerCode } = this.state;
    const customers = sockCustomerSlice.length ? sockCustomerSlice.map(customer => ({
      label: customer.customerName,
      brief: customer.customerCode,
      value: customer.customerCode,
      key: customer.customerCode
    })) : [];
    const createOverlayMethods = {
      customConstructor: this.overlayConstructor,
      initialize: this.overlayInitialize,
      draw: this.overlayDraw
    }
    return (
      <Screen>
        <div className={styles.mapHeader}>
          <div className={styles.mapHeaderInner}>
            <div className={styles.backButton} onClick={e => history.goBack()}>
              <Icon type='left' size='f'/>
            </div>
            <div className={styles.mapControl}>
              <div className={styles.toggleList}>
                <span>
                  <SearchModal
                    placeholder='请输入客户名称'
                    onChange={this.handleCustomerChange}
                    data={customers}
                    value={customerCode}
                    loading={fetchSockCustomering}
                    onSearchChange={this.handleCustomerSearchChange}
                  >
                    <Icon type='shaixuan' size='xs'/>
                  </SearchModal>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <BaiduMap 
          mapContainer={<div style={{ height: '100%', width: '100%' }} />} 
          zoom={zoom} 
          center={{lng:121.721133,lat:30.605635}}
          enableScrollWheelZoom
        >
          {
              fetchTerminalLocationing ? 
              <CenterLoading className='center-loading' text='码头加载中...'/> :
              location ? 
              location.map((item, index) => (
                <Overlay key={item.code} 
                  constructorParams={{
                    point: {
                      lng: item.longitude,
                      lat: item.latitude
                    },
                    text: item.name,
                    index
                  }}
                  {...createOverlayMethods}
                />
              )): null
          }
        </BaiduMap> 
      </Screen>
    )
  }
}

export default WharfSock;

