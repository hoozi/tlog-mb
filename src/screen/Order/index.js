import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import Screen from '@/component/Screen';
import StandardList from '@/component/StandardList';
import RouteName from '@/component/RouteName';
import { Link } from 'react-router-dom';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.less';
import list from '@/style/list.less';
import card from '@/style/card.less';

const mapStateToProps = ({ order }) => {
  return {
    order,
    ...mapLoading('order',{
      fetchOrdering: 'fetchOrder'
    })
  }
}

const mapDispatchToProps = ({ order }) => ({
  ...mapEffects(order, ['fetchOrder'])
});

@connect(mapStateToProps, mapDispatchToProps)
class Order extends PureComponent {
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
      ds,
      hasMore: true,
      current: this.current
    }
  }
  reset() {
    this.current = 1;
    this.data = [];
  }
  callback = data => {
    const { recordList, pageCount } = data;
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
      ...this.state,
      refreshing: false,
      loading: false,
      firstLoading: false,
      hasMore: this.current !== pageCount,
      ds: this.state.ds.cloneWithRows(this.data)
    })
  }
  getOrder(payload, callback) {
    const _callback = callback ? callback : () => null;
    this.props.fetchOrder(payload, _callback)
  }
  componentDidMount() {
    const { current } = this.state;
    this.getOrder({current} , this.callback);
  }
  handleRefresh = () => {
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.getOrder({ current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading,  hasMore } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.getOrder({ current: ++this.current }, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  renderListCardHeader = item => (
    <RouteName
      className={styles.routeContainer}
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
      <p><b>{item.skuName}</b>，<b className='text-primary'>{item.planQuantity}</b>吨</p>
      <p>托运人<b>{item.customerName || '未知'}</b>，服务商<b>{item.carrierName || '未知'}</b></p>
    </>
  )
  /* renderListCardExtra = item => (
    <Flex justify='between'>
      <span><Icon type='yonghu' size='xxs'/> {item.contactName}</span>
      <span><Icon type='dianhua' size='xxs'/> {item.contactNumber} </span>
      <span><Icon type='leixing' size='xxs'/> {item.bizTypeName} </span>
    </Flex>
  ) */
  renderListCardFlag = item => {
    const statusMap = {
      '00': '未知',
      '10': '已创建',
      '20': '待配载',
      '30': '已配载',
      '40': '待审核',
      '50': '执行中',
      '90': '已完成'
    }
    return statusMap[item.status];
  }
  renderListCardFooter = item => {
    return (
      <Flex justify='end' className={card.buttons}>
        <Link to={`/task?id=${item.id}`}>
          <span>物流任务</span>
        </Link>
        <Link to={`/order-comment?id=${item.id}`} className={card.primary}>
          <span>订单评价</span>
        </Link>
      </Flex>
    )
  }
  render() {
    const { refreshing, firstLoading, loading, ds, hasMore } = this.state;
    const { history } = this.props;
    const renderCardMethods = {
      renderListCardHeader: this.renderListCardHeader,
      renderListCardBody: this.renderListCardBody,
      renderListCardFlag: this.renderListCardFlag,
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
          >
            订单查询
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
          {...renderCardMethods}
        />
      </Screen>
    )
  }
}

export default Order;