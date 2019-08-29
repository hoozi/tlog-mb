import React,{ PureComponent } from 'react';
import { NavBar, Icon, Flex, Button } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { createForm } from 'rc-form';
import { Sticky, StickyContainer } from 'react-sticky';
import find from 'lodash/find';
import Screen from '@/component/Screen';
import BannerMask from '@/component/BannerMask';
import { mapEffects } from '@/utils';
import styles from './index.less';
import form from '@/style/form.less';

const mapStateToProps = ({product}) => ({
  ...product
})

const mapDispatchToProps = ({product}) => mapEffects(product, [''])

@connect(mapStateToProps,mapDispatchToProps)
@createForm()
class PriceReplyDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    const { location:{search}, recordList } = this.props;
    const id = parse(search.substring(1))['id'];
    const data = find(recordList.map(item => {
      const { effectiveDate='', expireDate='' } = item;
      return {
        ...item,
        effectiveDate: effectiveDate.substring(0,10),
        expireDate: expireDate.substring(0,10)
      }
    }), item => item.id === id)
    this.setState({
      data
    })
  }
  render(){
    const { history } = this.props;
    const { data } = this.state;
    return (
      <Screen
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            产品详情
          </NavBar>
        )}
      >
        <StickyContainer>
          {
            data ? 
            <>
              <div className={styles.routeCard}>
                <Sticky>
                  {
                    ({style}) => (
                      <div className={styles.routeName} style={{...style, zIndex: 20}}>
                        <Flex justify='between'> 
                          <span>
                            <b>{data.originName}</b>
                            <i>出发地</i>
                          </span>
                          <span>
                            <b>{data.terminalName}</b>
                            <i>目的地</i>
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
                  <div className={styles.detailListItem}>
                    <Flex justify='between'>
                      <div>
                        <Icon type='licheng' size='xxs'/>
                        <span>里程{data.mileage}公里,时长{data.days}天</span>
                      </div>
                      <b className='text-primary' style={{fontWeight: '500'}}>{data.shipTypeName}</b>
                    </Flex>
                  </div>
                  <div className={styles.detailListItem}>
                    <Icon type='shijian' size='xxs'/>
                    <span>{data.effectiveDate} ～ {data.expireDate}</span>
                  </div>
                  <div className={styles.detailListItem}>
                    <Icon type='yonghu' size='xxs'/>
                    <span>张三，13245534345</span>
                  </div>
                  <div className={styles.detailListItem}>
                    <div className={styles.detailNote}>{data.introduction === ' ' ? '暂无备注' : data.introduction}</div>
                  </div>
                  <Button 
                    type='primary' 
                    onClick={this.handleSubmit}
                    /* disabled={updatePriceReplying || hasError(getFieldsError())}
                    loading={updatePriceReplying} */
                    icon='shoucang'
                  >收藏产品</Button>
                </div>
              </div>
            </> :
            null
          }
        </StickyContainer>
      </Screen>
    )
  }
}

export default PriceReplyDetail;