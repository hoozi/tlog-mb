import React, { Component } from 'react';
import { Icon, Modal } from 'antd-mobile';
import { connect } from 'react-redux';
import HopeMap, { Overlay } from '@/component/HopeMap';
import Fields from '@/component/Fields';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects } from '@/utils';
import styles from '@/style/map.less';

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
    center: [121.84922218322755, 30.673635005950928],
    visible: false,
    detail: {}
  }
  timer = null;
  locationItems = null;
  removeAndAddEvent(type) {
    this.locationItems = document.querySelectorAll('.loc-item')
    this.locationItems.forEach(item => {
      item[`${type}EventListener`]('click', this.handleOverlaySelected, true)
    });
  }
  componentDidMount() { 
    this.props.fetchIntransitSock({}, data => {
      this.setState({
        center: [data[0].longitude, data[0].latitude]
      })
      this.timer = setTimeout(() => {
       this.removeAndAddEvent('add')
      }, 16)
    });
  }
  componentWillUnmount() {
    this.timeer && clearTimeout(this.timer);
    this.removeAndAddEvent('remove');
    this.locationItems = null;
  }
  handleShowModal = flag => {
    this.setState({
      visible: !!flag
    })
  }
  handleOverlaySelected = e => {
    const { sock: { list } } = this.props;
    const transportIndex = e.target.dataset.index;
    //const { code: terminalCode, name } = list[transportIndex];
    this.handleShowModal(true);
    this.setState({
      detail: list[transportIndex]
    })
    //console.log(list[transportIndex])
  }
  render(){
    // eslint-disable-next-line
    const { sock: {list}, fetchIntransitSocking, history } = this.props;
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
        <HopeMap 
          ak='uiwBRkB8kW2v3VHmG1GrIywNV+Cpw4KHrit+JO2B9TM=' 
          center={this.state.center}
          level={1}
          services={[
            { type: 'WMTS', url: 'http://169.169.213.123:9002/map/1947247294712/MapServer' },
            { type: 'WMTS', url: 'http://169.169.213.123:9002/map/1947246562936/MapServer' }        
          ]}
        >
          {
            fetchIntransitSocking ? 
            <CenterLoading className='center-loading' text='在途数据加载中...'/> :
            list ? 
            list.map((item, index) => (
              <Overlay
                key={item.vesselExportSysid}
                className={styles.ship}
                show
                render={{
                  position:[item.longitude, item.latitude],
                  content: `<div class='loc-item' data-index=${index}>${item.vesselExportEname}</div>`
                }}
              />
            )) : null
          }
        </HopeMap>
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

