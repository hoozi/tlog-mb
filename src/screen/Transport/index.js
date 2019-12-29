import React, { PureComponent } from 'react';
import { NavBar, Icon, Tabs, ListView, Flex, ActionSheet, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import moment from 'moment';
import { parse } from 'qs';
import indexOf from 'lodash/indexOf';
import findIndex from 'lodash/findIndex';
import Screen from '@/component/Screen';
import Debounce from 'lodash-decorators/debounce';
import SearchModal from '@/component/SearchModal';
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
    }),
    ...mapLoading('common',{
      fetchServicering: 'fetchServicer'
    })
  }
}

const mapDispatchToProps = ({ transport, common }) => ({
  ...mapEffects(transport, ['fetchTransport', 'fetchAnyTransport', 'updateTransport']),
  ...mapEffects(common, ['fetchServicer', 'findServicerByName'])
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
    const status = +parse(search.substring(1))['status'] || -1;
    this.current = 1;
    this.data = []
    this.state = {
      customerId: undefined,
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
      ds: this.state.ds.cloneWithRows(ds.length ? this.data : [])
    })
  }
  transportService(name, payload, callback) {
    const _callback = callback ? callback : () => null;
    const serviceName = getToken() && this.type!=='more' ? name : (name === 'fetchTransport' ? 'fetchAnyTransport' : name);
    this.props[serviceName](payload, _callback)
  }
  componentDidMount() {
    const { current, status, customerId } = this.state;
    this.transportService('fetchTransport', {current, status, customerId} , this.callback);
    this.props.fetchServicer();
  }
  handleTabChange = data => {
    const { status } = data;
    this.setState({ 
      ...this.state,
      firstLoading: true,
      status
    }, () => {
      const { customerId } = this.state;
      this.transportService('fetchTransport',{
        status,
        customerId
      }, data => {
        this.reset();
        this.callback(data)
      })
    });
    
  }
  handleRefresh = () => {
    const { status, customerId } = this.state;
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.transportService('fetchTransport', { status, current: 1, customerId }, this.callback);
  }
  handleEndReached = () => {
    const { loading, status, hasMore, customerId } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.transportService('fetchTransport', { status, current: ++this.current, customerId }, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  handleCustomerChange = customerId => {
    this.reset();
    this.setState({
      customerId
    }, () => {
      this.transportService('fetchTransport', {current:1, status:this.state.status, customerId}, this.callback)
    })
  }
  @Debounce(200)
  handleCustomerSearchChange = name => {
    this.props.findServicerByName({name}, () => this.forceUpdate());
  }
  showActionSheet(item) {
    const blackList = [20, 30, 70, 90];
    const { history } = this.props;
    const { status, id } = item;
    if(
      this.type === 'more' || 
      indexOf(blackList, +status) !== -1 || 
      !checkPermissions(['transport_check','transport_invalid','transport_upload','transport_edit'])
    ) return;
    const buttonMap = {
      10: [
        {
          code: '-1',
          button: '编辑',
          authority: 'transport_edit',
          url: `/transport-create?id=${item.id}`
        },
        {
          code: '20',
          button: <span style={{color: '#3c73f0'}}>上报</span>,
          authority: 'transport_upload'
        },
        {
          button: '取消'
        }
      ],
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
    if(names.length === 1) return;
    ActionSheet.showActionSheetWithOptions({
      options: names,
      cancelButtonIndex: names.length - 1,
      destructiveButtonIndex: names.length - 2,
      title: '运力操作',
      message: '运力操作',
      maskClosable: true
    },
    buttonIndex => {
      if(currentButtons[buttonIndex].code === '-1') {
        return history.push(currentButtons[buttonIndex].url)
      }
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
    const { refreshing, firstLoading, loading, status, ds, hasMore, customerId } = this.state;
    const { history, updateTransporting, location: {search}, common, fetchServicering} = this.props;
    const { servicerSlice } = common;
    const type = parse(search.substring(1))['type'];
    const customers = servicerSlice.length ? servicerSlice.map(customer => {
      return {
        label: customer.fullName,
        brief: customer.name,
        value: customer.id,
        key: customer.id,
        ...customer
      }
    }) : [];
    return (
      <Screen
        className={list.listScreen}
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
            rightContent={
              <SearchModal
                placeholder='请输入服务商名称'
                onChange={this.handleCustomerChange}
                data={customers}
                value={customerId}
                loading={fetchServicering}
                onSearchChange={this.handleCustomerSearchChange}
              >
                <span className='light-blue'>筛选</span>
              </SearchModal>
            }
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