import store from '@/app/store';

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