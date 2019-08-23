import React from 'react';
import styles from './index.less';

export default props => (
  <div className={`${styles.iconArrow} ${props.className || ''}`} style={{width: (props.num-1)*12+16}}>
    {
      new Array(props.num).fill(0).map((item, index) => {
        const lastStyle = index === props.num-1 ? { width: 16 } : {};
        return <i key={index} className={styles.iconArrowLine} style={{left: index*12, ...lastStyle}}></i>
      })
    }
  </div>
)