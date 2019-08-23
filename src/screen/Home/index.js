import React, { PureComponent } from 'react';
import {
  Grid,
  Icon,
  //ActivityIndicator,
  Flex,
  Toast
} from 'antd-mobile';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Screen from '@/component/Screen';
import BannerMask from '@/component/BannerMask';
import ArrowLine from '@/component/ArrowLine';
import styles from './index.less';
import card from '@/style/card.less';
import { mapEffects, mapLoading } from '@/utils';
import { BRAND_COLOR } from '@/constants/color';
//import withCache from '@/hoc/withCache';

const data = [{
  icon: <Icon type='huopan' size='f' color={BRAND_COLOR}/>,
  text: '货盘信息',
  url: '/cargo'
}, {
  icon: <Icon type='huopanfabu' size='f' color='#f39927'/>,
  text: '货盘发布',
  url: '/cargo-create'
}, {
  icon: <Icon type='yunli' size='f' color='#f39927'/>,
  text: '运力信息',
  url: '/transport'
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
  url: ''
}, {
  icon: <Icon type='dingdanchaxun' size='f' color={BRAND_COLOR}/>,
  text: '订单查询',
  url: '/order'
}, {
  icon: <Icon type='renwuguanli' size='f' color='#29ab91'/>,
  text: '任务管理',
  url: ''
}, {
  icon: <Icon type='matoukucun' size='f' color={BRAND_COLOR}/>,
  text: '码头库存',
  url: ''
}, {
  icon: <Icon type='zaitukucun' size='f' color={BRAND_COLOR}/>,
  text: '在途库存',
  url: ''
}];/* Array.from(new Array(8)).map((_val, i) => ({
  icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
  text: `功能${i}`,
  url: '/cargo'
})); */

/* const NewsList = props => {
  const { data, renderItem, rowKey='', className='', loading } = props;
  return (
    loading ? 
    <div style={{minHeight: 128, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator text='加载中...'/>
    </div>
    : data ?
    <div className={`${styles.newsList} ${className}`}>
      {
        data.map(item => {
          return (
            <div className={`${styles.newsItem} line1px`} key={typeof rowKey === 'function' ? rowKey(item) : item.id}>
              { renderItem && renderItem(item) }
            </div>
          )
        })
      }
    </div> : null
  )
} */

const AccountCard = props => {
  return <div className={styles.accountCard}><h1>首页</h1></div>
}

const mapStateToProps = ({ any }) => {
  return {
    ...any,
    ...mapLoading('any',{
      fetchNewsing: 'fetchNews'
    })
  }
}

const mapDispatchToProps = ({ any }) => ({
  ...mapEffects(any, ['fetchNews'])
})
@connect(mapStateToProps, mapDispatchToProps)
class Home extends PureComponent {
  state = {
    imgHeight: 220
  }
  componentDidMount() {
   /*  this.props.fetchNews({
      crudType: 'retrieve',
      current: 1,
      size: 10,
      status: 'P'
    }); */
  }
  renderLogisticsItem(item) {
    return (
      <div className={styles.logisticsItem}>
        <div className={styles.logisticsRoute}>
          <span>宁波</span>
          <span>鼠浪湖</span>
        </div>
        {/* <div className={styles.logisticsExtra}>
          <span>¥</span>
          2000
        </div> */}
      </div>
    );
  }
  handleLinkTo = el => {
    const { history } = this.props;
    const { url='' } = el;
    if(!url) {
      return Toast.info('即将到来')
    }
    history.push(url);
  }
  render() {
   // const { news:{ recordList } } = this.props
    return (
      <Screen className={styles.homeScreen}>
        <div className={styles.banner}>
          <AccountCard/>
          <BannerMask/>
        </div>
        <div className={styles.gridContainer}>
          <div className={styles.gridWrapper}>
            <Grid
              className={styles.fnGrid} 
              data={data} 
              square={false} 
              hasLine={false} 
              activeStyle={false} 
              onClick={this.handleLinkTo}
            />
          </div>
        </div>
        <div className={styles.indexCard}>
          <div className={styles.indexCardHeader}>
            <h2 className={styles.indexCardTitle}><span>物流产品</span></h2>
            <Link to='/'><span>更多</span><Icon type='xiayiyeqianjinchakangengduo' color='#a4a9b0' size='xxs'/></Link>
          </div>
          <div className={styles.indexCardBody}>
            <div className={styles.cardList}>
              {
                new Array(5).fill(0).map((item, index) => (
                  <div className={`${card.cardItem} ${styles.bottomLine}`} key={index}>
                    <div className={card.cardItemHeader}>
                      <Flex justify='between' className={card.routeName}>
                        <span><b>测试地址地址</b><i>出发地</i></span>
                        <span><b>沙钢海力码头</b><i>目的地</i></span>
                        <span><b>江运+装卸</b><i>作业类型</i></span>
                      </Flex>
                    </div>
                    <div className={card.cardItemBody}>
                      距离约<b>1000</b>公里, 时长约<b>3</b>天
                    </div>
                    <div className={card.cardItemExtra}>
                      <Flex justify='between'>
                        <span><Icon type='yonghu' size='xxs'/> 张三</span>
                        <span><Icon type='dianhua' size='xxs'/> 13245543453</span>
                        <span><Icon type='chuan' size='xxs'/> 集装箱船</span>
                      </Flex>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div className={styles.indexCard}>
          <div className={styles.indexCardHeader}>
            <h2 className={styles.indexCardTitle}><span>货盘信息</span></h2>
            <Link to='/'><span>更多</span><Icon type='xiayiyeqianjinchakangengduo' color='#a4a9b0' size='xxs'/></Link>
          </div>
          <div className={styles.indexCardBody}>
            <div className={styles.cardList}>
              {
                new Array(5).fill(0).map((item, index) => (
                  <div className={`${card.cardItem} ${styles.bottomLine}`} key={index}>
                    <div className={card.cardItemHeader}>
                      <Flex justify='between' className={card.routeName}>
                        <span><b>测试地址地址</b><i>出发地</i></span>
                        <span className={card.arrowLine}><ArrowLine/></span>
                        <span><b>沙钢海力码头</b><i>目的地</i></span>
                        <span><b>12000</b><i>货物吨位</i></span>
                      </Flex>
                    </div>
                    <div className={card.cardItemBody}>
                      <p>客户<b>马钢</b>，货物<b>石英砂(铁矿石)</b></p>
                      <p>有效期<b>2019-06-22～2019-06-31</b></p>
                    </div>
                    <div className={card.cardItemExtra}>
                      <span><Icon type='shijian' size='xxs'/> 要求2019-06-26</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        
        <div className={styles.indexCard}>
          <div className={styles.indexCardHeader}>
            <h2 className={styles.indexCardTitle}><span>运力信息</span></h2>
            <Link to='/'><span>更多</span><Icon type='xiayiyeqianjinchakangengduo' color='#a4a9b0' size='xxs'/></Link>
          </div>
          <div className={styles.indexCardBody}>
            <div className={styles.cardList}>
              {
                new Array(5).fill(0).map((item, index) => (
                  <div className={`${card.cardItem} ${styles.bottomLine}`} key={index}>
                    <div className={card.cardItemHeader}>
                      <Flex justify='between' className={card.routeName}>
                        <span><b>联合50</b><i>名称</i></span>
                        <span><b>50000</b><i>载重吨</i></span>
                        <span><b>沙钢海力码头</b><i>空闲地</i></span>
                        {/* <span><b>江船</b><i>类型</i></span> */}
                      </Flex>
                    </div>
                    <div className={card.cardItemBody}>
                      服务商<b>浙江船公司</b>
                    </div>
                    <div className={card.cardItemExtra}>
                      <Flex justify='between'>
                        <span><Icon type='yonghu' size='xxs'/> 张三</span>
                        <span><Icon type='dianhua' size='xxs'/> 13245543453</span>
                        <span><Icon type='chuan' size='xxs'/> 江船</span>
                      </Flex>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        

      </Screen>
    )
  }
}

/* <Grid
              data={new Array(12)}
              renderItem={item => this.renderLogisticsItem(item)}
              columnNum={2}
              hasLine={false}
              itemStyle={{padding: '0 8px'}}
              square={false}
              activeStyle={false}
            /> */

export default withRouter(Home);