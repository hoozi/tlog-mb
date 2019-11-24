import React, { Component } from 'react';
import { Icon, Modal, Badge, Drawer, List, SearchBar } from 'antd-mobile';
import { connect } from 'react-redux';
import { BaiduMap, Marker } from 'react-baidu-maps';
import Fields from '@/component/Fields';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects } from '@/utils';
import styles from '@/style/map.module.less';
import { BRAND_COLOR } from '@/constants/color';
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
  state = {
    center: {lng:121.721133,lat:30.605635},
    visible: false,
    chineseName: '',
    mmsi: '',
    zoom: this.zoom,
    detail: {}
  }
  overlays = []
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
      this.setState({
        chineseName,
        mmsi,
        center: {lng:data.lon,lat:data.lat}
      })
    });
  }
  
  render(){
    // eslint-disable-next-line
    const { vovage, history, fetchAisAloneing } = this.props;
    const columns = [
      {
        title: '速度',
        dataIndex: 'ddhs',
      },
      {
        title: '转向率',
        dataIndex: 'rot'
      },
      /* {
        title: '扣除损耗商检量',
        dataIndex: 'feeWeight'
      }, */
      {
        title: '吃水',
        dataIndex: 'draught'
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
              vovage.ais && <Marker position={{ lng: vovage.ais.lon, lat: vovage.ais.lat }} onClick={() => this.handleShowModal(true)}/>
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
          <Fields
            columns={columns}
            data={vovage.ais}
            labelWidth={116}
          />
        </Modal>
      </Screen>
    )
  }
}

export default Vovage;

