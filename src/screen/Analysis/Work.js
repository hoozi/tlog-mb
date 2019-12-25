import React, { useState, useCallback, useEffect } from 'react';
import { List, Badge } from 'antd-mobile';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.module.less';
import CenterLoading from '../../component/CenterLoading';
import Empty from '../../component/Empty';

const OrderItem = ({data}) => {
  return (
    <List.Item
      extra={<b className='text-primary'>{data.planQuantity}吨</b>}
    >
      {data.loadName}<span className={styles.splitText}>至</span>{data.unloadName}
      <List.Item.Brief className='mt4'>
        <Badge text={data.skuName} style={{ backgroundColor: '#21b68a', borderRadius: 2 }} />
        <Badge text={data.bizTypeName} style={{marginLeft: 8, backgroundColor: '#3c73f0', borderRadius: 2 }} />
        {
          data.contractNo &&
          <Badge text={data.contractNo} style={{ 
            marginLeft: 8,
            backgroundColor: '#fff', 
            borderRadius: 2,
            color: '#3c73f0',
            border: '1px solid #3c73f0', 
          }} />
        }
      </List.Item.Brief>
    </List.Item>
  )
};
//const TaskItem = props => null;

const Work = props => {
  const { analysis, fetchOrderTaskAnalysising } = props;
  const [ selectedKey, setSelected ] = useState(0);
  const [ currentData, setCurrentData ] = useState([])
  const handleSelectNumberTab = useCallback(key => {
    if(key === selectedKey) return;
    setSelected(key);
    setCurrentData(analysis.orderTask[key].list);
  }, [selectedKey]);
  useEffect(() => {
    props.fetchOrderTaskAnalysis(data => {
      setCurrentData(data[0].list)
    });
  }, []);
  const workTabs = [{
    title: '进行中的订单',
    count: analysis.orderTask.length && analysis.orderTask[0].total ? 
           analysis.orderTask[0].total : 
           '-',
    key: 0
  },{
    title: '进行中的任务',
    count: analysis.orderTask.length && analysis.orderTask[1].total ? 
           analysis.orderTask[1].total : 
           '-',
    key: 1
  }]
  return (
    <>
      <div className={styles.numberCard}>
        {
          workTabs.length && workTabs.map(item => {
            const classnames = classNames(styles.numberItem,{
              [styles.numberItemActive]: item.key === selectedKey
            });
            return (
              <div className={classnames} key={item.key} onClick={() => handleSelectNumberTab(item.key)}>
                <p>
                  <b>{item.count}</b>
                </p>
                <span className='mt8 db'>{item.title}</span>
              </div>
            )
          })
        }
      </div>
      {
        fetchOrderTaskAnalysising ? 
        <CenterLoading/> :
        currentData && currentData.length ? 
        <List className={styles.workList}>
          {
            currentData.map(item => <OrderItem key={item.id} data={item}/>)
          }  
        </List> : <Empty/>
      }
      
    </>
  )
}

const mapStateToProps = ({analysis}) => ({
  analysis,
  ...mapLoading('analysis', {
    fetchOrderTaskAnalysising: 'fetchOrderTaskAnalysis'
  })
});
const mapDispatchToProps = ({analysis}) => mapEffects(analysis, ['fetchOrderTaskAnalysis'])

export default connect(mapStateToProps, mapDispatchToProps)(Work);
