import React from 'react';
import styles from './index.module.less';

export default props => {
    const { header=null, fixed = false, className='', style={}, zIndex=10 } = props;
    return (
      <div className={`${styles.screen} ${className} ${fixed ? styles.screenPadding : ''}`} style={{...style}}>
        {
          header ? 
          <div className={styles[ fixed ? 'screenHeaderFixed' : 'screenHeader' ]} style={{zIndex}}>
            { header() } 
          </div> : 
          null
        }
        {props.children}
      </div>
    )
}

