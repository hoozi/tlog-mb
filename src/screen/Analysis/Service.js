import React from 'react';
import PieCard from './PieCard';
import BarCard from './BarCard';

const color = [
  '#1890FF', 
  '#f5222d', 
  '#ffbb96',
  '#eb2f96', 
  '#faad14', 
  '#fadb14', 
  '#a0d911',
  '#52c41a',
  '#13c2c2',
  '#2f54eb'
]

const data1 = [{
  name: '今年',
  x: '1月',
  y: 18.9,
}, {
  name: '今年',
  x: '2月',
  y: 28.8,
}, {
  name: '今年',
  x: '3月',
  y: 39.3,
}, {
  name: '今年',
  x: '4月',
  y: 81.4,
}, {
  name: '今年',
  x: '5月',
  y: 47,
}, {
  name: '今年',
  x: '6月',
  y: 20.3,
}, {
  name: '今年',
  x: '7月',
  y: 24,
}, {
  name: '今年',
  x: '8月',
  y: 35.6,
}, {
  name: '今年',
  x: '9月',
  y: 45.6,
}, {
  name: '今年',
  x: '10月',
  y: 78.6,
}, {
  name: '今年',
  x: '11月',
  y: 34.6,
}, {
  name: '今年',
  x: '12月',
  y: 65.6,
}, {
  name: '去年',
  x: '1月',
  y: 12.4,
}, {
  name: '去年',
  x: '2月',
  y: 23.2,
}, {
  name: '去年',
  x: '3月',
  y: 34.5,
}, {
  name: '去年',
  x: '4月',
  y: 99.7,
}, {
  name: '去年',
  x: '5月',
  y: 52.6,
}, {
  name: '去年',
  x: '6月',
  y: 35.5,
}, {
  name: '去年',
  x: '7月',
  y: 37.4,
}, {
  name: '去年',
  x: '8月',
  y: 42.4,
}, {
  name: '去年',
  x: '9月',
  y: 46.4,
}, {
  name: '去年',
  x: '10月',
  y: 44.4,
}, {
  name: '去年',
  x: '11月',
  y: 43.4,
}, {
  name: '去年',
  x: '12月',
  y: 52.4,
}];

const data = [
  {
    name: '马钢',
    x: 2000,
    y: 1
  },
  {
    name: '梅山',
    x: 3456,
    y: 1
  },
  {
    name: '嘉兴',
    x: 3400,
    y: 1
  },
  {
    name: '马钢1',
    x: 2000,
    y: 1
  },
  {
    name: '梅山1',
    x: 3566,
    y: 1
  },
  {
    name: '嘉兴1',
    x: 45000,
    y: 1
  },
  {
    name: '嘉兴2',
    x: 4000,
    y: 1
  },
  {
    name: '嘉兴3',
    x: 20000,
    y: 1
  },
  {
    name: '嘉兴4',
    x: 4300,
    y: 1
  },
  {
    name: '嘉兴12',
    x: 8000,
    y: 1
  }
]

const Customer = props => {
  const years = [
    {
      name: '今年',
      value: '1'
    },
    {
      name: '去年',
      value: '2'
    }
  ]
  return (
    <>
      <PieCard
        years={years}
        pieColor={color}
        pieData={data}
        totalTitle='今年服务商业务量总计'
        total={data.reduce((cur, pre) => cur+pre.x,0)}
      />
      <BarCard
        data={data1}
        title='服务商月度统计'
      />
    </>
  )
}

export default Customer;