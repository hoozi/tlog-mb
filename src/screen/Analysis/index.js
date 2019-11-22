import React, { Component, lazy, Suspense } from 'react';
import { NavBar, Icon, Tabs } from 'antd-mobile';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import styles from './index.module.less';
import { mapEffects, mapLoading } from '@/utils';
import color from '@/constants/color';

const { tabsStyle } = color;

const WorkAsync = lazy(() => import('./Work'));
const CustomerAsync = lazy(() => import('./Customer'));
const ServiceAsync = lazy(() => import('./Service'));
const PriceAsync = lazy(() => import('./Price'));

const tabsData = [
  {
    title: <><Icon type='zongji' size='xs' className='mr4'/> 当前</>,
    key: 'work'
  },
  {
    title: <><Icon type='kehu' size='xs' className='mr4'/> 客户</>,
    key: 'customer'
  },
  {
    title: <><Icon type='fuwushang' size='xs' className='mr4'/> 服务商</>,
    key: 'service'
  },
  {
    title: <><Icon type='yunjia' size='xs' className='mr4'/> 运价</>,
    key: 'price'
  }
];

const CurrentComponent = props => {
  const analysis = {
    'work': <WorkAsync/>,
    'customer': <CustomerAsync/>,
    'service': <ServiceAsync/>,
    'price': <PriceAsync/>
  }
  return analysis[props.is];
}

const mapStateToProps = ({ analysis }) => {
  return {
    analysis,
    ...mapLoading('analysis', {
      fetchYMWAnalysising: 'fetchYMWAnalysis'
    })
  }
}

const mapDispatchToProps = ({ analysis }) => mapEffects(analysis, ['fetchYMWAnalysis']);

@connect(mapStateToProps, mapDispatchToProps)
class Analysis extends Component {
  state = {
    current: 'work'
  }
  getCurrentCustomer(id) {
    const { analysis: { customers } } = this.props;
    const findedCurrentCustomer = customers.filter(item => item.value === id)[0];
    const currentCustomer = {
      customer: findedCurrentCustomer.label,
      customerId: findedCurrentCustomer.value
    }
    this.setState({
      currentCustomer
    })
  }
  componentDidMount() {
   /*  this.props.fetchYMWAnalysis(customers => {
      this.getCurrentCustomer(customers[0].value)
    }); */
  }
  handleCustomerChange = value => {
    this.getCurrentCustomer(value[0])
  }
  handleAnalysisTabChange = tab => {
    const { key:current } = tab;
    this.setState({
      current
    })
  }
  render() {
    const { history } = this.props;
    return (
      <Screen
        className={styles.analysisScreen}
        header={() => (
          <NavBar
            mode='dark'
            icon={<Icon type='left' size='lg' />}
            onLeftClick={() => history.goBack()}
          >
            统计分析
          </NavBar>
        )}
      >
      <StickyContainer className={styles.analysisFullHeight}>
        <Sticky>
          {
            ({style}) => (
              <div style={{...style, zIndex: 10,height: 43}}>
                <Tabs 
                  initialPage={0} 
                  tabs={tabsData} 
                  {...tabsStyle} 
                  renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
                  onChange={this.handleAnalysisTabChange}
                />
              </div>
            )
          }
        </Sticky>
        <div className={styles.analysisComponentContainer}>
          <Suspense fallback={<CenterLoading text='加载中...'/>}>
            <CurrentComponent is={this.state.current}/>
          </Suspense>
        </div>
        </StickyContainer>
      </Screen>
    )
  }
}

export default Analysis;
