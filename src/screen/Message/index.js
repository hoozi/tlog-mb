import React, { PureComponent } from 'react';
import { NavBar } from 'antd-mobile';
import Screen from '@/component/Screen';

import Empty from '@/component/Empty';
import styles from './index.module.less';
/* 
const mapStateToProps = ({ news }) => {
  return {
    ...news,
    ...mapLoading('news',{
      fetchNewing: 'fetchNews'
    })
  }
}

const mapDispatchToProps = ({ news }) => ({
  ...mapEffects(news, ['fetchNews'])
});


@connect(mapStateToProps, mapDispatchToProps) */
class Message extends PureComponent {
  render() {
    return (
      <Screen
        className={styles.messageScreen}
        header={() =>(
          <NavBar   
            mode='dark'
          >
            消息
          </NavBar>
        )}
      >
        
        <Empty/>
      </Screen>
    )
  }
}

export default Message;