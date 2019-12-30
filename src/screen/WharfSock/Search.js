import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex, Badge, Drawer, List, InputItem, Picker } from 'antd-mobile';
import { connect } from 'react-redux';
import Screen from '@/component/Screen';
import StandardList from '@/component/StandardList';
import { Link } from 'react-router-dom';
import Debounce from 'lodash-decorators/debounce';
import SearchModal from '@/component/SearchModal';
import { mapEffects, mapLoading } from '@/utils';
import list from '@/style/list.module.less';
import styles from './index.module.less';

const mapStateToProps = ({ sock }) => {
  return {
    ...sock,
    ...mapLoading('sock',{
      fetchTerminalSockListing: 'fetchTerminalSockList',
      fetchSockCustomering: 'fetchSockCustomer'
    })
  }
}

const mapDispatchToProps = ({ sock }) => ({
  ...mapEffects(sock, ['fetchTerminalSockList', 'fetchSockCustomer', 'findSockCustomerByName'])
});

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

@connect(mapStateToProps, mapDispatchToProps)
class Search extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.current = 1;
    this.data = [];
    this.orderId = -1;
    this.state = {
      openFilter: false,
      zIndex: 0,
      overflow: '',
      loading: true,
      refreshing: true,
      firstLoading: true,
      ds,
      hasMore: true,
      orderId: this.orderId,
      current: this.current,
      filter: {
        cargoName: undefined,
        terminal: {
          terminalCode: undefined,
          terminalName: '请选择'
        },
        customer: {
          customerCode: undefined,
          customerName: '请选择'
        }
      }
    }
  }
  reset() {
    this.current = 1;
    this.data = [];
  }
  drawerClose = () => {
    this.setState({
      openFilter: false,
      overflow: '',
      zIndex: 0
    })
  }
  callback = data => {
    const { recordList, pageCount } = data;
    const ds = recordList.length > 0 ? recordList.map(item => ({...item})) : [];
    this.data = [...this.data, ...ds];
    this.setState({
      ...this.state,
      refreshing: false,
      orderId: this.orderId,
      loading: false,
      firstLoading: false,
      hasMore: this.current !== pageCount,
      ds: this.state.ds.cloneWithRows(this.data)
    })
  }
  componentDidMount() {
    const { current } = this.state;
    this.props.fetchTerminalSockList({current} , this.callback);
    this.props.fetchSockCustomer();
  }
  handleRefresh = () => {
    this.reset();
    this.setState({
      ...this.state,
      refreshing: true,
      current: this.current
    }, () => {
      const { filter: {terminal:{terminalCode}, customer:{customerCode}, cargoName} } = this.state;
      this.props.fetchTerminalSockList({ current: 1, terminalCode, customerCode, cargoName}, this.callback);
    });
  }
  handleEndReached = () => {
    const { loading,  hasMore, filter: {terminal:{terminalCode}, customer:{customerCode}, cargoName} } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.props.fetchTerminalSockList({ current: ++this.current, terminalCode, customerCode, cargoName}, data => {
      this.setState({
        ...this.state,
        current: this.current
      });
      this.callback(data);
    });
  }
  handleListOpenChange = open => {
    this.setState({
      openFilter: open,
      overflow: open ? 'hidden' : '',
      zIndex: open ? 12 : 0
    })
  }
  handleOpenFilter = () => {
    this.setState({
      openFilter: true,
      overflow: 'hidden',
      zIndex: 12
    })
  }
  handleCloseFilter = () => {
    this.drawerClose();
  }
  handleField = (field, changed) => {
    this.setState({
      filter: {
        ...this.state.filter,
        [field]: changed
      }
    })
  }
  handleSearchFilter = () => {
    const { filter: {terminal:{terminalCode}, customer:{customerCode}, cargoName} } = this.state;
    this.reset();
    this.drawerClose();
    this.setState({
      refreshing: true,
      current: this.current
    });
    this.props.fetchTerminalSockList({
      current: 1,
      terminalCode,
      customerCode,
      cargoName
    }, this.callback)
  }
  handleResetFilter = () => {
    this.reset();
    this.drawerClose();
    this.setState({
      refreshing: true,
      current: this.current,
      filter: {
        cargoName: undefined,
        terminal: {
          terminalCode: undefined,
          terminalName: '请选择'
        },
        customer: {
          customerCode: undefined,
          customerName: '请选择'
        }
      }
    }, () => this.props.fetchTerminalSockList({current:1}, this.callback));
  }
  @Debounce(200)
  handleCustomerChange = name => {
    this.props.findSockCustomerByName({name})
  }
  renderListCard = item => (
    <div className={styles.sockItem} onClick={() => this.props.history.push(`/wharf-sock-search-detail?terminalCode=${item.terminalCode}&cargoName=${item.cargoName}&customerCode=${item.customerCode}`)}>
      <Flex className={styles.sockItemContainer} justify='between'>
        <div className={styles.sockItemContent}>
          <div>{item.terminalName}</div>
          <div className='mt8'>
            <Badge text={item.customerName} style={{ padding: '0 3px', backgroundColor: '#21b68a', borderRadius: 2 }} />
          </div>
        </div>
        <div className={styles.sockItemExtra}>
          <div>
            <div>{item.cargoName}</div>
            <div className='mt8 text-primary'>{item.cargoQuantity}吨</div>
          </div>
        </div>
      </Flex>
    </div>
  )
  renderFilter = () => {
    const { filter: {terminal:{terminalName, terminalCode}, customer:{customerName,customerCode}, cargoName} } = this.state;
    const { fetchSockCustomering, sockCustomerSlice, sockCustomer } = this.props;
    const customers = sockCustomerSlice.length ? sockCustomerSlice.map(customer => ({
      label: customer.customerName,
      brief: customer.customerCode,
      value: customer.customerCode,
      key: customer.customerCode
    })) : [];
    return (
      <div className={styles.filterContainer}>
        <div className={styles.filterHeader}>
          <Icon type='cross' size='f' onClick={this.handleCloseFilter}/>
          <span>筛选</span>
        </div>
        <div className={styles.filterBody}>
          <List className='mt16'>
            <Picker
              extra={terminalName}
              cols={1}
              data={terminalData}
              value={[terminalCode]}
              onOk={v => this.handleField('terminal', {terminalName: terminalData.filter(item => item.value === v[0])[0]['label'],terminalCode:v[0]})}
            >
              <List.Item arrow='horizontal'>码头</List.Item>
            </Picker>
            <SearchModal
              placeholder='请输入客户名称'
              onChange={value => this.handleField('customer', {customerName: '', customerCode: value})}
              data={customers}
              value={customerCode}
              loading={fetchSockCustomering}
              onSearchChange={this.handleCustomerChange}
            >
              <List.Item arrow='horizontal' extra={customerCode ? sockCustomer.filter(item => item.customerCode === customerCode)[0]['customerName'] : '请选择'}>客户</List.Item>
            </SearchModal>
            <InputItem placeholder='请输入' clear value={cargoName} onChange={v => this.handleField('cargoName', v)}>货名</InputItem>
          </List>
        </div>
        <Flex className={styles.filterButtonGroup}>
          <Flex.Item className={styles.filterButtonItem} onClick={this.handleResetFilter}>
            <span>重置</span>
          </Flex.Item>
          <Flex.Item className={styles.filterButtonItem} onClick={this.handleSearchFilter}>
            <span>查询</span>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
  
  render() {
    const { refreshing, firstLoading, loading, ds, hasMore, overflow, openFilter, zIndex } = this.state;
    const { history } = this.props;
    
    return (
      <Screen
        className={list.listScreen}
        fixed
        zIndex={11}
        style={{overflow}}
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
            rightContent={<span className={styles.filterButton} onClick={this.handleOpenFilter}>筛选</span>}
          >
            码头库存汇总
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
          renderListCard = { this.renderListCard }
          initialListSize={20}
        />
        <Drawer
          style={{zIndex}}
          open={openFilter}
          sidebarStyle={{backgroundColor: '#fff'}}
          onOpenChange={this.handleListOpenChange}
          sidebar={this.renderFilter()}
          position='right'
        >
          <span></span>
        </Drawer>
      </Screen>
    )
  }
}

export default Search;