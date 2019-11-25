import React, { Component } from 'react';
import { Icon, Modal, Badge, Drawer, List, SearchBar } from 'antd-mobile';
import { connect } from 'react-redux';
import { BaiduMap, Overlay } from 'react-baidu-maps';
import isEmpty from 'lodash/isEmpty';
import Fields from '@/component/Fields';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects } from '@/utils';
import styles from '@/style/map.module.less';
import Empty from '@/component/Empty';

const mapStateToProps = ({ vovage }) => {
  return {
    vovage,
    ...mapLoading('vovage',{
      fetchVovageing: 'fetchVovage',
      fetchAisAloneing: 'fetchAisAlone'
    })
  }
}

const mapDispatchToProps = ({ vovage }) => ({
  ...mapEffects(vovage, ['fetchVovage','fetchAisAlone'])
});

@connect(mapStateToProps, mapDispatchToProps)
class Vovage extends Component {
  zoom = 6
  div = null;
  state = {
    center: {lng:121.721133,lat:30.605635},
    visible: false,
    chineseName: '',
    mmsi: '',
    zoom: this.zoom,
    detail: {}
  }
  componentWillUnmount() {
    this.div.removeEventListener('touchstart', this.handleOverlaySelected, false);
    this.div = null;
  }
  handleShowModal = flag => {
    this.setState({
      visible: !!flag
    })
  }
  handleMapZoom = type => {
    const zoom = type ? (this.zoom >= 15 ? 15 : ++this.zoom) : (this.zoom <=5 ? 5 : --this.zoom);
    this.setState({
      zoom
    })
  }
  handleSearchSubmit = chineseName => {
    this.props.fetchAisAlone({chineseName}, data => {
      const mmsi = data.mmsi;
      this.setState({
        chineseName,
        mmsi,
        center: {lng:data.lon,lat:data.lat}
      })
    });
  }
  handleOverlaySelected = e => {
    this.handleShowModal(true);
    this.props.fetchVovage({chineseName: this.state.chineseName});
  }
  overlayConstructor = (self, params) => {
    self.point = new BMap.Point(params.point.lng, params.point.lat); // eslint-disable-line no-undef
    self.text = params.text;
    self.ais = params.ais;
  }
  overlayInitialize = (self, map) => {
    self.map = map;
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    const span = document.createElement('span');
    const rote = document.createElement('span');
    const ddhs = document.createElement('span');
    const draught = document.createElement('span');
    span.appendChild(document.createTextNode(self.text));
    rote.appendChild(document.createTextNode(`转向率: ${self.ais.rot}\n`));
    ddhs.appendChild(document.createTextNode(`速度: ${self.ais.ddhs}`));
    draught.appendChild(document.createTextNode(`吃水: ${self.ais.draught}`));
    fragment.appendChild(span);
    fragment.appendChild(rote);
    fragment.appendChild(ddhs);
    fragment.appendChild(draught);
    div.appendChild(fragment);
    map.getPanes().labelPane.appendChild(div);
    div.addEventListener('touchstart', this.handleOverlaySelected, false);
    div.className = styles.overlay;
    self.div = div;
    this.div = div;
    return div;
  }
  overlayDraw = self => {
    const map = self.map;
    const pixel = map.pointToOverlayPixel(self.point);
    self.div.style.left = `${pixel.x-self.div.offsetWidth/2}px`;
    self.div.style.top = `${pixel.y-self.div.offsetHeight-10}px`;
  }
  render(){
    // eslint-disable-next-line
    const { vovage, history, fetchAisAloneing, fetchVovageing } = this.props;
    const createOverlayMethods = {
      customConstructor: this.overlayConstructor,
      initialize: this.overlayInitialize,
      draw: this.overlayDraw
    }
    const columns = [
      {
        title: '英文船名',
        dataIndex: 'vesselNamee',
      },
      {
        title: '进口航次',
        dataIndex: 'importVoyage'
      },
      {
        title: '出口航次',
        dataIndex: 'exportVoyage'
      },
      {
        title: 'UN代码',
        dataIndex: 'vesselCode'
      },
      {
        title: '停靠码头',
        dataIndex: 'cpcode'
      },
      {
        title: '始发港',
        dataIndex: 'startPortCode'
      },
      {
        title: '目的港',
        dataIndex: 'destPortCode'
      },
      {
        title: '上一港',
        dataIndex: 'upPortCode'
      },
      {
        title: '下一港',
        dataIndex: 'toPortCode'
      },
      {
        title: '内外贸',
        dataIndex: 'tradeFlag'
      },
      {
        title: '预抵时间',
        dataIndex: 'preArriveTime'
      },
      {
        title: '确抵时间',
        dataIndex: 'estimatedConfirmTime'
      },
      {
        title: '预计停靠时间',
        dataIndex: 'preBerthTime'
      },
      {
        title: '预计离港时间',
        dataIndex: 'preLeaveTime'
      },
      {
        title: '离港时间',
        dataIndex: 'leaveTime'
      }
    ]
    return (
      <Screen style={{height: 'calc(100% - 44px)'}}>
        <div className={styles.searchBar}>
          <div className={styles.back} onClick={() => history.goBack()}><Icon type='left'/></div>
          <SearchBar
            placeholder='请输入中文船名'
            onSubmit={this.handleSearchSubmit}
          />
        </div>
        <div className={styles.mapHeader}>
          <div className={styles.mapHeaderInner}>
            <div className={styles.mapControl}>
              <div className={styles.zoom}>
                <span onClick={() => this.handleMapZoom(true)}>+</span>
                <span onClick={() => this.handleMapZoom(false)}>-</span>
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
          >
            {
              fetchAisAloneing ? 
              <CenterLoading className='center-loading' text='查询中...'/> : 
              vovage.ais && 
              <Overlay
                constructorParams={{
                  point: { lng: vovage.ais.lon, lat: vovage.ais.lat },
                  text: this.state.chineseName,
                  ais: vovage.ais
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
          <h2 className='popup-list-title'>{this.state.chineseName}({this.state.mmsi})</h2>
          <div className={styles.listContainer}>
            {
              fetchVovageing ? 
              <CenterLoading/> : 
              !isEmpty(vovage.vovage) ? 
              <Fields
                columns={columns}
                data={vovage.vovage}
                labelWidth={116}
              /> : 
              <Empty/>
            }
            
          </div>
        </Modal>
      </Screen>
    )
  }
}

export default Vovage;

