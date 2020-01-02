import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import Screen from '@/component/Screen';
import SearchModal from '@/component/SearchModal';
import Debounce from 'lodash-decorators/debounce';
import StandardList from '@/component/StandardList';
import RouteName from '@/component/RouteName';
import { Link } from 'react-router-dom';
import { mapEffects, mapLoading } from '@/utils';
import card from '@/style/card.module.less';
import list from '@/style/list.module.less';

const mapStateToProps = ({ task, common }) => {
  return {
    task,
    common,
    ...mapLoading('task',{
      fetchTasking: 'fetchTask'
    }),
    ...mapLoading('common',{
      fetchServicering: 'fetchServicer'
    })
  }
}

const mapDispatchToProps = ({ task, common }) => ({
  ...mapEffects(task, ['fetchTask']),
  ...mapEffects(common, ['fetchServicer', 'findServicerByName'])
});

@connect(mapStateToProps, mapDispatchToProps)
class Task extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.current = 1;
    this.data = [];
    this.orderId = undefined;
    this.state = {
      customerId: undefined,
      loading: true,
      refreshing: true,
      firstLoading: true,
      ds,
      hasMore: true,
      orderId: this.orderId,
      current: this.current
    }
  }
  reset() {
    this.current = 1;
    this.data = [];
  }
  callback = data => {
    //const { recordList, pageCount } = data;
    const ds = data.length > 0 ? data.map(item => ({...item})) : [];
    this.data = [...this.data, ...ds];
    this.setState({
      ...this.state,
      refreshing: false,
      orderId: this.orderId,
      loading: false,
      firstLoading: false,
      hasMore: false,
      ds: this.state.ds.cloneWithRows(this.data)
    })
  }
  getTask(payload, callback) {
    const _callback = callback ? callback : () => null;
    this.props.fetchTask(payload, _callback)
  }
  componentDidMount() {
    const { location:{search} } = this.props;
    const orderId = this.orderId = parse(search.substring(1))['id'];
    const { current } = this.state;
    this.getTask({current, orderId, operateType:'lastNode'} , this.callback);
    this.props.fetchServicer();
  }
  handleRefresh = () => {
    const { orderId, customerId } = this.state
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.getTask({ current: 1, orderId, operateType:'lastNode', customerId}, this.callback);
  }
  handleEndReached = () => {
    const { loading,  hasMore, orderId, customerId} = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.getTask({ current: ++this.current, orderId, operateType:'lastNode',customerId }, data => {
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
      const { orderId } = this.state
      this.getTask({current:1, customerId, orderId, operateType:'lastNode'}, this.callback)
    })
  }
  @Debounce(200)
  handleCustomerSearchChange = name => {
    this.props.findServicerByName({name}, () => this.forceUpdate());
  }
  renderListCardHeader = item => (
    <RouteName
      from={item.loadName}
      to={item.unloadName}
      extra={
        <>
          <b className='text-primary'>{item.bizTypeName || '未知'}</b>
          <span>作业类型</span>
        </>
      }
    />
  )
  renderListCardBody = item => (
    <>
      <p>作业量<b className='text-primary'>{item.planQuantity}</b>吨</p>
      <p>运输工具<b>{item.vesselChineseName.trim() || '未知'}</b>，船长<b>{item.shipLength || '0'}</b>，吃水<b>{item.shipDraught || '0'}</b>，载重吨<b>{item.shipLoad || '0'}</b></p>
    </>
  )
  renderListCardExtra = item => (
    <Flex justify='between'>
      <span><Icon type='yonghu' size='xxs'/> {item.contactName}</span>
      <span><Icon type='dianhua' size='xxs'/> {item.contactNumber} </span>
      <span><Icon type='leixing' size='xxs'/> {item.bizTypeName} </span>
    </Flex>
  )
  renderListCardFooter = item => {
    return (
      <Flex justify='end' className={card.buttons}>
        <Link to={`/task-track?id=${item.id}`} className={card.primary}>
          <span>物流跟踪</span>
        </Link>
      </Flex>
    )
  }
  renderListCardFlag = item => {
    const statusMap = {
      '00': '未知',
      '10': '已创建',
      '20': '待配载',
      '25': '配载中',
      '30': '已配载',
      '40': '待审核',
      '50': '执行中',
      '60': '已打回',
      '90': '已完成|#6abf47'
    }
    return statusMap[item.status];
  }
  render() {
    const { refreshing, firstLoading, loading, ds, hasMore, customerId } = this.state;
    const { history, common, fetchServicering } = this.props;
    const { servicerSlice } = common;
    const customers = servicerSlice.length ? servicerSlice.map(customer => {
      return {
        label: customer.fullName,
        brief: customer.name,
        value: customer.id,
        key: customer.id,
        ...customer
      }
    }) : [];
    const renderCardMethods = {
      renderListCardHeader: this.renderListCardHeader,
      renderListCardBody: this.renderListCardBody,
      //renderListCardFlag: this.renderListCardFlag,
      renderListCardFooter: this.renderListCardFooter
    }
    return (
      <Screen
        className={list.listScreen}
        fixed
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
            物流任务
          </NavBar>
        )}
      >
        <StandardList
          dataSource={ds}
          onEndReached={this.handleEndReached}
          onRefresh={this.handleRefresh}
          loading={loading}
          refreshing={refreshing}
          firstLoading={firstLoading}
          hasMore={hasMore}
          onCardClick={item => this.props.history.push(`/task-detail?id=${item.id}`)}
          {...renderCardMethods}
        />
      </Screen>
    )
  }
}

export default Task;