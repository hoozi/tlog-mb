import React, { useState, useEffect } from 'react';
import { TabBar, Icon } from 'antd-mobile';
//import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import color from '../../constants/color';
import styles from './index.less';
import withCache from '@/hoc/withCache';
import Home from '@/screen/Home';
import News from '@/screen/News';
import Message from '@/screen/Message';
import Account from '@/screen/Account';

const TabBarItem = TabBar.Item;
const tabBarItems = [
  {
    title: '首页',
    key: 'Home',
    icon: <Icon type='shouyexian'/>,
    selectedIcon: <Icon type='shouye'/>,
    component: Home
  },
  {
    title: '资讯',
    key: 'News',
    icon: <Icon type='xinwenzixunxian'/>,
    selectedIcon: <Icon type='xinwenzixun'/>,
    component: News
  },
  {
    title: '消息',
    key: 'Message',
    icon: <Icon type='lingdangxian'/>,
    selectedIcon: <Icon type='lingdang'/>,
    component: Message
  },
  {
    title: '我的',
    key: 'Account',
    icon: <Icon type='yonghuxian'/>,
    selectedIcon: <Icon type='yonghu'/>,
    component: Account
  }
]

//const dot = true;

export default withCache(props => {
  const { tabBarColor } = color;
  const [selected, setSelected] = useState('Home');
  props.onCache({selected});
  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    const hasCache = typeof props.cache !== 'undefined' && !isEmpty(props.cache);
    hasCache && setSelected(props.cache['selected']); 
    return;
  }, [props.cache]);
  const handleSelect = name => {
    if(name!==selected) {
      setSelected(name);
      props.onCache({selected: name});
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
                //dot={!!(key === 'Message' && dot)}
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
}, true)