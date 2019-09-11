const TOKENKEY = 'utoken';
const ANYTOKENKEY = 'any_token_key';
const USERKEY = 'save_user_object';

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
  window.sessionStorage.setItem(USERKEY, JSON.stringify(user));
}
export function getUser() {
  const user = window.sessionStorage.getItem(USERKEY);
  return user ? JSON.parse(user) : {};
}
export function removeUser() {
  window.sessionStorage.removeItem(USERKEY);
}

