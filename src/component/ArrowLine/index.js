import React from 'react';
import styles from './index.less';

export default props => <div className={`${styles.iconArrow} ${props.className || ''}`}><i className={styles.iconArrowLine}></i></div>