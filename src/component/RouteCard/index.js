import React, {forwardRef} from 'react';
import { Flex } from 'antd-mobile';
import styles from './index.module.less';

export default forwardRef(({from, justify='center', fromText, to, toText, centerText, ...props}, ref) => (
  <div className={styles.routeCard} {...props} ref={ref}>
    <div className={styles.routeName}>
      <Flex justify={justify}> 
        <span>
          <b>{from}</b>
          <i>{fromText || '装货地'}</i>
        </span>
        <span>{centerText}</span>
        <span>
          <b>{to}</b>
          <i>{toText || '卸货地'}</i>
        </span>
      </Flex>
    </div>
  </div>
))