import React from 'react';
import { Chart, Geom, Coord, Guide } from 'bizgoblin';
import numeral from 'numeral';
import { PIXEL_RATIO } from '@/constants';

const defs = [{
  dataKey: 'x'
}];

export default props => {
  const { data, color, totalTitle, total=0, width=280, height=280 } = props;
  
  return (
    <Chart width={width} height={height} defs={defs} padding='auto' data={data} pixelRatio={PIXEL_RATIO}>
      <Coord type='polar' transposed radius={1} innerRadius={0.5}/>
      <Geom
        geom='interval'
        position='y*x'
        color={color}
        adjust='stack'
        style={{
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round',
        }}
      />
      {/* <Legend 
        position='right'
        offsetX={-32}
        itemFormatter={value => `${value} ${numeral(map[value]).format('0,0')}吨`}
        nameStyle={{
          fontSize: 13
        }}
      /> */}
      {
        total &&
        <Guide
          type='html'
          position= {['50%', '50%']}
          alignX='middle'
          alignY='middle'
          html={
            `<div style='color:#8c8c8c;width:120px;font-size:12px;text-align: center;line-height:21px;'>
              ${totalTitle}<br/>
              <span style='color:#060606;font-size:18px;'>
                ${numeral(total).format('0,0')}
              </span>
            </div>`
          }
        />
      }
    </Chart>
  )
}
