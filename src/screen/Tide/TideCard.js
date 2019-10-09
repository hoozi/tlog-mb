import React from 'react';
import styles from './index.less';
import { Chart, Axis, Geom, Tooltip } from 'bizgoblin';
import Empty from '@/component/Empty';

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

const pixelRatio = window.devicePixelRatio * 2;

const showTooltip = e => {
  const { items } = e;
  items[0].name = '潮高';
}

function formatLabel() {
  return {
    rotate: -45,
    textAlign: 'end',
    textBaseline: 'middle'
  };
}

export default props => {
  const { data } = props;
  return (
    <div className={styles.tideCard}>
      <div className={styles.tideCardHeader}>
        <b>{data.regionChineseName}</b>
        <span>单位:cm</span>
      </div>
      <div className={styles.tideCardBody}>
        {
          data.list && data.list.length ? 
          <Chart width='100%' data={data.list.map(item => ({...item, value: parseInt(item.value)}))} defs={defs} pixelRatio={pixelRatio} >
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
          </Chart> :
          <Empty/>
        }
      </div>
    </div>
  )
}