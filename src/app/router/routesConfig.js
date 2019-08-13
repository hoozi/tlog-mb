import { lazy } from 'react';
import TabLayout from '@/layout/TabLayout';

const LoadingComponent = screen => lazy(() => import(`@/screen/${screen}`));

const LoginAsync = LoadingComponent('Login');
const NewsDetailAsync = LoadingComponent('NewsDetail');
const CargoAsync = LoadingComponent('Cargo');
const CargoCreateAsync = LoadingComponent('Cargo/CargoCreate');

const routesConfig = [
  {
    path: '/',
    component: TabLayout
  },
  {
    path: '/login',
    component: LoginAsync,
    transitionConfig: {
      enter: 'from-bottom',
      exit: 'to-bottom'
    }
  },
  {
    path: '/newsDetail',
    component: NewsDetailAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/cargo',
    component: CargoAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/cargo-create',
    component: CargoCreateAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  }
]
export default routesConfig;
