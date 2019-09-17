import { checkPermissions } from '@/utils';

const AuthorizedArea = ({ authority, children, noMatch=null }) => {
  const hasPermissions = checkPermissions(authority);
  return hasPermissions ? children : noMatch;
}

export {
  AuthorizedArea
}