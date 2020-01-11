import React, { Component } from 'react';
import { Icon, Modal, Badge, Drawer, List, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { BaiduMap, Overlay } from 'react-baidu-maps';
import Fields from '@/component/Fields';
import Screen from '@/component/Screen';
import isEmpty from 'lodash/isEmpty';
import CenterLoading from '@/component/CenterLoading';
import Debounce from 'lodash-decorators/debounce';
import SearchModal from '@/component/SearchModal';
import { mapLoading, mapEffects } from '@/utils';
import styles from '@/style/map.module.less';
import { BRAND_COLOR } from '@/constants/color';
import Empty from '@/component/Empty';
import shipPng from '@/assets/ship.png';

const mapStateToProps = ({ sock, vovage }) => {
  return {
    sock,
    vovage,
    ...mapLoading('sock',{
      fetchIntransitSocking: 'fetchIntransitSock',
      fetchSockCustomering: 'fetchSockCustomer'
    }),
    ...mapLoading('vovage',{
      fetchAisAloneing: 'fetchAisAlone'
    })
  }
}

const mapDispatchToProps = ({ sock, vovage }) => ({
  ...mapEffects(sock, ['fetchIntransitSock', 'fetchSockCustomer', 'findSockCustomerByName']),
  ...mapEffects(vovage, ['fetchAisAlone'])
});

@connect(mapStateToProps, mapDispatchToProps)
class TransportSock extends Component {
  zoom = 6
  state = {
    center: {lng:121.721133,lat:30.605635},
    visible: false,
    currentShip: {},
    detail: {},
    list: false,
    zoom: this.zoom,
    zIndex: 0,
    open: false,
    customerCode: undefined
  }
  overlays = [];
  div = null;
  componentDidMount() { 
    this.props.fetchIntransitSock();
    this.props.fetchSockCustomer();
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
    if(this.div) {
      map.getPanes().labelPane.removeChild(this.div);
      this.div.removeEventListener('touchstart', this.handleOverlaySelected, false)
      this.div = null;
    }
    //map.clearOverlays();
    self.map = map;
    const div = document.createElement('div');
    div.className = styles.ship;
    div.style.background=`url(${shipPng}) no-repeat`;
    div.style.width='32px';
    div.style.height='32px';
    map.getPanes().labelPane.appendChild(div)
    div.addEventListener('touchstart', this.handleOverlaySelected, false)
    self.div = div;
    this.div = div;
    //self.text = text;
    this.overlays.push(div);
    return div;
  }
  overlayDraw = self => {
    const map = self.map;
    const pixel = map.pointToOverlayPixel(self.point);
    self.div.style.left = `${pixel.x-self.div.offsetWidth/2}px`;
    self.div.style.top = `${pixel.y-self.div.offsetHeight}px`;
    //self.text.style.marginLeft = `-${self.text.offsetWidth/2}px`;
  }
  handleShowModal = flag => {
    this.setState({
      visible: !!flag
    })
  }
  handleOverlaySelected = e => {
    e.stopPropagation();
    this.handleShowModal(true);
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
    const { vesselExportName:chineseName } = item;
    this.setState({
      list: false,
      currentShip: {
        ...item
      },
      zIndex: 0
    }, () => {
      this.handleShowModal(true);
    });
    this.props.fetchAisAlone({chineseName}, data => {
      this.setState({
        zoom: 12,
        center: {lng:data.lon,lat:data.lat},
        currentShip: {
          longitude: data.lon,
          latitude: data.lat,
          ...item
        }
      })
    })
  }
  handleCustomerChange = customerCode => {
    this.setState({
      customerCode
    }, () => this.props.fetchIntransitSock({customerCode}));
  }
  @Debounce(200)
  handleCustomerSearchChange = name => {
    this.props.findSockCustomerByName({name}, () => this.forceUpdate())
  }
  renderTransportList = () => {
    const { sock: {transportSockList}, fetchIntransitSocking } = this.props;
    return (
      <List style={{width: 300}}>
        {
          (!fetchIntransitSocking && transportSockList.length) ? 
          transportSockList.map((item, index) => (
            <List.Item 
              key={index} 
              extra={
                <span className='text-primary'>
                  <b>{item.weight || '0'}</b>吨
                </span>
              }
              onClick={() => this.handleTransportSeleted(item)}
            >
              {item.cargoShortName}
              <List.Item.Brief>{item.vesselExportName || item.vesselImportEname || '未知'}/{item.exportVoyage || item.importVoyage || '未知'}</List.Item.Brief>
            </List.Item>
          ))
          : <Empty/>
        }
      </List>
    )
  }
  render(){
    // eslint-disable-next-line
    const { currentShip, customerCode } = this.state;
    const { sock: {transportSockList,sockCustomerSlice}, fetchIntransitSocking, history, fetchAisAloneing, fetchSockCustomering } = this.props;
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
        title: '发货人',
        dataIndex: 'customerShortName1'
      },
      {
        title: '收货人',
        dataIndex: 'customerShortName2'
      },
      /* {
        title: '扣除损耗商检量',
        dataIndex: 'weight'
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
                <div className={`${styles.toggleList} mt8`}>
                  {
                    fetchIntransitSocking ?
                    <span><ActivityIndicator size='small'/></span> : 
                    transportSockList && transportSockList.length ?
                    <span onClick={this.handleListOpenChange}>
                      <Badge text={transportSockList.length}>
                        <Icon type='liebiao' color={this.state.list ? BRAND_COLOR : ''}/>
                      </Badge>
                    </span> : null
                  }
                </div>
              }
              <div className={`${styles.toggleList} mt8`}>
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
        <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}>
          <BaiduMap 
            mapContainer={<div style={{ height: '100%', width: '100%' }} />} 
            zoom={this.state.zoom} 
            center={this.state.center}
            enableScrollWheelZoom
            ref={map => this.map = map}
          >
            {
              fetchAisAloneing ? 
              <CenterLoading className='center-loading' text='在途数据加载中...'/> : 
              
              <Overlay 
                ref={overlay => this.overlay = overlay}
                constructorParams={{
                  point: {
                    lng: currentShip.longitude,
                    lat: currentShip.latitude
                  }
                }}
                {...createOverlayMethods}
              />
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
          <h2 className='popup-list-title'>{this.state.currentShip['vesselExportName']}{this.state.currentShip['vesselExportEname'] || this.state.currentShip['vesselImportEname'] || '未知'}/{this.state.currentShip['exportVoyage'] || this.state.currentShip['importVoyage'] || '未知'}</h2>
          <Fields
            columns={columns}
            data={this.state.currentShip}
            labelWidth={116}
          />
        </Modal>
        <Drawer
          style={{zIndex:this.state.zIndex}}
          open={this.state.list}
          sidebarStyle={{backgroundColor: '#fff'}}
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

