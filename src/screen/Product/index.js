import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import Screen from '@/component/Screen';
import RouteName from '@/component/RouteName';
import StandardList from '@/component/StandardList';
import { mapEffects } from '@/utils';
import list from '@/style/list.less';

const mapStateToProps = ({ product }) => {
  return {
    ...product
  }
}

const mapDispatchToProps = ({ product }) => ({
  ...mapEffects(product, ['fetchProduct', 'fetchMyProduct'])
});

@connect(mapStateToProps, mapDispatchToProps)
class Transport extends PureComponent {
  constructor(props) {
    super(props);
    const { location:{search} } = props;
    this.type = parse(search.substring(1))['type'];
    const extraStatus = this.type === 'any' ? { status: 'B' } : ''
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.current = 1;
    this.data = [];
    this.state = {
      loading: true,
      refreshing: true,
      firstLoading: true,
      ds,
      hasMore: true,
      current: this.current,
      ...extraStatus
    }
  }
  reset() {
    this.current = 1;
    this.data = [];
  }
  callback = data => {
    const { recordList, pageCount } = data;
    const ds = recordList.length > 0 ? recordList.map(item => ({...item})) : [];
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
  productService(payload, callback) {
    const _callback = callback ? callback : () => null;
    const serviceName = this.type === 'any' ? 'fetchProduct' : 'fetchMyProduct';
    this.props[serviceName](payload, _callback)
  }
  componentDidMount() {
    const { current, status } = this.state;
    this.productService({status,current} , this.callback);
  }
  handleRefresh = () => {
    const { status } = this.state;
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.productService({ status, current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, status, hasMore } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.productService({ status, current: ++this.current }, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  renderListCardHeader = item => (
    <RouteName
      from={item.originName}
      to={item.terminalName}
      extra={
        <>
          <b className='text-primary'>{item.bizType || '未知'}</b>
          <span>作业类型</span>
        </>
      }
    />
  )
  renderListCardBody = item => (
    <p>距离约<b>{item.mileage}</b>公里, 时长约<b>{item.days}</b>天</p>
  )
  renderListCardExtra = item => (
    <span><Icon type='yonghu' size='xxs'/> {item.contactName.trim() || '未知'},{item.contactNumber.trim() || '未知'}</span>
  )
  render() {
    const { refreshing, firstLoading, loading, ds, hasMore } = this.state;
    const { history } = this.props;
    return (
      <Screen
        className={list.listScreen}
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            {this.type === 'any' ? '物流产品' : '我的收藏'}
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
          renderListCardHeader={this.renderListCardHeader}
          renderListCardBody={this.renderListCardBody}
          renderListCardExtra={this.renderListCardExtra}
          onCardClick={item => history.push(`/product-detail?id=${this.type === 'any' ? item.id : item.productId}`)}
        />
      </Screen>
    )
  }
}

export default Transport;