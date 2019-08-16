import React, { Component, useState, forwardRef } from 'react';
import { Icon, Button, Flex, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import { mapEffects, mapLoading, hasError } from '@/utils';
import Screen from '@/component/Screen';
import styles from './index.less';

const loginItemMap = [
  {
    name: 'user',
    inputProps: {
      type: 'text',
      placeholder: '用户名'
    },
    rules: [{
      required: true,
      message: '请输入用户名'
    }]
  },
  {
    name: 'password',
    inputProps: {
      type: 'password',
      placeholder: '密码'
    },
    rules: [{
      required: true,
      message: '请输入用户名'
    }]
  }
]

function LoginItem(props) {
  const [toggle, setToggle] = useState(true);
  const { name, inputProps, onChange } = props;
  const iconNameMap = {
    'user': 'yonghu',
    'password': 'suoding'
  }
  const type = inputProps.type === 'password' ? (toggle ? 'password' : 'text' ) : inputProps.type
  return (
    <div className={`${styles.loginItem} line1px`}>
      <div className={styles.loginLabel}>
        <Icon type={iconNameMap[name]}/>
      </div>
      <div className={styles.loginInput}>
        <input {...inputProps} type={ type } onChange={e => onChange(e.target.value)}/>
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

const ForwardLoginItem = forwardRef((props, ref) => <LoginItem {...props}/>)

const mapStateToProps = () => mapLoading('user', {
  fetchTokening: 'fetchToken'
});
const mapDispatchToProps = ({ user }) => mapEffects(user, ['fetchToken']);

@connect(mapStateToProps, mapDispatchToProps)
@createForm()
class Login extends Component {
  componentDidMount() {
    this.props.form.validateFields();
  }
  handleLogin = () => {
    this.props.form.validateFields((errors, values) => {
      if(errors) {
        Object.keys(errors).forEach(key => {
          return Toast.info(errors[key]['errors'][0].message)
        });
        return;
      } else {
        this.props.fetchToken(values)
      }
    })
  }
  render() {
    const { history, form: { getFieldDecorator, getFieldsError }, fetchTokening } = this.props;
    return (
      <Screen className={styles.loginScreen}>
        <Icon type='cross' onClick={() => history.goBack()} size='md' className={styles.loginClose}/>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>用户登录</h1>
          <div className={styles.loginForm}>
            {
              loginItemMap.map(item => {
                return getFieldDecorator(item.name, { rules: item.rules })(<ForwardLoginItem {...item} key={item.name}/>)
              })
            }
            <Button 
              type='primary' 
              disabled={fetchTokening || hasError(getFieldsError())} 
              onClick={this.handleLogin} 
              loading={fetchTokening}
            >登录</Button>
            <Flex justify='between' style={{marginTop: 16}}>
              <a href='###'>忘记密码？</a>
              <a href='###'>注册</a>
            </Flex>
          </div>
        </div>
      </Screen>
    )
  }
}

export default Login;