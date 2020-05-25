
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import indexOf from 'lodash/indexOf';
import store from '@/app/store';
import { setPermission, getPermission } from './token';

export function mapEffects(namespace, names) {
  const effects = {};
  names.forEach(item => {
    effects[item] = namespace[item];
  });
  return effects;
}

export function mapLoading(namespace, names) {
  const state = store.getState();
  const { loading } = state;
  const effects = loading.effects[namespace];
  const loadings = {}
  for(let key in names) {
    loadings[key] = effects[names[key]]
  }
  return loadings;
}

export const hasError = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

export const checkPermissions = (authorities, permissions=getPermission()) => {

  if(typeof authorities === 'undefined') {
    return true
  }

  if (isEmpty(permissions)) {
    return true;
  }
  if (isArray(authorities)) {
    for (let i = 0; i < authorities.length; i += 1) {
      if (indexOf(permissions, authorities[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  if (isString(authorities)) {
    return indexOf(permissions, authorities) !== -1;
  }

  if (isFunction(authorities)) {
    return authorities(permissions);
  }

  throw new Error('Unsupport type of authorities.');
};

export const getButtonsByPermissions = (buttonMap, status) => {
  const buttons = buttonMap[status];
  return buttons.filter(item => {
    return checkPermissions(item.authority);
  });
}

export function getPermissionFromMenu(menu) {
  return menu.map(m =>  m.id);
}

export function getMenu(menus) {
  const permissions = menus.map(item => item.url);
  setPermission(permissions)
}
 
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps = {};
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

export { wrapProps };

export function getMenuFromStorage(staticMenus) {
  return getPermission().length ? staticMenus.map( item => {
    if(getPermission().some(permission => permission === item.url)) {
      return item;
    } else {
      return null
    }
  }).filter(item => item) : [];
}

export function toFixed2(number) {
  return Number(number.toString().match(/^\d+(?:\.\d{0,2})?/));
}

export function getImgUrlFromContent(html){
  let data = '';
  html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
    data =  capture;
  });
  return data
}