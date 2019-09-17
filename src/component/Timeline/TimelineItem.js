import React from 'react';
import styles from './index.less';

export default props => {
  const date = props.time ? props.time.split(' ') : [];
  return (<div className={`${styles.timelineItem} ${props.className || ''}`} style={{paddingLeft: props.time ? 112 : 0}}>
    {
      props.time ? 
      <div className={styles.timelineTime}><span>{date[1]}</span><span>{date[0]}</span></div> :
      null
    }
    <div className={`${styles.timelineTail} ${props.last ? styles.timelineTailLast : ''}`} style={{left: props.time ? 116 : 10}}></div>
    <div className={`${styles.timelineHead} ${styles['timelineHead'+(props.color || 'gray')]}`}></div>
    <div className={styles.timelineContent}>{props.children}</div>
  </div>)
}
