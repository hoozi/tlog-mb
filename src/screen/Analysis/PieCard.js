import React, { useState } from 'react';
import { Flex, SegmentedControl } from 'antd-mobile';
import styles from './index.module.less';
import { toFixed2 } from '@/utils';
import Pie from '@/component/Charts/Pie';
import CenterLoading from '@/component/CenterLoading';
import Empty from '@/component/Empty';

export default props => {
  const { pieData, pieColor, totalTitle, total, onYearChange, years, loading } = props;
  const [ selectedIndex, setSelectedIndex ] = useState(0);
  const handleYearChange = e => {
    const index = e.nativeEvent.selectedSegmentIndex
    setSelectedIndex(index);
    onYearChange && onYearChange(index);
  }
  return (
    <div className={styles.pieCard}>
      {
        years && 
        <div className={styles.pieCardHeader}>
          <SegmentedControl selectedIndex={selectedIndex} values={years.map(item=>item.name)} onChange={handleYearChange} style={{height: 32}}/>
        </div>
      }
      {
        loading ?
        <div style={centerContaienrStyle}><CenterLoading text='加载中...'/></div> :
        pieData && pieData.length ? 
        <>
          <Flex justify='around'>
            <div className={styles.total}>
              <h2 className={styles.totalTitle}>{totalTitle}</h2>
              <div className={styles.totalCount}>{toFixed2(total/10000)}</div>
            </div>
            <div className={styles.pieContainer}>
              <Pie
                data={pieData}
                width={140}
                height={140}
                color={['name', pieColor]}
              />
            </div>
          </Flex>
          <div className={styles.pieLegend}>
            {
              pieColor.map((item, index) => {
                return (
                  index <= pieData.length-1 &&
                  <div key={item} className={styles.pieLegendItem}>
                    <span className={styles.pieLegendDot} style={{backgroundColor: item}}></span>
                    <div className={styles.pieLegendName}>{pieData[index].name}</div>
                    <div className={styles.pieLegendValue}>{toFixed2(pieData[index].x/10000)}</div>
                  </div>
                )
              })
            }
          </div>
        </> : <div style={centerContaienrStyle}><Empty description='暂无统计数据'/></div>
      }
      
    </div>
  )
}


const centerContaienrStyle = {
  minHeight: 200,
  position: 'relative' 
}