import { Component } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import { withRouter } from 'react-router-dom';

class LoginChecker extends Component {
  static propTypes = {
    isLogin: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool
    ])
  }
  static defaultProps = {
    isLogin: () => {
      return window.localStorage.getItem('permissions') && 
        window.localStorage.getItem('permissions').length > 0;
    }
  }
  checkLogin() {
    const { isLogin, history, location: { pathname } } = this.props;
    let hasLogin = isFunction(isLogin) ? isLogin() : isLogin;
    if(!hasLogin) {
      return history.push('/login');
    } else {
      return hasLogin ? history.push('/') : false; 
    }
  }
  componentDidMount() {
    this.checkLogin();
  }
/*   componentDidUpdate() {
    this.checkLogin();
  } */
  render() {
    return this.props.children;
  }
}
export default withRouter(LoginChecker)


