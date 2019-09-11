import React from 'react';
import { NavBar } from 'antd-mobile';
import Screen from '@/component/Screen';
import LoginCheckArea from '@/hoc/LoginCheckArea';
import styles from './index.less';

export default props => {
  return (
    <Screen
      className={styles.accountScreen}
      header={() =>(
        <NavBar   
          mode='dark'
        >
          我的
        </NavBar>
      )}
    >
      <LoginCheckArea>
        <h1>Account</h1>
      </LoginCheckArea>
    </Screen>
  )
}