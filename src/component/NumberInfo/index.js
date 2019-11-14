import React from 'react';
import { Icon } from 'antd-mobile';
import classNames from 'classnames';
import styles from './index.module.less';

const NumberInfo = ({ theme, title, subTitle, total, subTotal1, status1, subTotal2, status2, suffix, gap=8, ...rest }) => (
  <div
    className={classNames(styles.numberInfo, {
      [styles[`numberInfo${theme}`]]: theme,
    })}
    {...rest}
  >
    {title && (
      <div className={styles.numberInfoTitle} title={typeof title === 'string' ? title : ''}>
        {title}
      </div>
    )}
    {subTitle && (
      <div
        className={styles.numberInfoSubTitle}
        title={typeof subTitle === 'string' ? subTitle : ''}
      >
        {subTitle}
      </div>
    )}
    <div className={styles.numberInfoValue} style={gap ? { marginTop: gap } : null}>
      <span>
        {total}
        {suffix && <em className={styles.suffix}>{suffix}</em>}
      </span>
    </div>
    <div className={styles.subTotalContainer}>
      {(status1 || subTotal1) && (
        <div className={styles.subTotal}>
          <span>同比</span>
          <span className='ml4'>{subTotal1}</span>
          {status1 && <Icon type={`_${status1}`} size='xxs'/>}
        </div>
      )}
      {(status2 || subTotal2) && (
        <div className={styles.subTotal}>
          <span>环比</span>
          <span className='ml4'>{subTotal2}</span>
          {status2 && <Icon type={`_${status2}`} size='xxs'/>}
        </div>
      )}
    </div>
  </div>
);

export default NumberInfo;
