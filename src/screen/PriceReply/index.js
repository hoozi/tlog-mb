import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex, Tabs } from 'antd-mobile';
import { connect } from 'react-redux';
import { stringify } from 'qs';
import moment from 'moment';
import findIndex from 'lodash/findIndex';
import { Sticky, StickyContainer } from 'react-sticky';
import Screen from '@/component/Screen';
import StandardList from '@/component/StandardList';
import { mapEffects, mapLoading } from '@/utils';
import list from '@/style/list.less';
import color from '@/constants/color';

const { tabsStyle } = color;

const tabs = [
  { title: '回复', type: 0 },
  { title: '历史', type: 1 }
]

const mapStateToProps = ({ priceReply }) => {
  return {
    priceReply,
    ...mapLoading('priceReply',{
      fetchPriceReplying: 'fetchPriceReply'
    })
  }
}

const mapDispatchToProps = ({ priceReply }) => ({
  ...mapEffects(priceReply, ['fetchPriceReply'])
});

@connect(mapStateToProps, mapDispatchToProps)
class PriceReply extends PureComponent {
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
      type: 0
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
    this.props[name](payload, _callback)
  }
  componentDidMount() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    const { current, type } = this.state;
    this.priceReplyService('fetchPriceReply', {current, type} , this.callback);
  }
  handleRefresh = () => {
    const { type } = this.state
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.priceReplyService('fetchPriceReply', { type, current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, hasMore, type } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.priceReplyService('fetchPriceReply', { type, current: ++this.current }, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  handleGoToDetail = item => {
    const { type } = this.state;
    const query = stringify({
      id: item.id,
      type
    })
    this.props.history.push(`/price-reply-detail?${query}`);
  }
  renderListCardHeader = item => (
    <Flex justify='between'>
      <span><b>{item.originName || '未知'}</b><i>出发地</i></span>
      {/* <span className={card.arrowLine}><ArrowLine/></span> */}
      <span><b>{item.terminalName || '未知'}</b><i>目的地</i></span>
      <span><b>{item.quantity}</b><i>货物吨位</i></span>
    </Flex>
  )
  renderListCardBody = item => (
    <>
      <p><b>【{item.cargoTypeName}】{item.cargoName}</b></p>
      <p>有效期<b>{moment(item.beginDateTime).format('YYYY-MM-DD')} ～ {moment(item.endDateTime).format('YYYY-MM-DD')}</b></p>
    </>
  )
  renderListCardExtra = item => (
    <Flex justify='between'>
      <span><Icon type='beizhu' size='xxs'/> {item.remark}</span>
    </Flex>
  )
  handleTabChange = data => {
    const { type } = data;
    this.setState({
      ...this.state,
      firstLoading: true,
      type
    });
    this.priceReplyService('fetchPriceReply',{
      type
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
            询价回复
          </NavBar>
        )}
      >
        <StickyContainer className={list.stickyContainer}>
          <Sticky>
            {
              ({ style }) => (
                <div style={{...style, zIndex:10}}>
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

export default PriceReply;