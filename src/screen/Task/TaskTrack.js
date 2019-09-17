import React, { Component } from 'react';
import { Icon, Tabs, Flex, Button } from 'antd-mobile';
import { connect } from 'react-redux';
import { Sticky, StickyContainer } from 'react-sticky';
import HopeMap from '@/component/HopeMap';
import Timeline from '@/component/Timeline';
import Screen from '@/component/Screen';
import Empty from '@/component/Empty';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects } from '@/utils';
import map from '@/style/map.less';
import styles from './index.less';

const tabs = [
  {
    title: '节点信息',
    key: 0
  },
  {
    title: '主要节点',
    key: 0
  }
]

const mapStateToProps = ({ task }) => {
  return {
    task,
    ...mapLoading('task',{
      fetchTaskTracking: 'fetchTaskTrack',
      fetchTrackNodeing: 'fetchTrackNode'
    })
  }
}

const mapDispatchToProps = ({ task }) => ({
  ...mapEffects(task, ['fetchTaskTrack', 'fetchTrackNode'])
});

@connect(mapStateToProps, mapDispatchToProps)
class WharfSock extends Component {
  state = {
    center: [121.84922218322755, 30.673635005950928]
  }
  componentDidMount() { 
    this.props.fetchTaskTrack();
    this.props.fetchTrackNode();
  }
  render(){
    // eslint-disable-next-line
    const { task: {recordList, nodes}, fetchTaskTracking, fetchTrackNodeing, history } = this.props;
    const tracks = recordList.filter(item => item.nodeTypeName);
    const mainNodes = nodes.filter(item => item.keyNode === 'true')
    return (
      <Screen className={styles.trackScreen}>
        <div className={map.mapHeader}>
          <div className={map.mapHeaderInner}>
            <div className={map.backButton} onClick={e => history.goBack()}>
              <Icon type='left' size='f'/>
            </div>
          </div>
        </div>
        <div className={styles.routeMap}>
          <HopeMap 
            ak='uiwBRkB8kW2v3VHmG1GrIywNV+Cpw4KHrit+JO2B9TM=' 
            center={this.state.center}
            level={1}
            services={[
              { type: 'WMTS', url: 'http://169.169.213.123:9002/map/1947247294712/MapServer' },
              { type: 'WMTS', url: 'http://169.169.213.123:9002/map/1947246562936/MapServer' }        
            ]}
          >
          </HopeMap>
        </div>
        <StickyContainer className={styles.nodeContainer}>
          {
            fetchTaskTracking && fetchTrackNodeing ?
            <CenterLoading/> :
            <Tabs tabs={tabs} renderTabBar={props => (
              <Sticky topOffset={200}>
                {({ style }) => (
                  <div style={{ ...style, zIndex: 10 }}>
                    <Tabs.DefaultTabBar {...props} />
                    <div style={{padding: 16}}><Button className={styles.addNode}>+ 添加节点</Button></div>
                  </div>
                )}
              </Sticky>
            )}>
              <div className={styles.nodeTabPanel}>
                { 
                  tracks.length ? 
                  <Timeline className={styles.timeline}>
                    {
                      tracks.map((item, index) => (
                        <Timeline.Item 
                          key={item.id}  
                          color={index === 0 && 'green'}
                          last={index === tracks.length-1}
                          className={index!==0 ? styles.textGray : ''}
                          time={item.nodeTime}
                        >
                          <Flex className='mb6' style={{color: index === 0 ? '#6abf47' : ''}} justify='between'>
                            <b>{item.nodeTypeName}</b>
                            <a href="">查看附件</a>
                          </Flex>
                          <p>{item.remark}</p>
                          {
                            item.nextNodeTypeName ? 
                            <p className={styles.textGray}>预计{item.nextNodeTime}【{item.nextNodeTypeName}】</p> : 
                            null
                          }
                        </Timeline.Item>
                      ))
                    }
                  </Timeline> : 
                  <Empty/>
                }
              </div>
              <div className={styles.nodeTabPanel}>
                {
                  mainNodes.length ?
                  mainNodes.map(item => <p key={item.id}>{item.name}</p>) :
                  <Empty/>
                }
              </div>
            </Tabs>
          }
          
        </StickyContainer>
       
      </Screen>
    )
  }
}

export default WharfSock;

