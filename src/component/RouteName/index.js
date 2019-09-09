import React from 'react';
import { Icon, Flex } from 'antd-mobile';
import { BRAND_COLOR } from '@/constants/color';
import styles from './index.less';

export default ({className = '', extra = '', ...props}) => (
  <Flex justify='between' className={`${styles.routeContainer} ${className}`}>
    <div>
      <div className={styles.routeListName}><Icon type='zhuang' size='xxs' color={BRAND_COLOR}/><span>{props.from || '未知'}</span></div>
      <div className={styles.routeListName}><Icon type='xie' size='xxs' color='#fa8c16'/><span>{props.to || '未知'}</span></div>
    </div>
    <div className={styles.routeExtra}>
      {/* <b className='text-primary'>{props. || '未知'}</b>
      <span>作业类型</span> */}
      { extra }
    </div>
  </Flex>
)