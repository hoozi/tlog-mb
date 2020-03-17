import React, { useEffect, useState } from 'react';
import { Flex, Card, Picker, Icon, SegmentedControl } from 'antd-mobile';
import { connect } from 'react-redux';
import { mapEffects, mapLoading } from '@/utils';
import Bar from '@/component/Charts/Bar';
import CenterLoading from '@/component/CenterLoading';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import styles from './index.module.less';
import Empty from '@/component/Empty';


const Price = props => {
  const { analysis, fetchPriceAnalysising } = props;
  const [place, setPlace] = useState({value:0});
  const [priceBar, setPriceBar] = useState({priceList:[]});
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    props.fetchPriceAnalysis({}, () => {
      props.findPriceByIndex({index:selectedIndex}, () => {
        getCurrentPlace(0);
        getCurrentData(0);
      });
    });
    return;
  }, []);
  const handleOk = value => {
    const index = value[0];
    getCurrentPlace(index);
    getCurrentData(index);
  }
  const handleIndexChange = e => {
    const index = e.nativeEvent.selectedSegmentIndex;
    setSelectedIndex(index);
    props.findPriceByIndex({index}, () => {
      getCurrentPlace(0);
      getCurrentData(0);
    });
  }
  const getCurrentPlace = index => {
    const currentPlace = analysis.placePicker[index];
    setPlace(currentPlace);
  }
  const getCurrentData = index => {
    const {priceList=[], ...reset} = analysis.price[index] ? analysis.price[index] : {};
    setPriceBar({
      ...reset,
      priceList
    });
  }
  const filteredPrice = priceBar.priceList.length ? priceBar.priceList.filter(item=>item.y > 0) : priceBar.priceList;
  return (
    fetchPriceAnalysising ? 
    <CenterLoading text='加载中...'/> : 
    <div className={styles.priceWrapper}>
      {
        analysis.allPriceData.length > 1 &&
        <div className='p16 bg-white'>
          <SegmentedControl selectedIndex={selectedIndex} values={['货主', '服务商']} style={{height: 32}} onChange={handleIndexChange}/>
        </div>
      }
      {
        analysis.placePicker.length && priceBar.priceList.length ?
        <>
          <Picker
            value={[place.value]}
            cols={1}
            data={analysis.placePicker}
            onOk={handleOk}
          >
            <Flex justify='start' className={styles.selectPlace}>
              <Flex.Item className={styles.placeItem}>
                <b>{place.start}</b>
                <span>出发地</span>
              </Flex.Item>
              <Flex.Item className={styles.placeItem}>
                <b>{place.end}</b>
                <span>目的地</span>
              </Flex.Item>
              <Icon type='xiayiyeqianjinchakangengduo' color='#999'/>
            </Flex>
          </Picker>
          <Card full style={{minHeight:0}}>
            <Card.Body>
              <Flex className={styles.priceContainer}>
                <Flex.Item className={styles.priceItem}>
                  <b><em>¥</em>{priceBar.priceList.length ? maxBy(priceBar.priceList, 'y').y.toFixed(2) : '-'}</b>
                  <span>全年最高</span>
                </Flex.Item>
                <Flex.Item className={styles.priceItem}>
                  <b><em>¥</em>{priceBar.priceList.length ? minBy(filteredPrice, 'y').y.toFixed(2) : '-'}</b>
                  <span>全年最低</span>
                </Flex.Item>
                <Flex.Item className={styles.priceItem}>
                  <b><em>¥</em>{filteredPrice.length ? (filteredPrice.reduce((cur, pre) => cur+pre.y,0)/filteredPrice.length).toFixed(2) : '-'}</b>
                  <span>全年平均</span>
                </Flex.Item>
              </Flex>
            </Card.Body>
          </Card>
          
          <Card full className='mt8'>
            <Card.Header
              title='月度运价走势(元)'
              className='pt16 pb16'
            />
            <Card.Body>
              <div>
                <Bar data={priceBar.priceList} polyline/>
              </div>
            </Card.Body>
          </Card>
        </> : <Empty/>
      }
    </div>
  )
}

const mapStateToProps = ({analysis}) => ({
  analysis,
  ...mapLoading('analysis', {
    fetchPriceAnalysising: 'fetchPriceAnalysis'
  })
});
const mapDispatchToProps = ({analysis}) => mapEffects(analysis, ['fetchPriceAnalysis', 'findPriceByIndex'])

export default connect(mapStateToProps, mapDispatchToProps)(Price);
