import React, { useEffect, useState } from 'react';
import { Flex, Card, Picker, Icon } from 'antd-mobile';
import { connect } from 'react-redux';
import { mapEffects, mapLoading } from '@/utils';
import Bar from '@/component/Charts/Bar';
import CenterLoading from '@/component/CenterLoading';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import styles from './index.module.less';

const data = [
  { x: '1月', name: '运价', y: 7 },
  { x: '2月', name: '运价', y: 23 },
  { x: '3月', name: '运价', y: 55 },
  { x: '4月', name: '运价', y: 10 },
  { x: '5月', name: '运价', y: 45 },
  { x: '6月', name: '运价', y: 22 },
  { x: '7月', name: '运价', y: 90 },
  { x: '8月', name: '运价', y: 67 },
  { x: '9月', name: '运价', y: 78 },
  { x: '10月', name: '运价', y: 99 },
  { x: '11月', name: '运价', y: 12 },
  { x: '12月', name: '运价', y: 34 }
];


const Price = props => {
  const { analysis, fetchPriceAnalysising } = props;
  const [place, setPlace] = useState({value:0});
  const [priceBar, setPriceBar] = useState([]);
  useEffect(() => {
    props.fetchPriceAnalysis(data => {
      getCurrentData(0);
      getCurrentPlace(0);
    });
  }, []);
  const handleOk = value => {
    const index = value[0];
    getCurrentPlace(index);
    getCurrentData(index);
  }
  const getCurrentPlace = index => {
    const currentPlace = analysis.placePicker[index];
    setPlace(currentPlace);
  }
  const getCurrentData = index => {
    const current = analysis.price[index];
    setPriceBar(current);
  }
  return (
    fetchPriceAnalysising ? 
    <CenterLoading text='加载中...'/> : 
    analysis.placePicker.length && <div className={styles.priceWrapper}>
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
          <Icon type='xiayiyeqianjinchakangengduo' color='#fff'/>
        </Flex>
      </Picker>
      <Card full style={{minHeight:0}}>
        <Card.Body>
          <Flex className={styles.priceContainer}>
            <Flex.Item className={styles.priceItem}>
              <b><em>¥</em>{maxBy(priceBar.priceList, 'y').y || '-'}</b>
              <span>全年最高</span>
            </Flex.Item>
            <Flex.Item className={styles.priceItem}>
              <b><em>¥</em>{minBy(priceBar.priceList, 'y').y || '-'}</b>
              <span>全年最低</span>
            </Flex.Item>
            <Flex.Item className={styles.priceItem}>
              <b><em>¥</em>{(priceBar.priceList.reduce((cur, pre) => cur+pre.y,0)/data.length).toFixed(1) || '-'}</b>
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
    </div>
  )
}

const mapStateToProps = ({analysis}) => ({
  analysis,
  ...mapLoading('analysis', {
    fetchPriceAnalysising: 'fetchPriceAnalysis'
  })
});
const mapDispatchToProps = ({analysis}) => mapEffects(analysis, ['fetchPriceAnalysis'])

export default connect(mapStateToProps, mapDispatchToProps)(Price);
