const TOKENKEY = 'utoken';
const ANYTOKENKEY = 'any_token_key';

export function setToken(token) {
  window.localStorage.setItem(TOKENKEY, token);
}

export function getToken() {
  return window.localStorage.getItem(TOKENKEY);
}

export function removeToken() {
  window.localStorage.removeItem(TOKENKEY);
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