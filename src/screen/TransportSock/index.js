import React, { Component } from 'react';
import { Icon, Modal, Badge, Drawer, List } from 'antd-mobile';
import { connect } from 'react-redux';
import { BaiduMap, Overlay } from 'react-baidu-maps';
import Fields from '@/component/Fields';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects } from '@/utils';
import styles from '@/style/map.module.less';
import { BRAND_COLOR } from '@/constants/color';
import Empty from '@/component/Empty';

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
class TransportSock extends Component {
  zoom = 6
  state = {
    center: {lng:121.721133,lat:30.605635},
    visible: false,
    detail: {},
    list: false,
    zoom: this.zoom,
    zIndex: 0,
    open: false
  }
  overlays = []
  componentDidMount() { 
    this.props.fetchIntransitSock({}, data => {
      this.setState({
        //center: {lng:data[0].longitude,lat:data[0].latitude}
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
    div.dataset.index = self.index;
    const text = document.createElement('div');
    text.className = 'loc-item';
    text.dataset.index = self.index;
    text.innerHTML = `${self.text}<br/>${self.extra}`;
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
    self.text.style.marginLeft = `-${self.text.offsetWidth/2}px`;
  }
  handleShowModal = flag => {
    this.setState({
      visible: !!flag
    })
  }
  handleOverlaySelected = e => {
    const target = e.target;
    const { sock: { list } } = this.props;
    const transportIndex = target.dataset.index;
    let zIndex = target.style.zIndex || 1;
    target.style.zIndex = ++zIndex;
    console.log(1)
    this.handleShowModal(true);
    this.setState({
      detail: list[transportIndex]
    });
  }
  handleMapZoom = type => {
    const zoom = type ? (this.zoom >= 15 ? 15 : ++this.zoom) : (this.zoom <=5 ? 5 : --this.zoom);
    this.setState({
      zoom
    })
  }
  handleListOpenChange = () => {
    this.setState({
      list: !this.state.list,
      zIndex: !this.state.list ? 10 : 0
    })
  }
  handleTransportSeleted = item => {
    const { longitude, latitude } = item;
    console.log([longitude, latitude])
    this.setState({
      center: {lng:longitude,lat:latitude},
      list: false,
      visible: true,
      detail: item,
      zIndex: 0
    })
  }
  renderTransportList = () => {
    const { sock: {list} } = this.props;
    return (
      <List style={{width: 300}}>
        {
          list.length ? 
          list.map(item => (
            <List.Item 
              key={`lng${item.longitude}_lat${item.latitude}`} 
              extra={
                <span className='text-primary'>
                  <b>{item.weight || '0'}</b>吨
                </span>
              }
              onClick={() => this.handleTransportSeleted(item)}
            >
              {item.cargoShortName}
              <List.Item.Brief>{item.vesselExportEname || item.vesselImportEname || '未知'}/{item.exportVoyage || item.importVoyage || '未知'}</List.Item.Brief>
            </List.Item>
          ))
          : <Empty/>
        }
      </List>
    )
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
      /* {
        title: '扣除损耗商检量',
        dataIndex: 'feeWeight'
      }, */
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
            <div className={styles.mapControl}>
              <div className={styles.zoom}>
                <span onClick={() => this.handleMapZoom(true)}>+</span>
                <span onClick={() => this.handleMapZoom(false)}>-</span>
              </div>
              {
                list && list.length ? 
                <div className={styles.toggleList}>
                  <span className='mt8' onClick={this.handleListOpenChange}>
                    <Badge text={list.length}>
                      <Icon type='liebiao' color={this.state.list ? BRAND_COLOR : ''}/>
                    </Badge>
                  </span>
                </div> : null
              }
            </div>
          </div>
        </div>
        <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}>
          <BaiduMap 
            mapContainer={<div style={{ height: '100%', width: '100%' }} />} 
            zoom={this.state.zoom} 
            center={this.state.center}
            enableScrollWheelZoom
          >
            {
              fetchIntransitSocking ? 
              <CenterLoading className='center-loading' text='在途数据加载中...'/> :
              list ? 
              list.map((item, index) => (
                <Overlay key={`lng${item.longitude}_lat${item.latitude}`} 
                    constructorParams={{
                      point: {
                        lng: item.longitude,
                        lat: item.latitude
                      },
                      text: `运输工具: ${item.vesselExportEname || item.vesselImportEname || '未知'}/${item.exportVoyage || item.importVoyage || '未知'}`,
                      extra:  `货物: ${item.cargoShortName},${item.weight || '0'}吨`,
                      index
                    }}
                    {...createOverlayMethods}
                  />
              )) : null
            }
          </BaiduMap>
        </div>
        <Modal
          visible={this.state.visible}
          popup
          animationType='slide-up'
          onClose={() => this.handleShowModal()}
          afterClose={() => document.documentElement.style.overflow=''}
        >
          <h2 className='popup-list-title'>{this.state.detail['vesselExportEname'] || this.state.detail['vesselImportEname'] || '未知'}/{this.state.detail['exportVoyage'] || this.state.detail['importVoyage'] || '未知'}</h2>
          <Fields
            columns={columns}
            data={this.state.detail}
            labelWidth={116}
          />
        </Modal>
        <Drawer
          style={{zIndex:this.state.zIndex}}
          open={this.state.list}
          onOpenChange={this.handleListOpenChange}
          sidebar={this.renderTransportList()}
          position='right'
        >
          <span></span>
        </Drawer>
      </Screen>
    )
  }
}

export default TransportSock;

