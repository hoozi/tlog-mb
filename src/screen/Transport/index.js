import React, { PureComponent } from 'react';
import { NavBar, Icon, Tabs, ListView, Flex, ActionSheet, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import moment from 'moment';
import { parse } from 'qs';
import indexOf from 'lodash/indexOf';
import findIndex from 'lodash/findIndex';
import Screen from '@/component/Screen';
import { getToken } from '@/utils/token';
import StandardList from '@/component/StandardList';
import { mapEffects, mapLoading, checkPermissions, getButtonsByPermissions } from '@/utils';
import list from '@/style/list.module.less';
import color from '@/constants/color';

const { tabsStyle } = color;

const mapStateToProps = ({ transport, common }) => {
  return {
    common,
    ...transport,
    ...mapLoading('transport',{
      updateTransporting: 'updateTransport'
    })
  }
}

const mapDispatchToProps = ({ transport }) => ({
  ...mapEffects(transport, ['fetchTransport', 'fetchAnyTransport', 'updateTransport'])
});

const allTabs = [
  { title: '已创建', status: 10 },
  { title: '待发布', status: 20 },
  { title: '已发布', status: 30 },
  { title: '待审核', status: 40 },
  { title: '已锁定', status: 50 },
  { title: '已打回', status: 60 },
  { title: '已使用', status: 70 },
  { title: '已失效', status: 90 },
]

@connect(mapStateToProps, mapDispatchToProps)
class Transport extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    const { location: {search} } = props;
    const type = this.type = parse(search.substring(1))['type'] || '';
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
    const { common: {orgs} } = this.props
    const ds = recordList.length > 0 ? recordList.map(item => {
      const filted = orgs.filter(org => org.id === item.logisticsProviderId);
      const logisticsProviderName = filted.length ? filted[0]['name'] : '';
      return {
        ...item,
        logisticsProviderName
      }
    }) : [];
    this.data = [...this.data, ...ds];
    this.setState({
      ...this.state,
      refreshing: false,
      loading: false,
      firstLoading: false,
      hasMore: this.current !== pageCount,
      ds: this.state.ds.cloneWithRows(this.data)
    })
  }
  transportService(name, payload, callback) {
    const _callback = callback ? callback : () => null;
    const serviceName = getToken() && this.type!=='more' ? name : (name === 'fetchTransport' ? 'fetchAnyTransport' : name);
    this.props[serviceName](payload, _callback)
  }
  componentDidMount() {
    const { current, status } = this.state;
    this.transportService('fetchTransport', {current, status} , this.callback);
  }
  handleTabChange = data => {
    const { status } = data;
    this.setState({ 
      ...this.state,
      firstLoading: true,
      status
    });
    this.transportService('fetchTransport',{
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
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.transportService('fetchTransport', { status, current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, status, hasMore } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.transportService('fetchTransport', { status, current: ++this.current }, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  showActionSheet(item) {
    const blackList = [10, 20, 30, 70, 90];
    const { status, id } = item;
    if(this.type === 'more' || indexOf(blackList, +status) !== -1 || !checkPermissions(['transport','transport_invalid'])) return;
    const buttonMap = {
      40: [
        {
          code: '60',
          button: <span style={{color: '#fa8c16'}}>打回</span>,
          authority: 'transport_check'
        },
        {
          code: '50',
          button: '锁定',
          authority: 'transport_check'
        },
        {
          code: '90',
          button: '失效',
          authority: 'transport_invalid'
        },
        {
          button: '取消'
        }
      ],
      50: [
        {
          code: '90',
          button: '失效',
          authority: 'transport_invalid'
        },
        {
          button: '取消'
        }
      ],
      60: [
        {
          code: '90',
          button: '失效',
          authority: 'transport_invalid'
        },
        {
          button: '取消'
        }
      ]
    }
    const currentButtons = getButtonsByPermissions(buttonMap, status);
    const names = currentButtons.map(item => item.button);
    ActionSheet.showActionSheetWithOptions({
      options: names,
      cancelButtonIndex: names.length - 1,
      destructiveButtonIndex: names.length - 2,
      title: '运力操作',
      message: '运力操作',
      maskClosable: true
    },
    buttonIndex => {
      if(buttonIndex < 0 || !currentButtons[buttonIndex].code) return;
      const statusCode = currentButtons[buttonIndex].code;
      const params = {
        status: statusCode
      }
      this.transportService('updateTransport',{
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
    <Flex justify='between'>
      <span><b>{item.transportName || '未知'}</b><i>运力名称</i></span>
      <span><b>{item.loadWeight || '未知'}</b><i>载重吨</i></span>
      <span><b>{item.freePlace}</b><i>空闲地</i></span>
    </Flex>
  )
  renderListCardBody = item => {
    return (
      <>
        <p>服务商<b>{ item.logisticsProviderName || '未知'}</b></p>
        <p>空闲日期<b>{moment(item.freeStartTime).format('YYYY-MM-DD')} ~ {moment(item.freeEndTime).format('YYYY-MM-DD')}</b></p>
      </>
    )
  }
  renderListCardExtra = item => (
    <Flex justify='between'>
      <span><Icon type='yonghu' size='xxs'/> {item.contact}</span>
      <span><Icon type='dianhua' size='xxs'/> {item.contactTel} </span>
      <span className='text-primary'><Icon type='leixing' size='xxs'/> {item.transportTypeName}</span>
    </Flex>
  )
  render() {
    const { refreshing, firstLoading, loading, status, ds, hasMore } = this.state;
    const { history, updateTransporting, location: {search}} = this.props;
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
            {`运力${!type ? '审核' : '信息'}`}
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
                      <Tabs initialPage={findIndex(allTabs, tab => tab.status === status)} tabs={allTabs} {...tabsStyle} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />} onChange={this.handleTabChange}/>
                    </div>
                  </div>
                )
              }
            </Sticky> : null
          }
          {
            updateTransporting? 
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

export default Transport;