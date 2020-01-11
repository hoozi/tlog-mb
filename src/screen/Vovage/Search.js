import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex, Picker, List } from 'antd-mobile';
import { connect } from 'react-redux';
import Screen from '@/component/Screen';
import StandardList from '@/component/StandardList';
import Debounce from 'lodash-decorators/debounce';
import SearchModal from '@/component/SearchModal';
import RouteName from '@/component/RouteName';
import { Link } from 'react-router-dom';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.module.less';
import list from '@/style/list.module.less';
import card from '@/style/card.module.less';

const terminalData = [
  {
    label: '北仑矿石',
    value: 'BLKS'   
  },
  {
    label: '鼠浪湖矿石',
    value: 'QHKS'
  },
  {
    label: '武港矿石',
    value: 'WGKS'
  }
]

const mapStateToProps = ({ vovage,common }) => {
  return {
    vovage,
    common,
    ...mapLoading('vovage',{
      fetchVovageInfoing: 'fetchVovageInfo'
    }),
    ...mapLoading('common', {
      fetchCompanying: 'fetchCompany'
    })
  }
}

const mapDispatchToProps = ({ vovage, common }) => ({
  ...mapEffects(vovage, ['fetchVovageInfo']),
  ...mapEffects(common, ['fetchCompany','findCompanyByName'])
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
      operatorCompanyName: undefined,
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
    const { current, operatorCompanyName } = this.state;
    this.getVovageInfo({current, operatorCompanyName} , this.callback);
    this.props.fetchCompany();
  }
  handleRefresh = () => {
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    }, () => {
      const { operatorCompanyName } = this.state;
      this.getVovageInfo({ current: 1, operatorCompanyName }, this.callback);
    });
    
  }
  handleEndReached = () => {
    const { loading,  hasMore, operatorCompanyName } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.getVovageInfo({ current: ++this.current,  operatorCompanyName }, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  handleCustomerChange = operatorCompanyName => {
    this.reset();
    this.setState({
      operatorCompanyName
    }, () => this.getVovageInfo({current:1,operatorCompanyName}, this.callback));
  }
  @Debounce(200)
  handleCustomerSearchChange = name => {
    this.props.findCompanyByName({name}, () => this.forceUpdate())
  }
  renderListCard = item => (
    <div className={styles.voavgeItem} onClick={() => this.props.history.push(`/vovage?name=${item.vesselName}`)}>
      <div className={styles.vovageHeader}>
        <Flex justify='between'>
          <span>{item.vesselName}/{item.voyage}</span>
        </Flex>
      </div>
      <div className={styles.vovageBody}>
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
            <b>{item.leaveActualTime || '-'}</b>
            <span>实际离泊</span>
          </div>
          <div className={styles.vovageTime}>
            <b>{item.dependActualTime || '-'}</b>
            <span>实际靠泊</span>
          </div>
        </Flex>
      </div>
      <div className={styles.vovageFooter}>
        {item.operatorCompanyName}
      </div>
    </div>
  )
  render() {
    const { refreshing, firstLoading, loading, ds, hasMore, operatorCompanyName  } = this.state;
    const { history, common: {companySlice,companys}, fetchCompanying } = this.props;
    const customers = companySlice.length ? companySlice.map(customer => ({
      ...customer,
     // brief: customer.value,
      key: customer.value
    })) : [];
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
        <List className='mb12'>
          <SearchModal
            placeholder='请输入码头名称'
            onChange={this.handleCustomerChange}
            data={customers}
            value={operatorCompanyName}
            loading={fetchCompanying}
            onSearchChange={this.handleCustomerSearchChange}
          >
            <List.Item arrow='horizontal' extra={operatorCompanyName || '请选择'}>作业单位</List.Item>
          </SearchModal>
        </List>
        <StandardList
          dataSource={ds}
          onEndReached={this.handleEndReached}
          onRefresh={this.handleRefresh}
          loading={loading}
          refreshing={refreshing}
          firstLoading={firstLoading}
          hasMore={hasMore}
          renderListCard={this.renderListCard}
          initialListSize={20}
          //{...renderCardMethods}
        />
      </Screen>
    )
  }
}

export default Search;