import React, { PureComponent } from 'react';
import { NavBar, Icon, Tabs, Flex, PullToRefresh, ListView, ActionSheet, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import moment from 'moment';
import findIndex from 'lodash/findIndex';
import Screen from '@/component/Screen';
import { mapEffects, mapLoading } from '@/utils';
import ArrowLine from '@/component/ArrowLine';
import Empty from '@/component/Empty';
import styles from './index.less';
import card from '@/style/card.less';
import color from '@/constants/color';

const { tabsStyle } = color;

const mapStateToProps = ({ any }) => {
  return {
    ...any,
    ...mapLoading('any',{
      fetchCargoing: 'fetchCargo',
      updateCargoing: 'updateCargo',
      changeCargoToBilling: 'changeCargoToBill'
    })
  }
}

const mapDispatchToProps = ({ any }) => ({
  ...mapEffects(any, ['fetchCargo', 'updateCargo', 'changeCargoToBill'])
});


const tabs = [
  { title: '待审核', status: 30 },
  { title: '已审核', status: 40 },
  //{ title: '已拒绝', status: 90 }
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
class Cargo extends PureComponent {
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
        status: 30
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
      const originName = (item.originName && item.originName.length > 6) ? item.originName.substring(0,6) + '...' : item.originName;
      const terminalName = (item.terminalName  && item.terminalName.length > 6) ? item.terminalName.substring(0,6) + '...' : item.terminalName;
      return {
        ...item,
        originName,
        terminalName
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
  cargoService(name, payload, callback) {
    const _callback = callback ? callback : () => null;
    this.props[name](payload, _callback)
  }
  componentDidMount() {
    const { needCache: { current, status } } = this.state;
    this.cargoService('fetchCargo', {current, status} , this.callback);
  }
  handleTabChange = data => {
    const { status } = data;
    const { needCache } = this.state;
    this.setState({ firstLoading: true });
    this.cargoService('fetchCargo',{
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
    this.cargoService('fetchCargo', { status, current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, needCache } = this.state;
    let { status, hasMore } = needCache;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.cargoService('fetchCargo', { status, current: ++this.current }, data => {
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
      30: [<span style={{color: '#fa8c16'}}>拒绝</span>,'通过', '转订单', '失效', '取消'],
      40: ['转订单', '失效', '取消']
    }
    const status30Map = ['r', 'a', 'c', 'f'];
    const status40Map = ['c', 'f'];
    
    ActionSheet.showActionSheetWithOptions({
      options: map[status],
      destructiveButtonIndex: map[status].length - 2,
      cancelButtonIndex: map[status].lenght - 1,
      title: '货盘操作',
      maskClosable: true
    },
    buttonIndex => {
      if(buttonIndex < 0) return;
      const statusCode30 = status30Map[buttonIndex];
      const statusCode40 = status40Map[buttonIndex];
      const isCreate = (status === '30' && statusCode30 === 'c') || (status === '40' && statusCode40 === 'c');
      const params = isCreate ? {
        operateType: 'C'
      } : {
        statusCode: status === '30' ? status30Map[buttonIndex] : status40Map[buttonIndex]
      }
      this.cargoService(isCreate ? 'changeCargoToBill' : 'updateCargo',{
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
  renderCargoItem = (item, sectionID, rowID) => {
    return (
      <div className={card.cardItem} style={{boxShadow: '0 3px 5px -5px rgba(0,0,0,.15)'}} key={rowID} onClick={() => this.showActionSheet(item.status, item.id)}>
        <div className={card.cardItemHeader}>
          <Flex justify='between' className={card.routeName}>
            <span><b>{item.originName || '未知'}</b><i>出发地{rowID}</i></span>
            <span className={card.arrowLine}><ArrowLine/></span>
            <span><b>{item.terminalName || '未知'}</b><i>目的地</i></span>
            <span><b>{item.tonnage}</b><i>货物吨位</i></span>
          </Flex>
        </div>
        <div className={card.cardItemBody}>
          <p>货物<b>{item.cargo}({item.cargoTypeName}类)</b>, 将在<b className={styles.expireDate}>{moment(item.expireDate).format('YYYY-MM-DD')}</b>失效</p>
        </div>
        <div className={card.cardItemExtra}>
          <Flex justify='between'>
            <span><Icon type='yonghu' size='xxs'/> {item.contacts || '未知'}</span>
            <span><Icon type='dianhua' size='xxs'/> {item.contactsPhone || '未知'}</span>
            <span><Icon type='shijian' size='xxs'/> 要求{moment(item.endDate).format('YYYY-MM-DD')}</span>
          </Flex>
        </div>
      </div>
    )
  }
  renderCargoListFooter = () => {
    const { loading, hasMore } = this.state
    return (
      <div style={{ padding: 4, paddingTop: 6, textAlign: 'center' }}>
        { loading? '加载中' : ( hasMore ? '加载完成' : '没有更多了' ) }
      </div>
    )
  }
  render() {
    const { refreshing, firstLoading, needCache: { status, ds } } = this.state;
    const { history, updateCargoing, changeCargoToBilling } = this.props;
    return (
      <Screen
        className={styles.cargoScreen}
        header={() =>(
            <NavBar   
              mode='dark'
              icon={<Icon type='left' size='lg'/>}
              onLeftClick={() => history.goBack()}
            >
              货盘信息
            </NavBar>
          )
        }
      >
        <StickyContainer>
          <Sticky>
            {
              ({ style }) => (
                <div style={{...style, zIndex:10}}>
                  <div className={styles.cargoStatus} >
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
            (updateCargoing || changeCargoToBilling) ? 
            <ActivityIndicator toast text='操作中...'/> :
            null
          }
          {
            firstLoading ? 
            <ListFirstLoading/> :
            (ds && !ds.getRowCount()) ? 
            <Empty description='暂无数据'/> : 
            <ListView
              dataSource={ds}
              renderBodyComponent={() => <ListBody/>}
              renderFooter={this.renderCargoListFooter}
              renderRow={this.renderCargoItem}
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

{/*             <Empty description='暂无数据'/><div className={card.cardItem} style={{boxShadow: '0 3px 5px -5px rgba(0,0,0,.15)'}} key={item.id} onClick={() => this.showActionSheet(item.status, item.id)}>
      <div className={card.cardItemHeader}>
        <Flex justify='between' className={card.routeName}>
          <span><b>{item.originName || '未知'}</b><i>出发地</i></span>
          <span className={card.arrowLine}><ArrowLine/></span>
          <span><b>{item.terminalName || '未知'}</b><i>目的地</i></span>
          <span><b>{item.tonnage}</b><i>货物吨位</i></span>
        </Flex>
      </div>
      <div className={card.cardItemBody}>
        <p>货物<b>{item.cargo}({item.cargoTypeName}类)</b>, 将在<b className={styles.expireDate}>{moment(item.expireDate).format('YYYY-MM-DD')}</b>失效</p>
      </div>
      <div className={card.cardItemExtra}>
        <Flex justify='between'>
          <span><Icon type='yonghu' size='xxs'/> {item.contacts || '未知'}</span>
          <span><Icon type='dianhua' size='xxs'/> {item.contactsPhone || '未知'}</span>
          <span><Icon type='shijian' size='xxs'/> 要求{moment(item.endDate).format('YYYY-MM-DD')}</span>
        </Flex>
      </div>
    </div> */}

export default Cargo;