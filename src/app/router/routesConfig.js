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
const OrderDetailAsync = LoadingComponent('Order/OrderDetail');
const TaskAsync = LoadingComponent('Task');
const TaskDetailAsync = LoadingComponent('Task/TaskDetail');
const TaskTrackAsync = LoadingComponent('Task/TaskTrack');
const ProductAsync = LoadingComponent('Product');
const ProductDetailAsync = LoadingComponent('Product/ProductDetail');
const WharfSockAsync = LoadingComponent('WharfSock');
const WharfSockSearchAsync = LoadingComponent('WharfSock/Search');
const WharfSockSearchDetailAsync = LoadingComponent('WharfSock/SearchDetail');
const WharfSockDetailAsync = LoadingComponent('WharfSock/Sock');
const TransportSockAsync = LoadingComponent('TransportSock')
const TransportSockDetailAsync = LoadingComponent('TransportSock/Sock')
const AttachmentsAsync = LoadingComponent('Attachments');
const WharfCongestionAsync = LoadingComponent('WharfCongestion');
const TideAsync = LoadingComponent('Tide');
const AnalysisAsync = LoadingComponent('Analysis');
const VovageAsync = LoadingComponent('Vovage');
const VovageSearchAsync = LoadingComponent('Vovage/Search');

const routesConfig = [
  {
    path: '/',
    component: TabLayout
  },
  {
    path: '/login',
    component: LoginAsync,
    title: '登录',
    transitionConfig: {
      enter: 'from-bottom',
      exit: 'to-bottom'
    }
  },
  {
    path: '/news-detail',
    component: NewsDetailAsync,
    title: '新闻详情',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/cargo',
    component: CargoAsync,
    title: '货盘信息',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/cargo-create',
    component: CargoCreateAsync,
    title: '货盘发布',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/transport',
    component: TransportAsync,
    title: '运力信息',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/transport-create',
    component: TransportCreateAsync,
    title: '运力发布',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/price-reply',
    component: PriceReplyAsync,
    title: '询价回复',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/price-reply-detail',
    component: PriceReplyDetailAsync,
    title: '询价回复详情',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/order',
    component: OrderAsync,
    title: '订单查询',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/order-comment',
    component: OrderCommentAsync,
    title: '订单评价',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/product',
    component: ProductAsync,
    title: '产品信息',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/product-detail',
    component: ProductDetailAsync,
    title: '产品详情',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/wharf-sock',
    component: WharfSockAsync,
    title: '码头库存',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/wharf-sock-detail',
    component: WharfSockDetailAsync,
    title: '码头库存详情',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/task',
    component: TaskAsync,
    title: '任务管理',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/task-detail',
    component: TaskDetailAsync,
    title: '任务详情',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/task-track',
    component: TaskTrackAsync,
    title: '任务跟踪',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/attachments',
    component: AttachmentsAsync,
    title: '附件列表',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/transport-sock',
    component: TransportSockAsync,
    title: '在途库存',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/transport-sock-detail',
    component: TransportSockDetailAsync,
    title: '在途库存详情',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/order-detail',
    component: OrderDetailAsync,
    title: '订单详情',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/wharf-congestion',
    component: WharfCongestionAsync,
    title: '拥堵情况',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/tide',
    component: TideAsync,
    title: '潮汐信息',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/analysis',
    component: AnalysisAsync,
    title: '统计分析',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/vovage',
    component: VovageAsync,
    title: '船期信息',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/vovage-search',
    component: VovageSearchAsync,
    title: '船期查询',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/wharf-sock-search',
    component: WharfSockSearchAsync,
    title: '码头库存查询',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  },
  {
    path: '/wharf-sock-search-detail',
    component: WharfSockSearchDetailAsync,
    title: '码头库存详情',
    transitionConfig: {
      enter: 'from-right',
      exit: 'to-right'
    }
  }
]
export default routesConfig;
