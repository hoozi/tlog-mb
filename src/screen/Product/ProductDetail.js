import React,{ PureComponent } from 'react';
import { NavBar, Icon, List, ActivityIndicator, Modal } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { createForm } from 'rc-form';
import { Sticky, StickyContainer } from 'react-sticky';
import isEmpty from 'lodash/isEmpty';
import CenterLoading from '@/component/CenterLoading';
import Screen from '@/component/Screen';
import Fields from '@/component/Fields';
import RouteCard from '@/component/RouteCard';
import { mapEffects, mapLoading } from '@/utils';
import { getToken } from '@/utils/token';
import styles from './index.less';
import Empty from '../../component/Empty';

const ListItem = List.Item;
const modalAlert = Modal.alert;

const mapStateToProps = ({product}) => ({
  ...product,
  ...mapLoading('product', {
    fetchProductDetailing: 'fetchProductDetail',
    productKeeping: 'productKeep'
  })
})

const mapDispatchToProps = ({product}) => mapEffects(product, ['fetchProductDetail', 'productKeep'])

@connect(mapStateToProps,mapDispatchToProps)
@createForm()
class PriceReplyDetail extends PureComponent {
  constructor(props) {
    super(props);
    const { location:{search}} = props;
    const id = parse(search.substring(1))['id'];
    this.state = {
      id,
      isKeep: false
    }
  }
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    const { id } = this.state
    this.props.fetchProductDetail({id}, data => {
      this.setState({
        isKeep: data.enshrineStatus
      });
    })
  }
  handleKeep = () => {
    const { id:productId, isKeep } = this.state;
    const params = {
      crudType: isKeep ? 'delete' : 'create',
      productId
    }
    if(!getToken()) {
      modalAlert('提示','您还未登录,请先登录',[
        { text: '取消' },
        { text: '登录', onPress:() => this.props.history.push('/login') }
      ])
    } else {
      this.props.productKeep(params, ()=>{
        this.setState(prevState => {
          return {
            ...this.state,
            isKeep: !prevState.isKeep
          }
        });
      });
    }
  }
  render(){
    const { history, fetchProductDetailing, productKeeping, detail } = this.props;
    const { isKeep } = this.state;
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'productName',
        extra: data => {
          return  productKeeping ? <ActivityIndicator size='small'/> : <span className={styles.keep} onClick={this.handleKeep}><Icon type={!isKeep ? 'shoucangxian' : 'shoucang'} size='xs'/>收藏</span>
        }
      },
      {
        title: '作业类型',
        dataIndex: 'bizType',
        render: value => <span className='text-primary'>{value}</span>
      },
      {
        title: '船型',
        dataIndex: 'shipTypeName'
      },
      {
        title: '运输里程',
        dataIndex: 'mileage',
        extra: () => '公里'
      },
      {
        title: '运输时长',
        dataIndex: 'days',
        extra: () => '天'
      },
      {
        title: '联系人',
        dataIndex: 'contactName',
      },
      {
        title: '联系电话',
        dataIndex: 'contactNumber',
      },
      {
        title: '有效期',
        dataIndex: 'effectiveDate',
        render: (value, item, data) => `${data.effectiveDate.substring(0,10)} ~ ${data.expireDate.substring(0,10)}`
      }
    ]
    return (
      <Screen
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            产品详情
          </NavBar>
        )}
      >
        <StickyContainer>
          {
            fetchProductDetailing ?
            <CenterLoading text='详情加载中...'/> :
            !isEmpty(detail) ? 
            <>
              <Sticky>
                {
                  ({style}) => <RouteCard from={detail.originName} to={detail.terminalName} style={{...style, zIndex: 20}}/>
                }
              </Sticky>
              <Fields
                columns={columns}
                data={detail}
              />
              <List renderHeader={() => '物流产品描述'}>
                <ListItem wrap multipleLine align='top'>
                  {detail.introduction || '暂无描述'}
                </ListItem>
              </List>
            </> :
            <Empty/>
          }
        </StickyContainer>
      </Screen>
    )
  }
}

export default PriceReplyDetail;