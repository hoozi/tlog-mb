
import React, { Component } from 'react';
import { NavBar, Flex, Icon, List } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import Screen from '@/component/Screen';
import LoginCheckArea from '@/hoc/LoginCheckArea';
import styles from './index.less';
import avatar from '@/assets/avatar.png';
import {  } from '@/hoc/Authorized'
import { getUser } from '@/utils/token';

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

class Account extends Component {
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
          <ListItem arrow='horizontal' onClick={() => this.props.history.push('/product?type=keep')} thumb={<Icon type='shoucang' color='#f39927'/>}>我的收藏</ListItem>
        </List>
        <List>
          <ListItem arrow='horizontal' thumb={<Icon type='xiugaimima' color='#f15a4a'/>}>修改密码</ListItem>
        </List>
      </LoginCheckArea>
    </Screen>
    )
  }
}

export default withRouter(Account)