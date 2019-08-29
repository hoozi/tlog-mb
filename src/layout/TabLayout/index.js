import React, { useState } from 'react';
import { TabBar, Icon } from 'antd-mobile';
import color from '../../constants/color';
import styles from './index.less';
import Home from '@/screen/Home';
import News from '@/screen/News';
import Message from '@/screen/Message';
import Account from '@/screen/Account';

const TabBarItem = TabBar.Item;
const tabBarItems = [
  {
    title: '首页',
    key: 'Home',
    icon: <Icon type='shouye'/>,
    selectedIcon: <Icon type='shouye'/>,
    component: Home
  },
  {
    title: '资讯',
    key: 'News',
    icon: <Icon type='xinwenzixun'/>,
    selectedIcon: <Icon type='xinwenzixun'/>,
    component: News
  },
  {
    title: '消息',
    key: 'Message',
    icon: <Icon type='lingdang'/>,
    selectedIcon: <Icon type='lingdang'/>,
    component: Message
  },
  {
    title: '我的',
    key: 'Account',
    icon: <Icon type='yonghu'/>,
    selectedIcon: <Icon type='yonghu'/>,
    component: Account
  }
]

const dot = true;

export default props => {
  const { tabBarColor } = color;
  const [selected, setSelected] = useState('Home');
  const handleSelect = name => {
    if(name!==selected) {
      setSelected(name)
    }
  }
  return (
    <div className={styles.tabLayout}>
      <TabBar
        {...tabBarColor}
        prerenderingSiblingsNumber={0}
      >
        {
          tabBarItems.map(item => {
            const { key, component: Component } = item;
            return (
              <TabBarItem 
                {...item} 
                dot={!!(key === 'Message' && dot)}
                selected={selected === key} 
                onPress={() => handleSelect(key)}
              >
                <Component/>
              </TabBarItem>
            )
          })
        }
      </TabBar>
    </div>
  )
}