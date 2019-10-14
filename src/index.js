// eslint-disable-next-line
import ReactDOM from 'react-dom';
import './index.less';
import App from './app/index';

function render() {
  ReactDOM.render(App, document.getElementById('root'));
}

if(window.cordova) {
  document.addEventListener('deviceready', render, false)
} else {
  render();
}