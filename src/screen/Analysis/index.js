import React, { Component } from 'react';
import { NavBar, Icon, Card, Flex, SegmentedControl, Picker } from 'antd-mobile';
import { Chart, Geom, Coord, Legend, Guide } from 'bizgoblin';
import Screen from '@/component/Screen';
import NumberInfo from '@/component/NumberInfo';
import numeral from 'numeral';
import styles from './index.module.less';


const pixelRatio = window.devicePixelRatio * 2;


const data = [
  {
    'name': '煤炭',
    percent: 13444,
    a: '1',
  }, {
    'name': '铁矿石',
    percent: 1340,
    a: '1',
  }
];

const data2 = [
  {
    'name': '煤炭',
    percent: 33,
    a: '1',
  }, {
    'name': '铁矿石',
    percent: 50,
    a: '1',
  }
]

export default class Analysis extends Component {
  render() {
    const { history } = this.props
    return (
      <Screen
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            统计分析
          </NavBar>
        )}
      >
        <div className='p16'>
          <SegmentedControl values={['周', '月', '年']} style={{height: 26}}/>
        </div>
        <Card full className='pb0'>
          <Picker
            cols={1}
            data={[
              {
                lable:'测试',
                value: 1
              }
            ]}
            extra={<Icon type='xiayiyeqianjinchakangengduo' style={{verticalAlign: 'middle'}}/>}
          >
            <Card.Header
              title={<div className={styles.tag}><Icon type='huozhu' size='lg'/>马钢股份</div>}
              
            />
          </Picker>
          <Card.Body className={styles.analysisCardBody}>
            <div className={styles.analysisContainer}>
              <div className={styles.polarContainer}>
                <Chart width='280' height='280' data={data} pixelRatio={pixelRatio}>
                  <Coord type="polar" transposed radius={0.65} innerRadius={0.6}/>
                  <Geom
                    geom="interval"
                    position="a*percent"
                    color={['name', ['#1890FF', '#13C2C2']]}
                    adjust="stack"
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
                  <Guide
                    type='html'
                    position= {['50%', '50%']}
                    alignX='middle'
                    alignY='middle'
                    html={
                      `<div style="color:#8c8c8c;width:120px;font-size:12px;text-align: center;line-height:21px;">
                        总计(吨)<br/>
                        <span style="color:#060606;font-size:18px;">
                          ${numeral(13444+1340).format('0,0')}
                        </span>
                      </div>`
                    }
                  />
                </Chart>
              </div>
              <div className={styles.analysisCardVContainer}>
                <div className='mb16'>
                  <NumberInfo
                    subTitle={<span className={`${styles.analysisCardTitle} ${styles.bg1}`}>本周货量(煤炭)</span>}
                    total={numeral(13444).format('0,0')}
                    suffix='吨'
                    subTotal1={17.2}
                    status1='up'
                    subTotal2={17.2}
                    status2='down'
                  />
                </div>
                <div>
                  <NumberInfo
                    subTitle={<span className={`${styles.analysisCardTitle} ${styles.bg2}`}>本周货量(铁矿石)</span>}
                    total={numeral(1340).format('0,0')}
                    suffix='吨' 
                    subTotal1={17.2}
                    status1='up' 
                    subTotal2={17.3}
                    status2='down'
                  />
                </div>
              </div>
            </div>
            <div className={styles.analysisContainer}>
              <div className={styles.polarContainer}>
                <Chart width='280' height='280' data={data2} pixelRatio={pixelRatio}>
                  <Coord type="polar" transposed radius={0.65} innerRadius={0.6}/>
                  <Geom
                    geom="interval"
                    position="a*percent"
                    color={['name', ['#1890FF', '#13C2C2']]}
                    adjust="stack"
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
                  <Guide
                    type='html'
                    position= {['50%', '50%']}
                    alignX='middle'
                    alignY='middle'
                    html={
                      `<div style="color:#8c8c8c;width:120px;font-size:12px;text-align: center;line-height:21px;">
                        总计(艘次)<br/>
                        <span style="color:#060606;font-size:18px;">
                          ${numeral(50+33).format('0,0')}
                        </span>
                      </div>`
                    }
                  />
                </Chart>
              </div>
              <div className={styles.analysisCardVContainer}>
                <div className='mb16'>
                  <NumberInfo
                    subTitle={<span className={`${styles.analysisCardTitle} ${styles.bg1}`}>本周船(煤炭)</span>}
                    total={numeral(50).format('0,0')}
                    suffix='艘次'
                    subTotal1={17.2}
                    status1='up'
                    subTotal2={17.2}
                    status2='down'
                  />
                </div>
                <div>
                  <NumberInfo
                    subTitle={<span className={`${styles.analysisCardTitle} ${styles.bg2}`}>本周船(铁矿石)</span>}
                    total={numeral(33).format('0,0')}
                    suffix='艘次' 
                    subTotal1={17.2}
                    status1='up' 
                    subTotal2={17.3}
                    status2='down'
                  />
                </div>
              </div>
            </div>
            {/* <Flex className={styles.analysisCardContainer}>
              <Flex.Item>
                <NumberInfo
                  subTitle={<span className={`${styles.analysisCardTitle} ${styles.bg1}`}>本周船(煤炭)</span>}
                  total={numeral(13444).format('0,0')}
                  suffix='艘次'
                  subTotal1={17.2}
                  status1='up'
                  subTotal2={17.2}
                  status2='down'
                />
              </Flex.Item>
              <Flex.Item>
                <NumberInfo
                  subTitle={<span className={`${styles.analysisCardTitle} ${styles.bg2}`}>本周船(铁矿石)</span>}
                  total={numeral(134).format('0,0')}
                  suffix='艘次' 
                  subTotal1={17.2}
                  status1='up' 
                  subTotal2={17.3}
                  status2='down'
                />
              </Flex.Item>
            </Flex> */}
          </Card.Body>
        </Card>
      </Screen>
    )
  }
}
