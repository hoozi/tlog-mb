import React from 'react';
import { Icon, Flex } from 'antd-mobile';
import classNames from 'classnames';
import styles from './index.module.less';

const NumberInfo = ({ theme, title, subTitle, total, subTotal, status, suffix, gap=8, ...rest }) => (
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
      <Flex justify='between'>
        <span>
          {total}
          {suffix && <em className={styles.suffix}>{suffix}</em>}
        </span>
        {(status || subTotal) && (
          <span className={styles.subTotal}>
            {subTotal}
            {status && <Icon type={status} size='xxs'/>}
          </span>
        )}
      </Flex>
    </div>
  </div>
);

export default NumberInfo;
