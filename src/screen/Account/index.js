
import React, { Component } from 'react';
import { NavBar, Flex, Icon, List, ActionSheet } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Screen from '@/component/Screen';
import LoginCheckArea from '@/hoc/LoginCheckArea';
import styles from './index.module.less';
import avatar from '@/assets/avatar.png';
import Authorized from '@/hoc/Authorized';
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

@connect(null, ({user}) => ({logout: user.logout}))
class Account extends Component {
  handleShowAction = () => {
    ActionSheet.showActionSheetWithOptions({
      options: ['退出','取消'],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      message: '确定退出登录吗？',
      title: '退出登录'
    }, index => {
      if(index === 0) {
        this.props.logout();
      }
    })
  }
  render() {
    /* eslint-disable */
    return (
      <Screen
        className={styles.accountScreen}
        header={() =>(
          <NavBar   
            mode='dark'
            rightContent={getToken() ? <a href='javascript:;' className={styles.logout} onClick={this.handleShowAction}>退出</a> : null}
          >
            我的
          </NavBar>
        )}
      >
      <LoginCheckArea>
        <UserCard data={getUser()}/>
        <Authorized authority='/product?type=keep'>
          <List className='mb8'>
            <ListItem arrow='horizontal' onClick={() => this.props.history.push('/product?type=keep')} thumb={<Icon type='shoucang' color='#f39927'/>}>我的收藏</ListItem>
          </List>
        </Authorized>
        {/* <List>
          <ListItem arrow='horizontal' thumb={<Icon type='xiugaimima' color='#f15a4a'/>}>修改密码</ListItem>
        </List> */}
      </LoginCheckArea>
    </Screen>
    )
  }
}

export default withRouter(Account)