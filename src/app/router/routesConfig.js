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
const TaskAsync = LoadingComponent('Task');
const TaskTrackAsync = LoadingComponent('Task/TaskTrack');
const ProductAsync = LoadingComponent('Product');
const ProductDetailAsync = LoadingComponent('Product/ProductDetail');
const WharfSockAsync = LoadingComponent('WharfSock');
const WharfSockDetailAsync = LoadingComponent('WharfSock/Sock');
const TransportSockAsync = LoadingComponent('TransportSock')
const TransportSockDetailAsync = LoadingComponent('TransportSock/Sock')
const AttachmentsAsync = LoadingComponent('Attachments');

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
    path: '/news-detail',
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
  },
  {
    path: '/wharf-sock',
    component: WharfSockAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/wharf-sock-detail',
    component: WharfSockDetailAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/task',
    component: TaskAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/task-track',
    component: TaskTrackAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/attachments',
    component: AttachmentsAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/transport-sock',
    component: TransportSockAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/transport-sock-detail',
    component: TransportSockDetailAsync,
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  }
]
export default routesConfig;
