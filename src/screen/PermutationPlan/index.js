import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import { NavBar, Icon, SegmentedControl, Tabs, Card } from 'antd-mobile';
import { StickyContainer ,Sticky } from 'react-sticky';
import chunk from 'lodash/chunk';
import { mapEffects, mapLoading } from '@/utils';
import CenterLoading from '@/component/CenterLoading';
import Screen from '@/component/Screen';
import styles from './index.module.less';
import Empty from '@/component/Empty';

const GroupHeader = forwardRef((props,ref) => (
  <div ref={ref} style={{...(props.style || {})}} className={styles.headerContainer}>
    <span>{props.title}</span>
  </div>
));


const mapStateToProps = (({congestion}) => ({
  ...congestion,
  ...mapLoading('congestion', {
    fetchCongestioning: 'fecthCongestion'
  })
}));

const mapDispatchToProps = (({congestion}) => mapEffects(congestion, ['fetchCongestion']));

@connect(mapStateToProps, mapDispatchToProps)
class PermutationPlan extends Component {
  state = {
    selectedIndex:0,
    
  }
  componentDidMount() {
    this.props.fetchCongestion();
  }
  render() {
    const { history, congestions, fetchCongestioning } = this.props;
    const { selectedIndex } = this.state
    const chunkCongestions = chunk(congestions, 2);
    const days = ['今日','第二日','第三日','第四日','第五日','第六日','第七日'];
    return (
      <Screen
        zIndex="12"
        header={() => (
          <NavBar
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            码头预排计划
          </NavBar>
        )}
      >
        {
          fetchCongestioning ? 
          <CenterLoading/> :
          congestions.length ? 
          <StickyContainer>
            <Sticky>
              {
                ({style}) => (
                  <div className='p16' style={{...style, backgroundColor: '#fff', zIndex:21}}>
                    <SegmentedControl style={{height: 32}} selectedIndex={selectedIndex} values={['装船', '卸船']} onChange={e => this.setState({
                    selectedIndex: e.nativeEvent.selectedSegmentIndex
                  })}/></div>
                )
              }
            </Sticky>
            {
              chunkCongestions.map((congestion, index) => {
                return (
                  <StickyContainer
                    key={index}
                  >
                    <Sticky>
                      {
                        ({style,isSticky}) => (
                          <GroupHeader 
                            style={{...style, marginTop:isSticky ? 64 : 0}} 
                            title={`${congestion[0].terminalName}`}
                          />
                        )
                      }
                    </Sticky>
                    <div className={styles.groupBody}>
                      <div className={styles.tail}></div>
                      {
                        congestion[selectedIndex].terminalCongestion.map((item,index) => {
                          return (

                            <Card className={`${styles.timelineCard} mt12`} key={index}>
                              <div className={styles.dot} style={{borderColor: index === 0 && '#52c41a'}}></div>
                              <Card.Header
                                title={`${days[index]}(总)`}
                                extra={<><b>{item.shipQueue.length}</b>艘次 <b>{item.shipQueue.reduce((sum, ship)=>sum+(ship.exportTonTotal || ship.importTonTotal),0)}</b>吨</>}
                              />
                            </Card>
                          )
                        })
                      }
                        
                    </div>
                  </StickyContainer>
                )
              })
            }
          </StickyContainer>: <Empty/>
        }
      </Screen>
    )
  }
}

export default PermutationPlan
