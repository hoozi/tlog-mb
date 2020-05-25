import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex, Tabs } from 'antd-mobile';
import { connect } from 'react-redux';
import { stringify } from 'qs';
import moment from 'moment';
import findIndex from 'lodash/findIndex';
import { Sticky, StickyContainer } from 'react-sticky';
import Screen from '@/component/Screen';
import StandardList from '@/component/StandardList';
import RouteName from '@/component/RouteName';
import { mapEffects, mapLoading } from '@/utils';
import list from '@/style/list.module.less';
import color from '@/constants/color';

const { tabsStyle } = color;

const tabs = [
  { title: '待审核', status: 70 },
  { title: '已审核', status: 90 },
  { title: '已打回', status: 80 }
]

const mapStateToProps = ({ priceReply }) => {
  return {
    priceReply,
    ...mapLoading('priceReply',{
      fetchPriceReviewing: 'fetchPriceReview'
    })
  }
}

const mapDispatchToProps = ({ priceReply }) => ({
  ...mapEffects(priceReply, ['fetchPriceReview'])
});

@connect(mapStateToProps, mapDispatchToProps)
class PriceReview extends PureComponent {
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
      status: 70
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
  priceReplyService(name, payload, callback) {
    const _callback = callback ? callback : () => null;
    console.log(this.props)
    this.props[name](payload, _callback)
  }
  componentDidMount() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    const { current, status } = this.state;
    this.priceReplyService('fetchPriceReview', {current, status} , this.callback);
  }
  handleRefresh = () => {
    const { status } = this.state
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.priceReplyService('fetchPriceReview', { status, current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, hasMore, status } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.priceReplyService('fetchPriceReview', { status, current: ++this.current }, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  handleGoToDetail = item => {
    const query = stringify({
      id: item.id,
      status: item.status,
      cause: item.cause
    })
    this.props.history.push(`/price-review-detail?${query}`);
  }
  renderListCardHeader = item => (
    <RouteName
      from={item.originName}
      to={item.terminalName}
      extra={
        <>
          <b className='text-primary'>{item.quantity || '未知'}</b>
          <span>受载量</span>
        </>
      }
    />
  )
  renderListCardBody = item => (
    <>
      <p>货物<b>{item.cargoName}</b>，承运商<b>{item.carrierName}</b></p>
      <p>受载日期<b>从{item.layDaysBegin ? item.layDaysBegin.substring(0,10) : '暂无'} 到 {item.layDaysEnd ? item.layDaysEnd.substring(0,10) : '暂无'}</b></p>
      <p>报价<b>¥{item.quotedPrice}</b>，有效期<b>{item.validateDate ? item.validateDate.substring(0,10) : '暂无'}</b></p>
    </>
  )
  renderListCardExtra = item => (
    item.cause ? 
    <Flex justify='between'>
      <span><Icon type='beizhu' size='xxs'/> {item.cause}</span>
    </Flex> : null
  )
  handleTabChange = data => {
    const { status } = data;
    this.setState({
      ...this.state,
      firstLoading: true,
      status
    });
    this.priceReplyService('fetchPriceReview',{
      status
    }, data => {
      this.reset();
      this.callback(data)
    })
  }
  render() {
    const { refreshing, firstLoading, loading, ds, hasMore, type } = this.state;
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
            询价审核
          </NavBar>
        )}
      >
        <StickyContainer className={list.stickyContainer}>
          <Sticky>
            {
              ({ style }) => (
                <div style={{...style, zIndex:12}}>
                  <div className={list.listStatus}>
                    <Tabs initialPage={findIndex(tabs, tab => tab.type === type)} tabs={tabs} {...tabsStyle} onChange={this.handleTabChange}/>
                  </div>
                </div>
              )
            }
          </Sticky>
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
            onCardClick={this.handleGoToDetail}
          />
        </StickyContainer>
      </Screen>
    )
  }
}

export default PriceReview;