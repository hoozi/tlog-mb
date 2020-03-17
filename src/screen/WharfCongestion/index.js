import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { NavBar, Icon, Flex, Modal, List, Badge } from 'antd-mobile';
import { connect } from 'react-redux';
import union from 'lodash/union';
import classNames from 'classnames';
import Empty from '@/component/Empty';
import CenterLoading from '@/component/CenterLoading';
import Screen from '@/component/Screen';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.module.less';

const mapStateToProps = (({congestion}) => ({
  ...congestion,
  ...mapLoading('congestion', {
    fetchCongestioning: 'fecthCongestion'
  })
}));

const mapDispatchToProps = (({congestion}) => mapEffects(congestion, ['fetchCongestion']))

const IndexList = props => {
  const { dir='left', indexs=[{index:0, name: '测试'}], transform, style, ...restProps } = props;
  const classes = classNames(
    styles.indexList, 
    styles[`indexList${dir}`]
  );
  const indexStyle = {
    width: dir === 'left' ? 32 : 190*indexs.length,
    minHeight: dir === 'left' ? '100%' : 32,
    transform: 'translate3d(0,0,0)'
  }
  return (
    <div className={classes} style={{...indexStyle,...style,transform}} {...restProps}>
      <Flex direction={dir === 'left' ? 'column' : 'row'}>
        {
          indexs.map((item, index) => <Flex.Item key={index}>{item}</Flex.Item>)
        }
      </Flex>
    </div>
  )
}


@connect(mapStateToProps, mapDispatchToProps)
class WharfCongestion extends Component {
  page = React.createRef()
  state = {
    left:0,
    top:0,
    visible: false,
    shipQueue: []
  }
  componentDidMount() {
    const pageDom = this.pageDom = findDOMNode(this.page.current);
    this.props.fetchCongestion({}, data => {
      
    });
    pageDom.addEventListener('scroll', this.handleScroll, false)
  }
  componentWillUnmount() {
    this.pageDom.removeEventListener('scroll', this.handleScroll, false);
    this.pageDom = null;
  }
  handleScroll = e => {
    const { scrollLeft:left, scrollTop:top } = e.target;
    this.setState({
      left,
      top
    })
  }
  handleShowShipQueue = flag => {
    this.setState({
      visible: !!flag
    })
  }
  handleSelectedCongestionItem = shipQueue => {
    this.setState({
      shipQueue
    }, () => {
      this.handleShowShipQueue(true)
    })
  }
  render() {
    const { congestions, fetchCongestioning, history } = this.props;
    const wharfs = union(congestions.map(item => item.terminalName));
    const days = ['今日','第二日','第三日','第四日','第五日','第六日','第七日'];
    return (
      <Screen
        className={styles.congestionScreen}
        zIndex="12"
        header={() => (
          <NavBar
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            繁忙指数
          </NavBar>
        )}
      >
        <div className={styles.alert}>
          <ul>
            <li>
              <span className='mr12'><Badge dot style={{backgroundColor: '#6abf47', borderRadius: 2 }} /> 正常</span> 
              <span><Badge dot style={{backgroundColor: '#ff5b05', borderRadius: 2 }} /> 繁忙</span>
            </li>
            <li>拥堵指数计算规则:(当日宁波港预计抵港的船舶+发送过装船通知的船舶)/码头对应的装卸作业能力</li>
          </ul>
        </div>
        <div className={`${styles.scrollPage} full`} ref={this.page}>
          {
            fetchCongestioning ? 
            <CenterLoading/> :
            congestions.length ? 
            <>
              <IndexList dir='left' indexs={wharfs} transform={`translate3d(0px, -${this.state.top}px, 0px)`} style={{zIndex: 10}}/>
              <IndexList dir='top' indexs={days} transform={`translate3d(-${this.state.left}px, 0px, 0px)`} style={{zIndex: 9}}/>
              <div className={styles.scrollInner} style={{height: Math.ceil(congestions.length/2)*128}}>
                {
                  congestions.map((item, index) => {
                    const { loadOrUnload, terminalCongestion } = item;
                    if(terminalCongestion.length > 7) {
                      terminalCongestion.pop();
                    }
                    return (
                      <div className={styles.congestionRow} key={index}>
                        {
                          terminalCongestion.map((item, index) => {
                            const { exponent } = item;
                            return (
                              <div key={index} className={styles.congestionCol} onClick={() => this.handleSelectedCongestionItem(item.shipQueue)}>
                                <span style={{backgroundColor: exponent>=1 ? '#ff5b05' : '#6abf47'}}>{loadOrUnload ? '装' : '卸'}</span>
                                <span style={{color: exponent>=1 ? '#ff5b05' : '#6abf47'}}>{exponent}</span>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
              </div>
            </> :
            <Empty/>
          }
        </div> 
        <Modal
          popup
          visible={this.state.visible}
          onClose={() => this.handleShowShipQueue()}
          animationType='slide-up'
        >
          <h2 className='popup-list-title'>详细列表</h2>
          <List className={styles.shipList}>
            {
              this.state.shipQueue.map((item, index) => <List.Item key={index} extra={item.time}>{item.shipName}</List.Item>)
            }
          </List>
        </Modal>
      </Screen>
    )
  }
}

export default WharfCongestion;
