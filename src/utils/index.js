
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import indexOf from 'lodash/indexOf';
import store from '@/app/store';
import { getUser } from './token';

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

export const checkPermissions = (authorities, permissions=getUser().permissions) => {
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
