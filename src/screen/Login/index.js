import React, { Component, useState } from 'react';
import { Icon, Button } from 'antd-mobile';
import Screen from '@/component/Screen';
import styles from './index.less';

const loginItemMap = [
  {
    name: 'username',
    inputProps: {
      type: 'text',
      placeholder: '用户名'
    }
  },
  {
    name: 'password',
    inputProps: {
      type: 'password',
      placeholder: '密码'
    }
  }
]

function LoginItem(props) {
  const [toggle, setToggle] = useState(true);
  const { name, inputProps } = props;
  const iconNameMap = {
    'username': 'yonghu',
    'password': 'suoding'
  }
  const type = inputProps.type === 'password' ? (toggle ? 'password' : 'text' ) : inputProps.type
  return (
    <div className={`${styles.loginItem} line1px`}>
      <div className={styles.loginLabel}>
        <Icon type={iconNameMap[name]}/>
      </div>
      <div className={styles.loginInput}>
        <input {...inputProps} type={ type } />
      </div>
      { 
        inputProps.type === 'password' ?
        <div className={styles.loginAddon}>
          <Icon type={toggle ? 'yincangbukejian' : 'xianshikejian'} onClick={() => setToggle(!toggle)}/>
        </div> :
        null
      }
    </div>
  )
}

export default class Login extends Component {
  render() {
    const { history } = this.props;
    return (
      <Screen className={styles.loginScreen}>
        <Icon type='cuowuguanbiquxiao' onClick={() => history.goBack()} className={styles.loginClose}/>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>用户登录</h1>
          <div className={styles.loginForm}>
            {
              loginItemMap.map(item => {
                return <LoginItem {...item} key={item.name}/>
              })
            }
            <Button type='primary' disabled>登录</Button>
          </div>
        </div>
      </Screen>
    )
  }
}