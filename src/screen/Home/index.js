import React, { PureComponent } from 'react';
import {
  Grid,
  Icon,
  ActivityIndicator,
  Button,
  Flex
} from 'antd-mobile';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Screen from '@/component/Screen';
import BannerMask from '@/component/BannerMask';
import ArrowLine from '@/component/ArrowLine';
import styles from './index.less';
import { mapEffects, mapLoading } from '@/utils';
import withCache from '@/hoc/withCache';

const data = Array.from(new Array(8)).map((_val, i) => ({
  icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
  text: `功能${i}`,
}));

const NewsList = props => {
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
}

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
    this.props.fetchNews({
      crudType: 'retrieve',
      current: 1,
      size: 10,
      status: 'P'
    });
  }
  renderLogisticsItem(item) {
    return (
      <div className={styles.logisticsItem}>
        <div className={styles.logisticsRoute}>
          <span>宁波</span>
          <span className={styles.arrowLine}><ArrowLine/></span>
          <span>鼠浪湖</span>
        </div>
        {/* <div className={styles.logisticsExtra}>
          <span>¥</span>
          2000
        </div> */}
      </div>
    );
  }
  render() {
    const { news:{ recordList } } = this.props
    return (
      <Screen className={styles.homeScreen}>
        <div className={styles.banner}>
          <AccountCard/>
          <BannerMask/>
        </div>
        <div className={styles.gridContainer}>
          <div className={styles.gridWrapper}>
            <Grid data={data} hasLine={false} activeStyle={false} />
          </div>
        </div>
        <div className={styles.indexCard}>
          <div className={styles.indexCardHeader}>
            <h2 className={styles.indexCardTitle}><span>物流产品</span></h2>
            <Link to='/'><span>更多</span><Icon type='xiayiyeqianjinchakangengduo' color='#a4a9b0' size='xxs'/></Link>
          </div>
          <div className={styles.indexCardBody}>
            <div className={styles.cardList}>

              <div className={styles.cardItem}>
                <div className={styles.cardItemHeader}>
                  <Flex justify='between' className={styles.routeName}>
                    <span><b>测试地址地址</b><i>出发地</i></span>
                    <span className={styles.arrowLine}><ArrowLine/></span>
                    <span><b>沙钢海力码头</b><i>目的地</i></span>
                    <span><b>江运+装卸</b><i>作业类型</i></span>
                  </Flex>
                </div>
                <div className={styles.cardItemBody}>
                  距离约<b>1000</b>公里, 时长约<b>3</b>天, 船型为<b>远洋船</b>
                </div>
                <div className={styles.cardItemExtra}>
                  <span><Icon type='yonghu' size='xxs'/> 张三/13245543453</span>
                </div>
              </div>
              <div className={styles.cardItem}>
                <div className={styles.cardItemHeader}>
                  <Flex justify='between' className={styles.routeName}>
                    <span><b>测试地址地址</b><i>出发地</i></span>
                    <span className={styles.arrowLine}><ArrowLine/></span>
                    <span><b>沙钢海力码头</b><i>目的地</i></span>
                    <span className={styles.status}><b>江运</b><i>作业类型</i></span>
                  </Flex>
                </div>
                <div className={styles.cardItemBody}>
                  距离约<b>1000</b>公里, 时长约<b>3</b>天, 船型为<b>远洋船</b>
                </div>
                <div className={styles.cardItemExtra}>
                  <span><Icon type='yonghu' size='xxs'/> 张三/13245543453</span>
                </div>
              </div>
              <div className={styles.cardItem}>
                <div className={styles.cardItemHeader}>
                  <Flex justify='between' className={styles.routeName}>
                    <span><b>测试地址地址</b><i>出发地</i></span>
                    <span className={styles.arrowLine}><ArrowLine/></span>
                    <span><b>沙钢海力码头</b><i>目的地</i></span>
                    <span className={styles.status}><b>装卸</b><i>作业类型</i></span>
                  </Flex>
                </div>
                <div className={styles.cardItemBody}>
                  距离约<b>1000</b>公里, 时长约<b>3</b>天, 船型为<b>远洋船</b>
                </div>
                <div className={styles.cardItemExtra}>
                  <span><Icon type='yonghu' size='xxs'/> 张三/13245543453</span>
                </div>
              </div>

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

export default Home;