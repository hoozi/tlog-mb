import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import isFunction from 'lodash/isFunction';
import nlogin from '@/assets/nlogin.svg';
import { getToken } from '@/utils/token';

class LoginCheckArea extends Component {
  static propTypes = {
    isLogin: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool
    ])
  }
  static defaultProps = {
    isLogin: () => {
      return !!getToken()
    }
  }
  checkLogin() {
    const { isLogin } = this.props;
    let hasLogin = isFunction(isLogin) ? isLogin() : isLogin;
    return hasLogin;
  }
  render() {
    return (
      !this.checkLogin() ? 
      <div style={styles.container}>
        <img src={nlogin} alt='未登录' width='128' style={styles.img} className='mb8'/>
        <p>您还未登录,请先<Link to='/login'>登录</Link></p>
      </div>
       : this.props.children
    );
  }
}
export default withRouter(LoginCheckArea);

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column',
    color: '#999',
    position: 'absolute',
    top: '50%',
    marginTop: -43
  },
  img: {
    display: 'block',
  }
}


