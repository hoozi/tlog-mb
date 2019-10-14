const TOKENKEY = 'utoken';
const ANYTOKENKEY = 'any_token_key';
const USERKEY = 'save_user_object';
const PERMISSIONKEY = 'user_permission';

export function setToken(token) {
  window.sessionStorage.setItem(TOKENKEY, token);
}
export function getToken() {
  return window.sessionStorage.getItem(TOKENKEY);
}
export function removeToken() {
  window.sessionStorage.removeItem(TOKENKEY);
}

export function setAnyToken(token) {
  window.sessionStorage.setItem(ANYTOKENKEY, token);
}
export function getAnyToken() {
  return window.sessionStorage.getItem(ANYTOKENKEY);
}
export function removeAnyToken() {
  window.sessionStorage.removeItem(ANYTOKENKEY);
}

export function setUser(user) {
  setPermission(user.permissions)
  window.sessionStorage.setItem(USERKEY, JSON.stringify(user.sysUser));
}
export function getUser() {
  const user = window.sessionStorage.getItem(USERKEY);
  return user ? JSON.parse(user) : {};
}
export function removeUser() {
  window.sessionStorage.removeItem(USERKEY);
}

export function setPermission(permissions) {
  window.sessionStorage.setItem(PERMISSIONKEY, JSON.stringify(getPermission().length ? [...getPermission(), ...permissions] : permissions));
}
export function getPermission() {
  const permissions = window.sessionStorage.getItem(PERMISSIONKEY);
  return permissions ? JSON.parse(permissions) : [];
}
export function removePermission() {
  window.sessionStorage.removeItem(PERMISSIONKEY);
}