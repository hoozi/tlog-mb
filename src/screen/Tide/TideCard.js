import React, { useState } from 'react';
import { Chart, Axis, Geom, Tooltip } from 'bizgoblin';
import { Icon } from 'antd-mobile';
import styles from './index.module.less';
import Empty from '@/component/Empty';
import { BRAND_COLOR } from '@/constants/color';
import { PIXEL_RATIO } from '@/constants';

const defs = [
  {
    dataKey: 'time',
    range: [0, 1],
    tickCount: 24,
  },
  {
    dataKey: 'value',
    tickCount: 5,
    min: 0,
  },
];

const showTooltip = e => {
  const { items } = e;
  items[0].name = '潮高';
  items[0].title = `${items[0].title}时`;
}

function formatLabel() {
  return {
    
  };
}

const TideChart = ({data}) => (
  <div className='pt16'>
    <span className={styles.tideUnit}>单位:cm</span>
    <Chart padding='auto' data={data.map(item => ({...item, value: parseInt(item.value)}))} defs={defs} pixelRatio={PIXEL_RATIO} >
      <Axis dataKey='time' label={formatLabel}/>
      <Axis dataKey='value'/>
      <Tooltip 
        showCrosshairs 
        snap 
        showXTip 
        showYTip 
        crosshairsType='xy'
        crosshairsStyle={{
          lineDash: [2]
        }}
        onShow={showTooltip}
      />
      <Geom geom='area' position='time*value' />
      <Geom geom='line' position='time*value'  />
    </Chart>
  </div>
)

export default props => {
  const { data } = props;
  const [isChart, toggle] = useState(true);
  return (
    <div className={styles.tideCard}>
      <div className={styles.tideCardHeader}>
        <b>{data.regionChineseName}</b>
        <Icon type='tubiao' size='xs' color={isChart ? BRAND_COLOR : '#a5bef8'} onClick={() => toggle(!isChart)}/>
      </div>
      <div className={styles.tideCardBody}>
        {
          data.list && data.list.length ? 
          (
            isChart ? 
            <TideChart data={data.list}/> : 
            <div className={styles.tideTableContainer}>
              <table width='100%' className={styles.tideTable}>
                <thead>
                  <tr>
                    <th>潮时</th>
                    <th>潮高(cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.list.map((item,index)=>(
                      <tr key={index}>
                        <td>{item.time}</td>
                        <td>{item.value}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) :
          <Empty/>
        }
      </div>
    </div>
  )
}