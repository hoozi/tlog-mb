import React from 'react';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizgoblin';
import { PIXEL_RATIO } from '@/constants';

export default props => {
  const { data, polyline } = props;
  return (
    <Chart width='100%' data={data} animate={{ type: 'scaley' }} pixelRatio={PIXEL_RATIO}>
      <Axis dataKey='x' />
      <Axis dataKey='y' />
      <Legend show={!polyline}/>
      <Tooltip showCrosshairs={polyline}/>
      {
        polyline ?
        <>
          <Geom geom='line' position='x*y' color='name' />
          <Geom geom='point' position='x*y' color='name' style={{ lineWidth: 1, stroke: '#FFF' }} />
        </> :
        <Geom geom='interval' position='x*y' color='name' adjust={{ type: 'dodge', marginRatio: 0.05 }} />
      }
    </Chart>
  )
}
