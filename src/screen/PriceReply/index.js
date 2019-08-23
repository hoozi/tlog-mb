import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import moment from 'moment';
import Screen from '@/component/Screen';
import StandardList from '@/component/StandardList';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.less';
import list from '@/style/list.less';

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
      const originName = (item.originName && item.originName.length > 6) ? item.originName.substring(0,6) + '...' : item.originName;
      const terminalName = (item.terminalName  && item.terminalName.length > 6) ? item.terminalName.substring(0,6) + '...' : item.terminalName;
      return {
        ...item,
        originName,
        terminalName
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
  priceReplyService(name, payload, callback) {
    const _callback = callback ? callback : () => null;
    this.props[name](payload, _callback)
  }
  componentDidMount() {
    const { current } = this.state;
    this.priceReplyService('fetchPriceReply', {current} , this.callback);
  }
  handleRefresh = () => {
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.priceReplyService('fetchPriceReply', { current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, hasMore } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.priceReplyService('fetchPriceReply', { current: ++this.current }, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  handleGoToDetail = item => {
    this.props.history.push(`/price-reply-detail?id=${item.id}`);
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
      
      <p>货物<b>{item.cargo}({item.cargoTypeName}类)</b></p>
      <p>有效期到<b className={styles.expireDate}>{moment(item.endDateTime).format('YYYY-MM-DD')}</b></p>
    </>
  )
  renderListCardExtra = item => (
    <Flex justify='between'>
      <span><Icon type='beizhu' size='xxs'/> {item.remark}</span>
    </Flex>
  )
  render() {
    const { refreshing, firstLoading, loading, ds, hasMore } = this.state;
    const { history } = this.props;
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
            询价回复
          </NavBar>
        )}
      >
        <div className={list.stickyContainer}>
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
        </div>
      </Screen>
    )
  }
}

export default PriceReply;