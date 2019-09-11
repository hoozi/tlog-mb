import React, { Component } from 'react';
import { Icon } from 'antd-mobile';
import { connect } from 'react-redux';
import HopeMap, { Overlay } from '@/component/HopeMap';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects } from '@/utils';
import styles from './index.less';

const mapStateToProps = ({ sock }) => {
  return {
    sock,
    ...mapLoading('sock',{
      fetchTerminalLocationing: 'fetchTerminalLocation',
      fetchTerminalSocking: 'fetchTerminalSock'
    })
  }
}

const mapDispatchToProps = ({ sock }) => ({
  ...mapEffects(sock, ['fetchTerminalLocation', 'fetchTerminalSock'])
});

@connect(mapStateToProps, mapDispatchToProps)
class WharfSock extends Component {
  state = {
    center: [121.84922218322755, 30.673635005950928]
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
    this.props.fetchTerminalLocation({customerCode: 'SG'}, data => {
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
  handleOverlaySelected = e => {
    const { sock: { location } } = this.props;
    const locationIndex = e.target.dataset.index;

    // eslint-disable-next-line
    const { code: terminalCode, name } = location[locationIndex]; 

    const customerCode = 'SG';
    this.props.fetchTerminalSock({terminalCode,customerCode});
  }
  render(){
    // eslint-disable-next-line
    const { sock: {location, sock}, fetchTerminalLocationing, fetchTerminalSocking, history } = this.props;
    return (
      <Screen >
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
            fetchTerminalLocationing ? 
            <CenterLoading className='center-loading' text='加载码头中...'/> :
            location ? 
            location.map((loc, index) => (
              <Overlay
                key={loc.code}
                className={styles.overlay}
                show
                render={{
                  position:[loc.longitude, loc.latitude],
                  content: `<div class='loc-item'><span data-index='${index}'>${loc.name}</span><span data-index='${index}'>100000</span></div>`
                }}
              />
            )) : null
          }
          
        </HopeMap>
      </Screen>
    )
  }
}

export default WharfSock;

