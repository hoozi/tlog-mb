import React, { PureComponent } from 'react';
import { NavBar, Icon, Tabs, Flex, PullToRefresh, ListView, ActionSheet, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import moment from 'moment';
import findIndex from 'lodash/findIndex';
import Screen from '@/component/Screen';
import { mapEffects, mapLoading } from '@/utils';
import Empty from '@/component/Empty';
import styles from './index.less';
import list from '@/style/list.less';
import card from '@/style/card.less';
import color from '@/constants/color';

const { tabsStyle } = color;

const mapStateToProps = ({ transport }) => {
  return {
    transport,
    ...mapLoading('any',{
      fetchTransporting: 'fetchTransport',
      updateTransporting: 'updateTransport'
    })
  }
}

const mapDispatchToProps = ({ transport }) => ({
  ...mapEffects(transport, ['fetchTransport', 'updateTransport'])
});

const tabs = [
  { title: '待审核', status: 40 },
  { title: '已锁定', status: 50 },
  { title: '已打回', status: 60 }
];

/* const createStatusCode = (status, index) => {

} */

const ListBody = props => (
  <div className='am-list-body' style={{backgroundColor: '#f5f5f9'}}>{props.children}</div>
)
const ListFirstLoading = props => (
  <div style={{display: 'flex', justifyContent: 'center', marginTop: 256}}><ActivityIndicator text='列表加载中...' {...props}/></div>
) 

@connect(mapStateToProps, mapDispatchToProps)
class Transport extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.current = 1;
    this.data = []
    this.state = {
      loading: true,
      refreshing: true,
      firstLoading: true,
      needCache: {
        ds,
        hasMore: true,
        current: this.current,
        status: 40
      }
    }
  }
  reset() {
    this.current = 1;
    this.data = [];
  }
  callback = data => {
    const { recordList, pageCount } = data;
    const { needCache } = this.state;
    const ds = recordList.length > 0 ? recordList.map(item => {
      /* const originName = (item.originName && item.originName.length > 6) ? item.originName.substring(0,6) + '...' : item.originName;
      const terminalName = (item.terminalName  && item.terminalName.length > 6) ? item.terminalName.substring(0,6) + '...' : item.terminalName; */
      return {
        ...item,
       /*  originName,
        terminalName */
      }
    }) : [];
    this.data = [...this.data, ...ds];
    this.setState({
      refreshing: false,
      loading: false,
      firstLoading: false,
      needCache: {
        ...needCache,
        hasMore: this.current !== pageCount,
        ds: needCache.ds.cloneWithRows(this.data)
      }
    })
  }
  transportService(name, payload, callback) {
    const _callback = callback ? callback : () => null;
    this.props[name](payload, _callback)
  }
  componentDidMount() {
    const { needCache: { current, status } } = this.state;
    this.transportService('fetchTransport', {current, status} , this.callback);
  }
  handleTabChange = data => {
    const { status } = data;
    const { needCache } = this.state;
    this.setState({ firstLoading: true });
    this.transportService('fetchTransport',{
      status
    }, data => {
      this.reset();
      this.setState({
        needCache: {
          ...needCache,
          status
        }
      });
      this.callback(data)
    })
  }
  handleRefresh = () => {
    const { needCache } = this.state;
    const { status } = needCache;
    this.reset();
    this.setState({
      refreshing: true,
      needCache: {
        ...needCache, 
        current: this.current
      }
    });
    this.transportService('fetchTransport', { status, current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, needCache } = this.state;
    let { status, hasMore } = needCache;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.transportService('fetchTransport', { status, current: ++this.current }, data => {
      this.setState({
        needCache: {
          ...needCache,
          current: this.current,
        }
      })
      this.callback(data);
    });
  }
  showActionSheet(status, id) {
    const { needCache } = this.state
    const map = {
      40: [<span style={{color: '#fa8c16'}}>打回</span>,'锁定', '失效', '取消'],
      50: ['失效', '取消'],
      60: ['失效', '取消']
    }
    const allStatusMap = {
      40: ['60', '50', '90'],
      50: ['90'],
      60: ['90']
    }
    ActionSheet.showActionSheetWithOptions({
      options: map[status],
      destructiveButtonIndex: map[status].length - 2,
      cancelButtonIndex: map[status].lenght - 1,
      title: '运力操作',
      maskClosable: true
    },
    buttonIndex => {
      if(buttonIndex < 0) return;
      const statusCode = allStatusMap[status][buttonIndex];
      const params = {
        status: statusCode
      }
      this.transportService('updateTransport',{
        id,
        ...params
      }, () => {
        this.data = this.data.filter(item => item.id!==id)
        this.setState({
          needCache: {
            ...needCache,
            ds: needCache.ds.cloneWithRows(this.data)
          }
        });
      })
    })
  }
  renderItem = (item, sectionID, rowID) => {
    return (
      <div className={card.cardItem} style={{boxShadow: '0 3px 5px -5px rgba(0,0,0,.15)'}} key={rowID} onClick={() => this.showActionSheet(item.status, item.id)}>
        <div className={card.cardItemHeader}>
          <Flex justify='between' className={card.routeName}>
            <span><b>{item.transportName || '未知'}</b><i>运力名称</i></span>
            <span><b>{item.loadWeight || '未知'}</b><i>载重吨</i></span>
            <span><b>{item.freePlace}</b><i>空闲地</i></span>
          </Flex>
        </div>
        <div className={card.cardItemBody}>
          <p>服务商<b>{item.logisticsProvider || '未知'}</b></p>
          <p>有效期到<b className={styles.expireDate}>{moment(item.invalidateTime).format('YYYY-MM-DD')}</b>,空闲日期到<b>{moment(item.freeEndTime).format('YYYY-MM-DD')}</b></p>
        </div>
        <div className={card.cardItemExtra}>
          <Flex justify='between'>
            <span><Icon type='yonghu' size='xxs'/> {item.contact}</span>
            <span><Icon type='dianhua' size='xxs'/> {item.contactTel} </span>
            <span><Icon type='leixing' size='xxs'/> {item.transportTypeName}</span>
            {/* <span><Icon type='dianhua' size='xxs'/> </span> */}
            {/* <span><Icon type='shijian' size='xxs'/> </span> */}
          </Flex>
        </div>
      </div>
    )
  }
  renderListFooter = () => {
    const { loading, hasMore } = this.state
    return (
      <div style={{ padding: 4, paddingTop: 6, textAlign: 'center' }}>
        { loading? '加载中...' : ( hasMore ? '加载完成' : '没有更多了' ) }
      </div>
    )
  }
  render() {
    const { refreshing, firstLoading, needCache: { status, ds } } = this.state;
    const { history, updateTransporting } = this.props;
    return (
      <Screen
        className={list.listScreen}
        header={() =>(
            <NavBar   
              mode='dark'
              icon={<Icon type='left' size='lg'/>}
              onLeftClick={() => history.goBack()}
            >
              运力信息
            </NavBar>
          )
        }
      >
        <StickyContainer className={list.stickyContainer}>
          <Sticky>
            {
              ({ style }) => (
                <div style={{...style, zIndex:10}}>
                  <div className={list.listStatus} >
                    <Tabs initialPage={findIndex(tabs, tab => tab.status === status)} tabs={tabs} {...tabsStyle} onChange={this.handleTabChange}/>
                  </div>
                  {/* <div className={styles.cargoFilter}>
                    <Flex justify='between'>
                      <span><i>有效期从</i>2019-09-04<Icon type='down' size='xxs'/></span>
                      <span className={styles.pipe}>|</span>
                      <span><i>到</i>2018-08-93<Icon type='down' size='xxs'/></span>
                    </Flex>
                  </div> */}
                </div>
              )
            }
          </Sticky>
          {
            updateTransporting? 
            <ActivityIndicator toast text='操作中...'/> :
            null
          }
          {
            firstLoading ? 
            <ListFirstLoading/> :
            (ds && !ds.getRowCount()) ? 
            <Empty description='暂无货盘信息'/> : 
            <ListView
              dataSource={ds}
              renderBodyComponent={() => <ListBody/>}
              renderFooter={this.renderListFooter}
              renderRow={this.renderItem}
              onEndReachedThreshold={16}
              onEndReached={this.handleEndReached}
              useBodyScroll
              pullToRefresh={
                <PullToRefresh
                  refreshing={refreshing}
                  onRefresh={this.handleRefresh}
                />
              }
            />
          }
        </StickyContainer>
      </Screen>
    )
  }
}

export default Transport;