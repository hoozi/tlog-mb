
import React, { Component } from 'react';
import { NavBar, Flex, Icon, List } from 'antd-mobile';
import Screen from '@/component/Screen';
import LoginCheckArea from '@/hoc/LoginCheckArea';
import styles from './index.less';
import avatar from '@/assets/avatar.png';
import { AuthorizedArea } from '@/hoc/Authorized'
import { getUser, getToken } from '@/utils/token';

const ListItem = List.Item;
const secretPhone = phone => phone.length === 11 ? `${phone.substring(0,3)}****${phone.substring(7,11)}` : phone;

const UserCard = ({ data }) => {
  return (
    <div className={styles.userCard}>
      <Flex justify='between' alignContent='start'>
        <div className={styles.userContainer}>
          <img src={avatar} alt={data.username}/>
          <div className={styles.userInfo}>
            <h2>{data.username}</h2>
            <p className={styles.userExtra}>{secretPhone(data.phone)}</p>
          </div>
        </div>
      </Flex>
    </div>
  )
}

export default class index extends Component {
  render() {
    return (
      <Screen
        className={styles.accountScreen}
        header={() =>(
          <NavBar   
            mode='dark'
            /* rightContent={getToken() ? <Icon type='shezhi'/> : null} */
          >
            我的
          </NavBar>
        )}
      >
      <LoginCheckArea>
        <UserCard data={getUser().sysUser}/>
        <List className='mb8'>
          <ListItem arrow='horizontal' thumb={<Icon type='shoucang' color='#f39927'/>}>我的收藏</ListItem>
        </List>
        <List>

        </List>
      </LoginCheckArea>
    </Screen>
    )
  }
}