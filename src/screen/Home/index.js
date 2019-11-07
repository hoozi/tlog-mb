import React, { PureComponent } from 'react';
import {
  Grid,
  Icon,
  Flex,
  Toast,
  PullToRefresh
} from 'antd-mobile';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import { getToken } from '@/utils/token';
import { parse } from 'qs';
import Screen from '@/component/Screen';
import BannerMask from '@/component/BannerMask';
import RouteName from '@/component/RouteName';
import Empty from '@/component/Empty';
import StandardCard from '@/component/StandardCard';
import CenterLoading from '@/component/CenterLoading';
import styles from './index.module.less';
import { mapEffects, mapLoading, getMenuFromStorage } from '@/utils';
import { BRAND_COLOR } from '@/constants/color';
import LoginCheckArea from '@/hoc/LoginCheckArea';

const menus = [{
  icon: <Icon type='huopanshenhe' size='f' color={BRAND_COLOR}/>,
  text: '货盘审核',
  url: '/cargo?status=40'
}, {
  icon: <Icon type='huopan' size='f' color={BRAND_COLOR}/>,
  text: '货盘信息',
  url: '/cargo?type=all'
}, {
  icon: <Icon type='huopanfabu' size='f' color='#f39927'/>,
  text: '货盘发布',
  url: '/cargo-create'
}, {
  icon: <Icon type='yunlishenhe' size='f' color='#f39927'/>,
  text: '运力审核',
  url: '/transport?status=40'
}, {
  icon: <Icon type='yunli' size='f' color='#29ab91'/>,
  text: '运力信息',
  url: '/transport?type=all'
}, {
  icon: <Icon type='yunlifabu' size='f' color='#f15a4a'/>,
  text: '运力发布',
  url: '/transport-create'
}, {
  icon: <Icon type='xunjiahuifu' size='f' color='#f15a4a'/>,
  text: '询价回复',
  url: '/price-reply'
}, {
  icon: <Icon type='chaoxi' size='f' color='#f39927'/>,
  text: '潮汐信息',
  url: '/tide'
}, {
  icon: <Icon type='dingdanchaxun' size='f' color={BRAND_COLOR}/>,
  text: '订单查询',
  url: '/order'
}, {
  icon: <Icon type='renwuguanli' size='f' color='#29ab91'/>,
  text: '任务管理',
  url: '/task'
}, {
  icon: <Icon type='matoukucun' size='f' color={BRAND_COLOR}/>,
  text: '码头库存',
  url: '/wharf-sock'
}, {
  icon: <Icon type='zaitukucun' size='f' color={BRAND_COLOR}/>,
  text: '在途库存',
  url: '/transport-sock'
}, {
  icon: <Icon type='yongdu' size='f' color='#f15a4a'/>,
  text: '拥堵情况',
  url: '/wharf-congestion'
}];

const ProductCard = ({item, history}) => (
  <StandardCard
    className={styles.bottomLine}
    renderListCardHeader={item => (
      <RouteName
        from={item.originName}
        to={item.terminalName}
        extra={
          <>
            <b className='text-primary'>{item.bizType || '未知'}</b>
            <span>作业类型</span>
          </>
        }
      />
    )}
    renderListCardBody={item => (
      <p>距离约<b>{item.mileage}</b>公里, 时长约<b>{item.days}</b>天</p>
    )}
    renderListCardExtra={item => (
      <span><Icon type='yonghu' size='xxs'/> {item.contactName.trim() || '未知'},{item.contactNumber.trim() || '未知'}</span>
    )}
    item={item}
    onCardClick={item => history.push(`/product-detail?id=${item.id}`)}
  />
)

const CargoCard = ({item}) => (
  <StandardCard
    className={styles.bottomLine}
    renderListCardHeader={item => (
      <RouteName
        from={item.originName}
        to={item.terminalName}
        extra={
          <>
            <b className='text-primary'>{item.operationTypeName || '未知'}</b>
            <span>作业类型</span>
          </>
        }
      />
    )}
    renderListCardBody={item => (
      <>
        <p>托运人<b>{item.customerName}</b></p>
        <p>货名<b>{item.cargo}</b>,<b className='text-primary'>{item.tonnage || '0'}</b>吨</p>
      </>
    )}
    renderListCardExtra={item => (
      <span><Icon type='yonghu' size='xxs'/> {item.contacts.trim() || '未知'},{item.contactsPhone.trim() || '未知'}</span>
    )}
    item={item}
  />
);

const TransportCard = ({item}) => (
  <StandardCard
    className={styles.bottomLine}
    renderListCardHeader={item => (
      <Flex justify='between'>
        <span><b>{item.transportName || '未知'}</b><i>运力名称</i></span>
        <span><b>{item.loadWeight || '未知'}</b><i>载重吨</i></span>
        <span><b>{item.freePlace.trim() || '未知'}</b><i>空闲地</i></span>
      </Flex>
    )}
    renderListCardBody={item => (
      <>
        <p>服务商<b>{item.logisticsProvider || '未知'}</b></p>
        <p>空闲日期<b>{moment(item.freeStartTime).format('YYYY-MM-DD')} ~ {moment(item.freeEndTime).format('YYYY-MM-DD')}</b></p>
      </>
    )}
    renderListCardExtra={item => (
      <Flex justify='between'>
        <span><Icon type='yonghu' size='xxs'/> {item.contact}</span>
        <span><Icon type='dianhua' size='xxs'/> {item.contactTel} </span>
        <span><Icon type='leixing' size='xxs'/> {item.transportTypeName}</span>
      </Flex>
    )}
    item={item}
  />
);


const IndexList = props => {
  const { data, loading, renderCard } = props;
  return (
    loading ? 
    <CenterLoading text='加载中...'/>
    : data.length ?
    <div className={styles.cardList}>
      {
        data.map(item => renderCard ? renderCard(item) : null)
      }
    </div> : <Empty/>
  )
}

const AccountCard = props => {
  return <div className={styles.accountCard}><h1>全程物流</h1></div>
}

const mapStateToProps = ({ product, cargo, transport }) => {
  return {
    product,
    cargo,
    transport,
    ...mapLoading('product',{
      fetchProducting: 'fetchProduct'
    }),
    ...mapLoading('cargo',{
      fetchAnyCargoing: 'fetchAnyCargo'
    }),
    ...mapLoading('transport', {
      fetchAnyTransporting: 'fetchAnyTransport'
    }),
    ...mapLoading('user', {
      fetchCurrentMenuing: 'fetchCurrentMenu'
    })
  }
}

const mapDispatchToProps = ({ product, cargo, transport, sso }) => ({
  ...mapEffects(product, ['fetchProduct']),
  ...mapEffects(cargo, ['fetchAnyCargo']),
  ...mapEffects(transport, ['fetchAnyTransport']),
  loginSSO: sso.loginSSO
})
@connect(mapStateToProps, mapDispatchToProps)
class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    }
  }
  getIndexList() {
    Promise.all([
      this.props.fetchProduct({status: 'B'}),
      this.props.fetchAnyCargo({status: 30}),
      this.props.fetchAnyTransport({status: 30})
    ]).then(() => {
      this.setState({
        refreshing: false
      });
    }); 
  }
  componentDidMount() {
    const search = window.location.search;
    const ticket = parse(search.substring(1))['ticket'] || '';
    if(!getToken()) {
      ticket && this.props.loginSSO(ticket);
    }
    this.getIndexList();
  }
  handleLinkTo = el => {
    const { history } = this.props;
    const { url='' } = el;
    if(!url) {
      return Toast.info('即将到来')
    }
    history.push(url);
  }
  handleRefresh = () => {
    this.setState({
      refreshing: true
    })
    this.getIndexList();
  }
  render() {
    const { 
      product:{ recordList:productList }, 
      cargo: { recordList:cargoList }, 
      transport: { recordList:transportList }, 
      fetchProducting,
      fetchAnyCargoing,
      fetchAnyTransporting,
      fetchCurrentMenuing,
      history
    } = this.props;
    const { refreshing } = this.state
    return (
      <PullToRefresh
        className={styles.homeRefresh}
        style={{
          overflowY: 'auto',
          height: '100%'
        }}
        refreshing={refreshing}
        onRefresh={this.handleRefresh}
      >
        <Screen className={styles.homeScreen}>
          <div className={styles.banner}>
            <AccountCard/>
            <BannerMask/>
          </div>
          <div className={styles.gridContainer}>
            <div className={styles.gridWrapper} style={{minHeight:getMenuFromStorage(menus).length ? 'auto' : 237}}>
              <LoginCheckArea>
                {
                  fetchCurrentMenuing ? 
                  <CenterLoading text='菜单加载中...'/> : 
                  getMenuFromStorage(menus).length ? 
                  <Grid
                    className={styles.fnGrid} 
                    data={getMenuFromStorage(menus)} 
                    square={false} 
                    hasLine={false} 
                    activeStyle={false} 
                    onClick={this.handleLinkTo}
                  /> :
                  <Empty description='暂无授权的菜单'/>
                }
              </LoginCheckArea>
            </div>
          </div>
          <div className={styles.indexCard}>
            <div className={styles.indexCardHeader}>
              <h2 className={styles.indexCardTitle}><span>物流产品</span></h2>
              <Link to='/product?type=any'><span>更多</span><Icon type='xiayiyeqianjinchakangengduo' color='#a4a9b0' size='xxs'/></Link>
            </div>    
            <div className={styles.indexCardBody}>
              <IndexList renderCard={item => <ProductCard history={history} key={item.id} item={item}/>} data={productList} loading={!refreshing && fetchProducting}/>
            </div>
          </div>
          <div className={styles.indexCard}>
            <div className={styles.indexCardHeader}>
              <h2 className={styles.indexCardTitle}><span>货盘信息</span></h2>
              <Link to='/cargo?type=more'><span>更多</span><Icon type='xiayiyeqianjinchakangengduo' color='#a4a9b0' size='xxs'/></Link>
            </div>
            <div className={styles.indexCardBody}>
              <IndexList renderCard={item => <CargoCard key={item.id} item={item}/>} data={cargoList} loading={!refreshing && fetchAnyCargoing}/>
            </div>
          </div>
          <div className={styles.indexCard}>
            <div className={styles.indexCardHeader}>
              <h2 className={styles.indexCardTitle}><span>运力信息</span></h2>
              <Link to='/transport?type=more'><span>更多</span><Icon type='xiayiyeqianjinchakangengduo' color='#a4a9b0' size='xxs'/></Link>
            </div>        
            <div className={styles.indexCardBody}>
              <IndexList renderCard={item => <TransportCard key={item.id} item={item}/>} data={transportList} loading={!refreshing && fetchAnyTransporting}/>
            </div>
          </div>
        </Screen>
        
      </PullToRefresh>
    )
  }
}


export default withRouter(Home);