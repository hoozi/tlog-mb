import React, { PureComponent } from 'react';
import { NavBar, ListView, Icon } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import Screen from '@/component/Screen';
import { mapEffects } from '@/utils';
import StandardList from '@/component/StandardList';
import list from '@/style/list.less';

const mapStateToProps = ({ sock }) => {
  return {
    sock
  }
}

const mapDispatchToProps = ({ sock }) => ({
  ...mapEffects(sock, ['fetchTerminalSock'])
});

@connect(mapStateToProps, mapDispatchToProps)
class Cargo extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    const { location: {search} } = props;
    this.terminalName = parse(search.substring(1))['terminalName'] || '';
    this.customerCode = parse(search.substring(1))['customerCode'] || '';
    this.terminalCode = parse(search.substring(1))['terminalCode'] || '';
    this.current = 1;
    this.data = [];
    this.size = 20;
    this.state = {
      loading: true,
      refreshing: true,
      firstLoading: true,
      ds,
      totalPage: 0,
      hasMore: true,
      current: this.current
    }
  }
  reset() {
    this.current = 1;
    this.data = [];
  }
  callback = data => {
    const { list, total } = data;
    const ds = list.length > 0 ? list.map(item => ({...item})) : [];
    this.data = [...this.data, ...ds];
    const newState = {
      ...this.state,
      refreshing: false,
      loading: false,
      firstLoading: false,
      hasMore: this.current !== Math.ceil(total/this.size),
      ds: this.state.ds.cloneWithRows(this.data)
    }
    this.setState(newState);
  }
  getTerminalSock(payload, callback) {
    const { current } = payload;
    const { customerCode, terminalCode } = this;
    this.props.fetchTerminalSock({current, customerCode, terminalCode} , callback ? callback : this.callback);
  }
  componentDidMount() {
    const { current } = this.state;
    this.getTerminalSock({current});
  }
  handleRefresh = () => {
    this.reset();
    this.setState({
      refreshing: true,
      current: this.current
    });
    this.getTerminalSock({current:1});
  }
  handleEndReached = () => {
    const { loading, hasMore } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.getTerminalSock({ current: ++this.current }, data => {
      this.setState({
        ...this.state,
        current: this.current
      })
      this.callback(data);
    });
  }
  renderListCard = item => (
    <div className={list.sockListItem}>
      <div>
        <div className={list.sockListContent}>{item.cargoName}</div>
        <div className={list.sockListBrief}>
          <span>{item.vesselEname}/{item.voyage}</span>
          <span><b>{item.storagePeriod}</b>天</span>
        </div>
      </div>
      <div className={list.sockListExtra}>
        {item.cargoQuantity}<span>吨</span>
      </div> 
    </div>
  )
  render() {
    const { refreshing, firstLoading, loading, ds, hasMore  } = this.state;
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
            码头库存详情
          </NavBar>
        )}
      >
        <StandardList
          className={list.sockList}
          dataSource={ds}
          onEndReached={this.handleEndReached}
          onRefresh={this.handleRefresh}
          loading={loading}
          refreshing={refreshing}
          firstLoading={firstLoading}
          hasMore={hasMore}
          renderListCard={this.renderListCard}
        />
      </Screen>
    )
  }
}

export default Cargo;