import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import Screen from '@/component/Screen';
import StandardList from '@/component/StandardList';
import RouteName from '@/component/RouteName';
import { Link } from 'react-router-dom';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.module.less';
import list from '@/style/list.module.less';
import card from '@/style/card.module.less';

const mapStateToProps = ({ vovage }) => {
  return {
    vovage,
    ...mapLoading('vovage',{
      fetchVovageInfoing: 'fetchVovageInfo'
    })
  }
}

const mapDispatchToProps = ({ vovage }) => ({
  ...mapEffects(vovage, ['fetchVovageInfo'])
});

@connect(mapStateToProps, mapDispatchToProps)
class Search extends PureComponent {
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
  getVovageInfo(payload, callback) {
    const _callback = callback ? callback : () => null;
    this.props.fetchVovageInfo(payload, _callback)
  }
  componentDidMount() {
    const { current } = this.state;
    this.getVovageInfo({current} , this.callback);
  }
  handleRefresh = () => {
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    });
    this.getVovageInfo({ current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading,  hasMore } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.getVovageInfo({ current: ++this.current }, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  renderListCard = item => (
    <div className={styles.voavgeItem} onClick={() => this.props.history.push(`/vovage?name=${item.vesselName}`)}>
      <div className={styles.vovageHeader}>
        <Flex justify='between'>
          <span>{item.vesselName}靠泊{item.berthLocationName}{item.berthNotes ? '('+item.berthNotes + ')' : ''}</span>
          <span>{item.downloadTimestamp}</span>
        </Flex>
      </div>
      <div className={styles.vovageBody}>
        <Flex justify='between' className='mb12'>
          <div className={styles.vovageTime}>
            <b>{item.importVoyage || '-'}</b>
            <span>进口航次</span>
          </div>
          <div className={styles.vovageTime}>
            <b>{item.exportVoyage || '-'}</b>
            <span>出口航次</span>
          </div>
        </Flex>
        <Flex justify='between' className='mb12'>
          <div className={styles.vovageTime}>
            <b>{item.dependPlanTime || '-'}</b>
            <span>计划靠泊</span>
          </div>
          <div className={styles.vovageTime}>
            <b>{item.leavePlanTime || '-'}</b>
            <span>计划离泊</span>
          </div>
        </Flex>
        <Flex justify='between'>
          <div className={styles.vovageTime}>
            <b>{item.dependActualTime || '-'}</b>
            <span>实际靠泊</span>
          </div>
          <div className={styles.vovageTime}>
            <b>{item.leaveActualTime || '-'}</b>
            <span>实际离泊</span>
          </div>
        </Flex>
      </div>
      <div className={styles.vovageFooter}>
        {item.operatorCompanyName}
      </div>
    </div>
  )
  render() {
    const { refreshing, firstLoading, loading, ds, hasMore } = this.state;
    const { history } = this.props;
    return (
      <Screen
        className={list.listScreen}
        fixed
        zIndex={11}
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            船期查询
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
          renderListCard={this.renderListCard}
          onCardClick={item => this.props.history.push(`/order-detail?id=${item.id}`)}
          initialListSize={20}
          //{...renderCardMethods}
        />
      </Screen>
    )
  }
}

export default Search;