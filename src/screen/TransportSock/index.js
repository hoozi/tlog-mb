import React, { Component } from 'react';
import { Icon, Modal } from 'antd-mobile';
import { connect } from 'react-redux';
import { BaiduMap, Overlay } from 'react-baidu-maps';
import Fields from '@/component/Fields';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects } from '@/utils';
import styles from '@/style/map.module.less';

const mapStateToProps = ({ sock }) => {
  return {
    sock,
    ...mapLoading('sock',{
      fetchIntransitSocking: 'fetchIntransitSock'
    })
  }
}

const mapDispatchToProps = ({ sock }) => ({
  ...mapEffects(sock, ['fetchIntransitSock'])
});

@connect(mapStateToProps, mapDispatchToProps)
class WharfSock extends Component {
  state = {
    center: {lng:121.721133,lat:30.605635},
    visible: false,
    detail: {}
  }
  overlays = []
  removeAndAddEvent(type) {
    this.locationItems = document.querySelectorAll('.loc-item')
    this.locationItems.forEach(item => {
      item[`${type}EventListener`]('click', this.handleOverlaySelected, true)
    });
  }
  componentDidMount() { 
    this.props.fetchIntransitSock({}, data => {
      this.setState({
        center: {lng:data[0].longitude,lat:data[0].latitude}
      });
    });
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
    self.extra = params.extra;
  }
  overlayInitialize = (self, map) => {
    self.map = map;
    const div = document.createElement('div');
    div.className = styles.ship;
    const text = document.createElement('div');
    text.className = 'loc-item'
    text.dataset.index = self.index;
    text.innerHTML = `${self.text}<br/>${self.extra}`
    div.appendChild(text);
    map.getPanes().labelPane.appendChild(div);
    div.addEventListener('touchstart', this.handleOverlaySelected, false)
    self.div = div;
    self.text = text;
    this.overlays.push(div);
    return div;
  }
  overlayDraw = self => {
    const map = self.map;
    const pixel = map.pointToOverlayPixel(self.point);
    self.div.style.left = `${pixel.x-self.div.offsetWidth/2}px`;
    self.div.style.top = `${pixel.y-self.div.offsetHeight/2}px`;
    self.text.style.marginLeft = `-${self.text.offsetWidth/2}px`
  }
  handleShowModal = flag => {
    this.setState({
      visible: !!flag
    })
  }
  handleOverlaySelected = e => {
    const { sock: { list } } = this.props;
    const transportIndex = e.target.dataset.index;
    this.handleShowModal(true);
    this.setState({
      detail: list[transportIndex]
    });
  }
  render(){
    // eslint-disable-next-line
    const { sock: {list}, fetchIntransitSocking, history } = this.props;
    const createOverlayMethods = {
      customConstructor: this.overlayConstructor,
      initialize: this.overlayInitialize,
      draw: this.overlayDraw
    }
    const columns = [
      {
        title: '货名',
        dataIndex: 'cargoShortName',
      },
      {
        title: '重量',
        dataIndex: 'weight'
      },
      {
        title: '扣除损耗商检量',
        dataIndex: 'feeWeight'
      },
      {
        title: '上一港',
        dataIndex: 'portName1'
      },
      {
        title: '下一港',
        dataIndex: 'portName2'
      },
      {
        title: '计划靠泊',
        dataIndex: 'plnDpdTime'
      },
      {
        title: '计划离泊',
        dataIndex: 'plnLevTime'
      },
      {
        title: '实际靠泊',
        dataIndex: 'actDpdTime'
      },
      {
        title: '实际离泊',
        dataIndex: 'actLevTime'
      },
      {
        title: '备注',
        dataIndex: 'notes'
      }
    ]
    return (
      <Screen>
        <div className={styles.mapHeader}>
          <div className={styles.mapHeaderInner}>
            <div className={styles.backButton} onClick={e => history.goBack()}>
              <Icon type='left' size='f'/>
            </div>
          </div>
        </div>
        <BaiduMap 
          mapContainer={<div style={{ height: '100%', width: '100%' }} />} 
          zoom={7} 
          center={this.state.center}
          enableScrollWheelZoom
        >
          {
            fetchIntransitSocking ? 
            <CenterLoading className='center-loading' text='在途数据加载中...'/> :
            list ? 
            list.map((item, index) => (
              <Overlay key={item.vesselExportEname} 
                  constructorParams={{
                    point: {
                      lng: item.longitude,
                      lat: item.latitude
                    },
                    text: `运输工具: ${item.vesselExportEname}/${item.exportVoyage}`,
                    extra:  `货物: ${item.cargoShortName},${item.feeWeight}吨`,
                    index
                  }}
                  {...createOverlayMethods}
                />
            )) : null
          }
        </BaiduMap>
        <Modal
          visible={this.state.visible}
          popup
          animationType='slide-up'
          onClose={() => this.handleShowModal()}
          afterClose={() => document.documentElement.style.overflow=''}
        >
          <h2 className='popup-list-title'>{this.state.detail['vesselExportEname']}/{this.state.detail['exportVoyage']}</h2>
          <Fields
            columns={columns}
            data={this.state.detail}
            labelWidth={116}
          />
        </Modal>
      </Screen>
    )
  }
}

export default WharfSock;

