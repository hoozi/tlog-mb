import { checkPermissions } from '@/utils';

const Authorized = ({ authority, children, noMatch=null }) => {
  const hasPermissions = checkPermissions(authority);
  return hasPermissions ? children : noMatch;
}

export default Authorized