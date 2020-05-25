import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex, Button, Modal, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { Sticky, StickyContainer } from 'react-sticky';
import Screen from '@/component/Screen';
import BannerMask from '@/component/BannerMask';
import StandardList from '@/component/StandardList';
import RouteName from '@/component/RouteName';
import { mapEffects, mapLoading } from '@/utils';
import list from '@/style/list.module.less';
import styles from './index.module.less';
import Empty from '@/component/Empty';

const mapStateToProps = ({ priceReply }) => {
  return {
    priceReply,
    ...mapLoading('priceReply',{
      fetchPriceReviewing: 'fetchPriceReview'
    })
  }
}

const mapDispatchToProps = ({ priceReply }) => ({
  ...mapEffects(priceReply, ['fetchPriceReview', 'updatePriceReview'])
});

@connect(mapStateToProps, mapDispatchToProps)
class PriceReviewDetail extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    const search = props.history.location.search;
    const statusMap = {
      '70': {
        name: '待审核',
        color: '#3c73f0'
      },
      '90': {
        name: '已审核',
        color: '#6abf47'
      },
      '80': {
        name: '已打回',
        color: '#ff5b05'
      }
    }
    this.id = search ? parse(search.substring(1)).id : '';
    this.status = search ? parse(search.substring(1)).status : '';
    this.cause = search ? parse(search.substring(1)).cause: '';
    this.currentStatus = statusMap[this.status]
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
    const params = name === 'fetchPriceReview' ? {operateType:'getEnquiryAuditDetail', parentId: this.id, ...payload} : payload
    this.props[name](params, _callback)
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
  handleSubmitReview = (cause, operateType) => {
    Toast.loading('操作中...', 0);
    this.props.updatePriceReview({
      cause,
      operateType,
      id: this.id
    }, () => {
      Toast.hide();
      Toast.success('提交成功', 3, () => {
        this.props.history.goBack();
      });
    })
  }
  renderListCardHeader = item => (
    <Flex justify='between'>
      <span><b>{item.transportName || '暂无'}</b><i>运力名称</i></span>
      <span><b>¥{item.quotedPrice || '暂无'}</b><i>报价</i></span>
      <span><b>{item.validateDate ? item.validateDate.substring(0,10) : '暂无'}</b><i>报价有效期</i></span>
    </Flex>
  )
  renderListCardBody = item => (
    <>
      <p>承运商<b>{item.carrierName || '暂无'}</b></p>
    </>
  )
  renderListCardExtra = item => (
    <Flex justify='between'>
      <span><Icon type='yonghu' size='xxs'/> {item.contact || '暂无'},{item.contactTel || '暂无'}</span>
    </Flex>
  )
  renderListCardFlag = item => {
    const statusMap = {
      '50': '未确认',
      '60': '已指定|#6abf47'
    }
    return  statusMap[item.status] || '';
  }
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
    const { refreshing, firstLoading, loading, ds, hasMore } = this.state;
    const { history,priceReply: {recordList}  } = this.props;
    return (
      <Screen
        className={list.listScreen}
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            审核详情
          </NavBar>
        )}
      >
        <StickyContainer>
          <div className={styles.routeCard}>
            <Sticky>
              {
                ({style}) => (
                  <div className={styles.routeName} style={{...style, zIndex: 20}}>
                    <Flex justify='between'> 
                      <span>
                        <b>{recordList.length ? recordList[0].originName : '--'}</b>
                        <i>装货地</i>
                      </span>
                      <span>
                        <b>{recordList.length ? recordList[0].terminalName : '--'}</b>
                        <i>卸货地</i>
                      </span>
                      {/* <span className={styles.arrowLine}><ArrowLine num={4}/></span> */}
                    </Flex>
                  </div>
                )
              }
            </Sticky>
            <BannerMask/>
          </div>
          <div className={styles.detailCardList}>
            <div className={styles.detailCard}>
            {
              recordList.length ? 
              <>
                <div className={styles.detailListItem}>
                  <Icon type='huowu' size='xxs'/>
                  <span>货物<b>{recordList[0].cargoName},{recordList[0].quantity}</b>吨</span>
                  <b className={styles.status} style={{color: this.currentStatus['color']}}>{this.currentStatus['name']}</b>
                </div>
                <div className={styles.detailListItem}>
                  <Icon type='shijian' size='xxs'/>
                  <span>受载日期<b>从{recordList[0].layDaysBegin.substring(0,10) || '暂无'} 到 {recordList[0].layDaysEnd.substring(0,10) || '暂无'}</b></span>
                </div>
                  <Flex justify={this.status === '70' ? 'end' : 'start'} className={styles.detailNote}>
                    {
                      this.status === '70' ?
                      <>
                        <Button inline type='warning' size='small' className='mr8'
                          onClick={() => Modal.prompt(
                            '打回原因',
                            '请输入打回的原因',
                            [
                              { text: '取消' },
                              { text: '提交', onPress: cause => this.handleSubmitReview(cause, 'refuseEnquiryAudit') },
                            ],
                            'default',
                          )}
                        >打回</Button>
                        <Button inline type='primary' size='small'
                          onClick={() => Modal.prompt(
                            '通过原因',
                            '请输入通过的原因',
                            [
                              { text: '取消' },
                              { text: '提交', onPress: cause => this.handleSubmitReview(cause, 'passEnquiryAudit') },
                            ],
                            'default',
                          )}
                        >通过</Button>
                      </> :
                      <span>{this.cause}</span>
                    }
                    
                  </Flex>
              </>  : <Empty/>
            }
            </div>
          </div>
          <Flex className={styles.listHeader}>
            <span>询价信息</span>
          </Flex>
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
            renderListCardFlag={this.renderListCardFlag}
          />
        </StickyContainer> 
      </Screen>
    )
  }
}

export default PriceReviewDetail;