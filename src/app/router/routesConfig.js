import { lazy } from 'react';
import TabLayout from '@/layout/TabLayout';

const LoadingComponent = screen => lazy(() => import(`@/screen/${screen}`));

const LoginAsync = LoadingComponent('Login');
const NewsDetailAsync = LoadingComponent('NewsDetail');
const CargoAsync = LoadingComponent('Cargo');
const CargoCreateAsync = LoadingComponent('Cargo/CargoCreate');
const TransportAsync = LoadingComponent('Transport');
const TransportCreateAsync = LoadingComponent('Transport/TransportCreate');
const PriceReplyAsync = LoadingComponent('PriceReply');
const PriceReplyDetailAsync = LoadingComponent('PriceReply/PriceReplyDetail');
const OrderAsync = LoadingComponent('Order');
const OrderCommentAsync = LoadingComponent('Order/OrderComment');
const ProductAsync = LoadingComponent('Product');
const ProductDetailAsync = LoadingComponent('Product/ProductDetail');

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
  },
  {
    path: '/transport',
    component: TransportAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/transport-create',
    component: TransportCreateAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/price-reply',
    component: PriceReplyAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/price-reply-detail',
    component: PriceReplyDetailAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/order',
    component: OrderAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/order-comment',
    component: OrderCommentAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/product',
    component: ProductAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/product-detail',
    component: ProductDetailAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  }
]
export default routesConfig;
