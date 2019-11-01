import React, { PureComponent } from 'react';
import { NavBar, Icon, Tabs, ListView, Flex, ActionSheet, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { StickyContainer, Sticky } from 'react-sticky';
import { getToken } from '@/utils/token';
import findIndex from 'lodash/findIndex';
import indexOf from 'lodash/indexOf';
import Screen from '@/component/Screen';
import RouteName from '@/component/RouteName';
import { mapEffects, mapLoading, checkPermissions, getButtonsByPermissions } from '@/utils';
import StandardList from '@/component/StandardList';

import list from '@/style/list.module.less';
import color from '@/constants/color';

const { tabsStyle } = color;

const mapStateToProps = ({ cargo }) => {
  return {
    ...cargo,
    ...mapLoading('cargo',{
      updateCargoing: 'updateCargo',
      changeCargoToBilling: 'createCargo'
    })
  }
}

const mapDispatchToProps = ({ cargo }) => ({
  ...mapEffects(cargo, ['fetchCargo', 'fetchAnyCargo', 'updateCargo', 'createCargo'])
});


const allTabs = [
  { title: '已创建', status: 10 },
  { title: '待发布', status: 20 },
  { title: '已发布', status: 30 },
  { title: '待审核', status: 40 },
  { title: '已锁定', status: 50 },
  { title: '已打回', status: 60 },
  { title: '已受理', status: 70 },
  { title: '已失效', status: 90 }
]

@connect(mapStateToProps, mapDispatchToProps)
class Cargo extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    const { location: {search} } = props;
    const type = this.type = parse(search.substring(1))['type'] || '';
    const status = +parse(search.substring(1))['status'] || -1;
    this.current = 1;
    this.data = [];
    this.state = {
      loading: true,
      refreshing: true,
      firstLoading: true,
      ds,
      hasMore: true,
      current: this.current,
      status: type ? (type === 'all' ? 10 : 30) : status
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
    const serviceName = getToken() && this.type!=='more' ? name : (name === 'fetchCargo' ? 'fetchAnyCargo' : name);
    this.props[serviceName](payload, _callback)
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
    const blackList = [20, 30, 70, 90];
    const { history } = this.props
    const { status, id } = item;
    if(
      this.type === 'more' || 
      indexOf(blackList, +status) !== -1 || 
      !checkPermissions(['cargo_check','change_bill','cargo_invalid','cargo_upload','cargo_edit'])
    ) return; 
    const buttonMap = {
      10: [
        {
          code: '-1',
          button: '编辑',
          authority: 'cargo_edit',
          url: `/cargo-create?id=${item.id}`
        },
        {
          code: '20',
          button: <span style={{color: '#3c73f0'}}>上报</span>,
          authority: 'cargo_upload'
        },
        {
          button: '取消'
        }
      ],
      40: [
        {
          code: '60',
          button: '打回',
          authority: 'cargo_check'
        },
        {
          code: '50',
          button: '锁定',
          authority: 'cargo_check'
        },
        {
          code: 'c',
          button: '转订单',
          authority: 'change_bill'
        },
        {
          code: '90',
          button: '失效',
          authority: 'cargo_invalid'
        },
        {
          button: '取消'
        }
      ],
      50: [
        {
          code: 'c',
          button: '转订单',
          authority: 'change_bill'
        },
        {
          code: '90',
          button: '失效',
          authority: 'cargo_invalid'
        },
        {
          button: '取消'
        }
      ],
      60: [
        {
          code: '90',
          button: '失效',
          authority: 'cargo_invalid'
        },
        {
          button: '取消'
        }
      ]
    }
    const currentButtons = getButtonsByPermissions(buttonMap, status);
    const names = currentButtons.map(item => item.button);
    if(names.length === 1) return;
    ActionSheet.showActionSheetWithOptions({
      options: names,
      cancelButtonIndex: names.length - 1,
      destructiveButtonIndex: names.length - 2,
      title: '货盘操作',
      message: '货盘操作',
      maskClosable: true
    },
    buttonIndex => {
      if(currentButtons[buttonIndex].code === '-1') {
        return history.push(currentButtons[buttonIndex].url)
      }
      if(buttonIndex < 0 || !currentButtons[buttonIndex].code) return;
      const statusCode = currentButtons[buttonIndex].code;
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
          <b className='text-primary'>{item.operationTypeName || '未知'}</b>
          <span>作业类型</span>
        </>
      }
    />
  )
  renderListCardBody = item => (
    <>
      <p>托运人<b>{item.customerName}</b></p>
      <p>货名<b>{item.cargo}</b>,<b className='text-primary'>{item.tonnage || '0'}</b>吨</p>
    </>
  )
  renderListCardExtra = item => (
    <Flex justify='between'>
      <span><Icon type='yonghu' size='xxs'/> {item.contacts.trim() || '未知'},{item.contactsPhone.trim() || '未知'}</span>
    </Flex>
  )
  render() {
    const { refreshing, firstLoading, loading, status, ds, hasMore  } = this.state;
    const { history, updateCargoing, changeCargoToBilling } = this.props;
    return (
      <Screen
        className={list.listScreen}
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            {`货盘${!this.type ? '审核' : '信息'}`}
          </NavBar>
        )}
      >
        <StickyContainer className={list.stickyContainer}>
          {
            !this.type || (this.type && this.type === 'all') ? 
            <Sticky>
              {
                ({ style }) => (
                  <div style={{...style, zIndex:10}}>
                    <div className={list.listStatus} >
                      <Tabs initialPage={findIndex(allTabs, tab => tab.status === status)} tabs={allTabs} {...tabsStyle} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />} onChange={this.handleTabChange}/>
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