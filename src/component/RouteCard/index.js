import React, {forwardRef} from 'react';
import { Flex } from 'antd-mobile';
import styles from './index.less';

export default forwardRef(({from, to, ...props}, ref) => (
  <div className={styles.routeCard} {...props} ref={ref}>
    <div className={styles.routeName}>
      <Flex justify='between'> 
        <span>
          <b>{from}</b>
          <i>装货地</i>
        </span>
        <span>
          <b>{to}</b>
          <i>卸货地</i>
        </span>
      </Flex>
    </div>
  </div>
))