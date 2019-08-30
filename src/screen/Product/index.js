import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView } from 'antd-mobile';
import { connect } from 'react-redux';
import Screen from '@/component/Screen';
import RouteName from '@/component/RouteName';
import StandardList from '@/component/StandardList';
import { mapEffects, mapLoading } from '@/utils';
import list from '@/style/list.less';

const mapStateToProps = ({ product }) => {
  return {
    ...product,
    ...mapLoading('product',{
      fetchProducting: 'fetchProduct'
    })
  }
}

const mapDispatchToProps = ({ product }) => ({
  ...mapEffects(product, ['fetchProduct'])
});

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
      ds,
      hasMore: true,
      current: this.current,
      status: 'B'
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
  productService(name, payload, callback) {
    const _callback = callback ? callback : () => null;
    this.props[name](payload, _callback)
  }
  componentDidMount() {
    const { current, status } = this.state;
    this.productService('fetchProduct', {status,current} , this.callback);
  }
  handleRefresh = () => {
    const { status } = this.state;
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.productService('fetchProduct', { status, current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, status, hasMore } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.productService('fetchProduct', { status, current: ++this.current }, data => {
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
          <b className='text-primary'>{item.bizTypeName || '未知'}</b>
          <span>作业类型</span>
        </>
      }
    />
  )
  renderListCardBody = item => (
    <p>距离约<b>{item.mileage}</b>公里, 时长约<b>{item.days}</b>天</p>
  )
  /* renderListCardExtra = item => (
    <Flex justify='between'>
      <span><Icon type='yonghu' size='xxs'/> {item.contact}</span>
      <span><Icon type='dianhua' size='xxs'/> {item.contactTel} </span>
      <span className='text-primary'><Icon type='leixing' size='xxs'/> {item.transportTypeName}</span>
    </Flex>
  ) */
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
            物流产品
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
          onCardClick={item => history.push(`/product-detail?id=${item.id}`)}
        />
      </Screen>
    )
  }
}

export default Transport;