import React from 'react';
import styles from './index.less';

export default props => {
    const { header=null, fixed = false, className='', style={} } = props;
    return (
      <div className={`${styles.screen} ${className} ${fixed ? styles.screenPadding : ''}`} style={{...style}}>
        {
          header ? 
          <div className={styles[ fixed ? 'screenHeaderFixed' : 'screenHeader' ]}>
            { header() } 
          </div> : 
          null
        }
        {props.children}
      </div>
    )
}

