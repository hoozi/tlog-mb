import React, { useState, useCallback } from 'react';
import { List, Badge } from 'antd-mobile';
import classNames from 'classnames';
import styles from './index.module.less';

const Work = props => {
  const { tabs=[], onTabChange } = props
  const [ selectedKey, setSelected ] = useState(0);
  const handleSelectNumberTab = useCallback(key => {
    if(key === selectedKey) return;
    onTabChange && onTabChange(key)
    setSelected(key);
  }, [selectedKey, onTabChange])
  return (
    <>
      <div className={styles.numberCard}>
        {
          tabs.length && tabs.map(item => {
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
      <List className={styles.workList}>
        <List.Item
          extra={<b className='text-primary'>2,333吨</b>}
        >
          鼠浪湖<span className={styles.splitText}>至</span>马钢
          <List.Item.Brief className='mt4'>
            <Badge text='装货' style={{ backgroundColor: '#3c73f0', borderRadius: 2 }} />
            <Badge text='20190101234543' style={{ 
              marginLeft: 8,
              backgroundColor: '#fff', 
              borderRadius: 2,
              color: '#3c73f0',
              border: '1px solid #3c73f0', 
            }} />
          </List.Item.Brief>
        </List.Item>
      </List>
    </>
  )
}

export default Work;