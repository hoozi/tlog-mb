import React, { PureComponent } from 'react';
import { NavBar, Icon, Tabs, ListView, Flex, ActionSheet, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { StickyContainer, Sticky } from 'react-sticky';
import findIndex from 'lodash/findIndex';
import Screen from '@/component/Screen';
import RouteName from '@/component/RouteName';
import { mapEffects, mapLoading } from '@/utils';
import StandardList from '@/component/StandardList';

import list from '@/style/list.less';
import color from '@/constants/color';

const { tabsStyle } = color;

const mapStateToProps = ({ cargo }) => {
  return {
    ...cargo,
    ...mapLoading('cargo',{
      fetchCargoing: 'fetchCargo',
      updateCargoing: 'updateCargo',
      changeCargoToBilling: 'createCargo'
    })
  }
}

const mapDispatchToProps = ({ cargo }) => ({
  ...mapEffects(cargo, ['fetchCargo', 'updateCargo', 'createCargo'])
});

const tabs = [
  { title: '待审核', status: 40 },
  { title: '已锁定', status: 50 },
  { title: '已打回', status: 60 }
];

const allTabs = [
  { title: '已创建', status: 10 },
  { title: '待发布', status: 20 },
  { title: '已发布', status: 30 },
  { title: '待审核', status: 40 },
  { title: '已锁定', status: 50 },
  { title: '已打回', status: 60 },
  { title: '已受理', status: 70 },
  { title: '已失效', status: 90 },
]


@connect(mapStateToProps, mapDispatchToProps)
class Cargo extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    const { location: {search} } = props;
    const type = parse(search.substring(1))['type'] || '';
    this.current = 1;
    this.data = []
    this.state = {
      loading: true,
      refreshing: true,
      firstLoading: true,
      ds,
      hasMore: true,
      current: this.current,
      status: type ? (type === 'all' ? 10 : 30) : 40
    }
  }
  reset() {
    this.current = 1;
    this.data = [];
  }
  callback = data => {
    const { recordList, pageCount } = data;
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
    const newState = {
      ...this.state,
      refreshing: false,
      loading: false,
      firstLoading: false,
      hasMore: this.current !== pageCount,
      ds: this.state.ds.cloneWithRows(this.data)
    }
    this.setState(newState);
  }
  cargoService(name, payload, callback) {
    const _callback = callback ? callback : () => null;
    this.props[name](payload, _callback)
  }
  componentDidMount() {
    const { current, status } = this.state;
    this.cargoService('fetchCargo', {current, status} , this.callback);
  }
  handleTabChange = data => {
    const { status } = data;
    this.setState({
      ...this.state,
      firstLoading: true,
      status
    });
    this.cargoService('fetchCargo',{
      status
    }, data => {
      this.reset();
      this.callback(data)
    })
  }
  handleRefresh = () => {
    const { status } = this.state;
    this.reset();
    this.setState({
      refreshing: true,
      current: this.current
    });
    this.cargoService('fetchCargo', { status, current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, status, hasMore } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.cargoService('fetchCargo', { status, current: ++this.current }, data => {
      this.setState({
        ...this.state,
        current: this.current
      })
      this.callback(data);
    });
  }
  showActionSheet(item) {
    const { location: {search} } = this.props;
    const type = parse(search.substring(1))['type'] || '';
    if(type) return;
    const { status, id } = item;
    const map = {
      40: [<span style={{color: '#fa8c16'}}>打回</span>,'锁定', '转订单', '失效', '取消'],
      50: ['转订单', '失效', '取消'],
      60: ['失效', '取消']
    }
    const allStatusMap = {
      40: ['60', '50', 'c', '90'],
      50: ['c', '90'],
      60: ['90']
    }
    ActionSheet.showActionSheetWithOptions({
      options: map[status],
      destructiveButtonIndex: map[status].length - 2,
      cancelButtonIndex: map[status].lenght - 1,
      title: '货盘操作',
      maskClosable: true
    },
    buttonIndex => {
      if(buttonIndex < 0) return;
      const statusCode = allStatusMap[status][buttonIndex];
      const isCreate = statusCode === 'c';
      const params = isCreate ? {
        operateType: 'C',
        message: '转订单成功'
      } : {
        status: statusCode
      }
      this.cargoService(isCreate ? 'createCargo' : 'updateCargo',{
        id,
        ...params
      }, () => {
        this.data = this.data.filter(item => item.id!==id)
        this.setState({
          ...this.state,
          ds: this.state.ds.cloneWithRows(this.data)
        });
      })
    })
  }
  renderListCardHeader = item => (
    <RouteName
      from={item.originName}
      to={item.terminalName}
      extra={
        <>
          <b className='text-primary'>{item.tonnage || '未知'}</b>
          <span>货物吨位</span>
        </>
      }
    />
  )
  renderListCardBody = item => (
    <>
      <p>客户<b>{item.customerName}</b>, 【{item.cargoTypeName}】<b>{item.cargo}</b></p>
    </>
  )
  renderListCardExtra = item => (
    <Flex justify='between'>
      <span><Icon type='yonghu' size='xxs'/> {item.contacts.trim() || '未知'}/{item.contactsPhone.trim() || '未知'}</span>
    </Flex>
  )
  render() {
    const { refreshing, firstLoading, loading, status, ds, hasMore  } = this.state;
    const { history, updateCargoing, changeCargoToBilling, location: {search} } = this.props;
    const type = parse(search.substring(1))['type'];
    return (
      <Screen
        className={list.listScreen}
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            {`货盘${!type ? '审核' : '信息'}`}
          </NavBar>
        )}
      >
        <StickyContainer className={list.stickyContainer}>
          {
            !type || (type && type === 'all') ? 
            <Sticky>
              {
                ({ style }) => (
                  <div style={{...style, zIndex:10}}>
                    <div className={list.listStatus} >
                      <Tabs initialPage={findIndex(tabs, tab => tab.status === status)} tabs={(type && type === 'all') ? allTabs : tabs} {...tabsStyle} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />} onChange={this.handleTabChange}/>
                    </div>
                  </div>
                )
              }
            </Sticky> : null
          }
          {
            (updateCargoing || changeCargoToBilling) ? 
            <ActivityIndicator toast text='操作中...'/> :
            null
          }
          <StandardList
            dataSource={ds}
            onEndReached={this.handleEndReached}
            onRefresh={this.handleRefresh}
            loading={loading}
            refreshing={refreshing}
            firstLoading={firstLoading}
            hasMore={hasMore}
            renderListCardHeader={this.renderListCardHeader}
            renderListCardBody={this.renderListCardBody}
            renderListCardExtra={this.renderListCardExtra}
            onCardClick={item => this.showActionSheet(item)}
          />
        </StickyContainer>
      </Screen>
    )
  }
}

export default Cargo;