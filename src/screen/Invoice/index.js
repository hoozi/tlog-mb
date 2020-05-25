import React, { PureComponent } from 'react';
import { NavBar, Icon, Tabs, ListView, Modal, DatePickerView, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import findIndex from 'lodash/findIndex';
import debounce from 'lodash/debounce';
import moment from 'moment';
import Screen from '@/component/Screen';
import SearchModal from '@/component/SearchModal';
import RouteName from '@/component/RouteName';
import { mapEffects, mapLoading } from '@/utils';
import StandardList from '@/component/StandardList';
import styles from './index.module.less';
import list from '@/style/list.module.less';
import color from '@/constants/color';

const { tabsStyle } = color;

const mapStateToProps = ({ invoice, common }) => {
  return {
    invoice,
    common,
    ...mapLoading('invoice', {
      fetchInvoicing: 'fetchInvoice'
    }),
    ...mapLoading('common', {
      fetchCustomering: 'fetchCustomer'
    })
  }
}

const mapDispatchToProps = ({ invoice,common }) => ({
  ...mapEffects(invoice, ['fetchInvoice']),
  ...mapEffects(common, ['fetchCustomer', 'findCustomerByName'])
});


const allTabs = [
  { title: '未开票', status: 0 },
  { title: '部分开票', status: 1 },
  { title: '已开票', status: 2 }
]

@connect(mapStateToProps, mapDispatchToProps)
class Invoice extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    const { location: {search} } = props;
    this.current = 1;
    this.data = [];
    const endDate = new Date().setDate(new Date().getDate() + 30);
    this.state = {
      startDate: new Date(),
      endDate: new Date(endDate),
      customerId: undefined,
      loading: true,
      refreshing: true,
      firstLoading: true,
      ds,
      hasMore: true,
      current: this.current,
      startVisible: false,
      endVisible: false,
      status: 0
    }
    this.handleCustomerSearchChange = debounce(this.handleCustomerSearchChange, 200);
  }
  reset() {
    this.current = 1;
    this.data = [];
  }
  callback = data => {
    const { recordList, pageCount } = data;
    const ds = recordList.length > 0 ? recordList.map(item => ({
      ...item
    })) : [];
    this.data = [...this.data, ...ds];
    const newState = {
      ...this.state,
      refreshing: false,
      loading: false,
      firstLoading: false,
      hasMore: this.current !== pageCount,
      ds: this.state.ds.cloneWithRows(this.data)
    }
    this.setState(newState);
  }
  componentDidMount() {
    const { current, status, startDate, endDate } = this.state;
    this.props.fetchInvoice({current, status, startDate: moment(startDate).format('YYYY-MM-DD'), endDate:moment(endDate).format('YYYY-MM-DD')} , this.callback);
    this.props.fetchCustomer();
  }
  handleTabChange = data => {
    const { status } = data;
    this.setState({
      ...this.state,
      firstLoading: true,
      status
    },() => {
      const { customerId, startDate, endDate } = this.state;
      this.props.fetchInvoice({
        status,
        startDate:moment(startDate).format('YYYY-MM-DD'),
        endDate:moment(endDate).format('YYYY-MM-DD'),
        customerId
      }, data => {
        this.reset();
        this.callback(data)
      })
    });
    
  }
  handleRefresh = () => {
    const { status,customerId, startDate, endDate } = this.state;
    this.reset();
    this.setState({
      refreshing: true,
      current: this.current
    });
    this.props.fetchInvoice({ status, current: 1, startDate:moment(startDate).format('YYYY-MM-DD'), endDate:moment(endDate).format('YYYY-MM-DD'), customerId }, this.callback);
  }
  handleEndReached = () => {
    const { loading, status, hasMore,customerId, startDate, endDate } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.props.fetchInvoice({ status, startDate:moment(startDate).format('YYYY-MM-DD'), endDate:moment(endDate).format('YYYY-MM-DD'), current: ++this.current,customerId }, data => {
      this.setState({
        ...this.state,
        current: this.current
      })
      this.callback(data);
    });
  }
  handleCustomerChange = customerId => {
    this.reset();
    this.setState({
      customerId
    }, () => {
      this.props.fetchInvoice({current:1, startDate: moment(this.state.startDate).format('YYYY-MM-DD'), endDate: moment(this.state.endDate).format('YYYY-MM-DD'), status:this.state.status, customerId}, this.callback)
    })
  }
  handleCustomerSearchChange = name => {
    this.props.findCustomerByName({name}, () => this.forceUpdate());
  }
  handleShowModal = (name,flag) => {
    this.setState({
      [`${name}Visible`]: !!flag
    })
  }
  handleChangeDate = (name,date) => {
    this.setState({
      [`${name}Date`]: date
    })
  }
  handleOk = () => {
    this.reset();
    this.props.fetchInvoice({
      current:1, 
      startDate: moment(this.state.startDate).format('YYYY-MM-DD'), 
      endDate: moment(this.state.endDate).format('YYYY-MM-DD'),
      status:this.state.status,
      customerId: this.state.customerId
    }, this.callback); 
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
      <p>结算金额<b style={{color: '#fa8c16'}}>¥{item.amounts}</b>，开票金额<b style={{color: '#fa8c16'}}>¥{item.balance}</b></p>
      <p>托运人<b>{item.customerName}</b>，货主<b>{item.consignorName}</b>，货名<b>{item.cargoName}</b>，<b>{item.planQuantity || '0'}</b>吨</p>
    </>
  )
  renderListCardFlag = item => {
    const statusMap = {
      '0': '未开票',
      '1': '部分开票',
      '2': '已开票|#6abf47'
    }
    return statusMap[item.status];
  }
  renderListCardExtra = item => <b className='text-primary'>{item.contractNo}</b>
  render() {
    const { refreshing, firstLoading, loading, status, ds, hasMore, customerId, startVisible, endVisible, startDate, endDate  } = this.state;
    const { history, common, fetchCustomering } = this.props;
    const { customerSlice } = common;
    const customers = customerSlice.length ? customerSlice.map(customer => {
      return {
        label: customer.fullName,
        brief: customer.name,
        value: customer.id,
        key: customer.id,
        ...customer
      }
    }) : [];
    return (
      <Screen
        className={list.listScreen}
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
            rightContent={
              <SearchModal
                placeholder='请输入客户名称'
                onChange={this.handleCustomerChange}
                data={customers}
                value={customerId}
                loading={fetchCustomering}
                onSearchChange={this.handleCustomerSearchChange}
              >
                <span className='light-blue'>筛选</span>
              </SearchModal>
            }
          >
            发票查询
          </NavBar>
        )}
      >
        <StickyContainer className={list.stickyContainer}>
          {
  
            <Sticky>
              {
                ({ style }) => (
                  <div style={{...style, zIndex:12}}>
                    <div className={list.listStatus} >
                      <Tabs initialPage={findIndex(allTabs, tab => tab.status === status)} tabs={allTabs} {...tabsStyle} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />} onChange={this.handleTabChange}/>
                    </div>
                    <div className={styles.timeFilter}>
                      <div className={styles.timeItem} onClick={() => this.handleShowModal('start',true)}>
                        <span>{moment(startDate).format('YYYY-MM-DD')}</span>
                      </div>
                      <div className={styles.timeItem}>
                        <span>到</span>
                      </div>
                      <div className={styles.timeItem} onClick={() => this.handleShowModal('end',true)}>
                        <span>{moment(endDate).format('YYYY-MM-DD')}</span>
                      </div>
                    </div>
                  </div>
                )
              }
            </Sticky>
          }
          <StandardList
            className='mt8'
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
            renderListCardFlag={this.renderListCardFlag}
            /* onCardClick={item => this.showActionSheet(item)} */
          />
        </StickyContainer>
        <Modal
          maskClosable
          popup
          visible={startVisible}
          animationType='slide-up'
          onClose={() => this.handleShowModal('start')}
        >
          <Flex justify='between' className={styles.datePickerHeader}>
            <span className='text-primary' onClick={() => this.handleShowModal('start')}>取消</span>
            <span className={styles.title}>选择日期</span>
            <span className='text-primary' onClick={() => {
              this.handleShowModal('start');
              this.handleOk()
            }}>确定</span>
          </Flex>
          <DatePickerView
            mode='date'
            value={startDate}
            onChange={date => this.handleChangeDate('start', date)}
          />
        </Modal>
        <Modal
          maskClosable
          popup
          visible={endVisible}
          animationType='slide-up'
          onClose={() => this.handleShowModal('end')}
        >
          <Flex justify='between' className={styles.datePickerHeader}>
            <span className='text-primary' onClick={() => this.handleShowModal('end')}>取消</span>
            <span className={styles.title}>选择日期</span>
            <span className='text-primary' onClick={() => {
              this.handleShowModal('end');
              this.handleOk()
            }}>确定</span>
          </Flex>
          <DatePickerView
            mode='date'
            value={endDate}
            onChange={date => this.handleChangeDate('end', date)}
          />
        </Modal>
      </Screen>
    )
  }
}

export default Invoice;