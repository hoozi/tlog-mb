import React,{ PureComponent } from 'react';
import { 
  NavBar, 
  Icon, 
  Flex, 
  List, 
  Toast, 
  InputItem, 
  TextareaItem, 
  DatePicker, 
  Button, 
  ActivityIndicator
} from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { createForm } from 'rc-form';
import { Sticky, StickyContainer } from 'react-sticky';
import find from 'lodash/find';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import Screen from '@/component/Screen';
import BannerMask from '@/component/BannerMask';
import CenterLoading from '@/component/CenterLoading';
import Fields from '@/component/Fields';
import MultiplePicker from '@/component/MultiplePicker';
import { mapEffects, mapLoading, hasError } from '@/utils';
import { getUser } from '@/utils/token';
import styles from './index.module.less';
import form from '@/style/form.module.less';
import Empty from '@/component/Empty';

const ListItem = List.Item;
//updatePriceReply
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
const getInitialValue = (data, name, expressions='') => {
  return (data.hasOwnProperty(name) && data[name]) ? (name === 'validDateTime' ? new Date(data[name].replace(/-/g, '/')) : data[name]) : expressions;
}
const getQueryByName = (search, name) => parse(search.substring(1))[name];
const currentUser = getUser();

const mapStateToProps = ({priceReply, user, transport}) => ({
  transport,
  ...priceReply,
  ...user,
  ...mapLoading('priceReply',{
    updatePriceReplying: 'updatePriceReply'
  }),
  ...mapLoading('transport',{
    fetchTransporting: 'fetchTransport'
  })
})

const mapDispatchToProps = ({priceReply, transport}) => ({
  ...mapEffects(transport, ['fetchTransport']),
  ...mapEffects(priceReply, ['updatePriceReply'])
})

@connect(mapStateToProps,mapDispatchToProps)
@createForm()
class PriceReplyDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      type: 0,
      loading: true,
      data: {},
      loadList: []
    }
  }
  componentDidMount() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    const { location:{search}, recordList } = this.props;
    const id = getQueryByName(search, 'id');
    const type = getQueryByName(search, 'type');
    const data = find(recordList.map(item => {
      const { beginDateTime='', endDateTime='' } = item;
      return {
        ...item,
        beginDateTime: beginDateTime.substring(0,10),
        endDateTime: endDateTime.substring(0,10)
      }
    }), item => item.id === id)
    this.setState({
      id,
      data,
      type,
      loading: false
    }, () => {
      this.props.form.validateFields();
    });
    this.props.fetchTransport({
      operateType: 'queryByName',
      current: null,
      size: null
    })
  }
  handleTransportChange = values => {
    this.setState({
      loadList: values.map(item => item.loadWeight)
    })
  }
  handleSubmit = () => {
    const { form: { validateFields, resetFields } } = this.props;
    const { loadList } = this.state;
    validateFields((errors, values) => {
      if(errors) {
        Object.keys(errors).forEach(key => {
          return Toast.info(errors[key]['errors'][0].message)
        });
        return;
      } else {
        const validDateTime = moment(values.validDateTime).format('YYYY-MM-DD');
        const transportList = values.transportList.map(item => item.id);
        const transportNameList = values.transportList.map(item => item.transportName);
        this.props.updatePriceReply({
          ...this.state.data,
          ...values,
          validDateTime,
          transportList,
          transportNameList,
          loadList
        },() => {
          resetFields();
          this.setState({
            loadList: []
          })
        })
      }
    })
  }
  render(){
    const { 
      form: { getFieldProps, getFieldsError },
      transport: {recordList},
      history,  
      updatePriceReplying,
      fetchTransporting
    } = this.props;
    const { data, type, loading, loadList } = this.state;
    const transports = recordList.map(item => ({
      ...item,
      label: item.transportName,
      value: item.id
    }))
    const columns = [
      {
        title: '运力名称',
        dataIndex: 'transport',
        props: {
          wrap: true,
          align: 'top',
          multipleLine: true
        }
      },
      {
        title: '载重吨',
        dataIndex: 'load',
        props: {
          wrap: true,
          align: 'top',
          multipleLine: true
        }
      },
      {
        title: '报价',
        dataIndex: 'quotedPrice',
        extra: () => '元'
      },
      {
        title: '报价有效期',
        dataIndex: 'validDateTime',
        render: (value, item, data) => data.hasOwnProperty('validDateTime') ? data['validDateTime'].substring(0,10) : ''
      },
      {
        title: '联系人',
        dataIndex: 'contacts'
      },
      {
        title: '联系电话',
        dataIndex: 'phone'
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
            询价详情
          </NavBar>
        )}
      >
        <StickyContainer>
          {
            loading ? 
            <CenterLoading/> : 
            !isEmpty(data) ? 
            <>
              <div className={styles.routeCard}>
                <Sticky>
                  {
                    ({style}) => (
                      <div className={styles.routeName} style={{...style, zIndex: 20}}>
                        <Flex justify='between'> 
                          <span>
                            <b>{data.originName}</b>
                            <i>出发地</i>
                          </span>
                          <span>
                            <b>{data.terminalName}</b>
                            <i>目的地</i>
                          </span>
                          {/* <span className={styles.arrowLine}><ArrowLine num={4}/></span> */}
                        </Flex>
                      </div>
                    )
                  }
                </Sticky>
                <BannerMask/>
              </div>
              <div className={styles.detailCardList}>
                <div className={styles.detailCard}>
                  <div className={styles.detailListItem}>
                    <Icon type='huowu' size='xxs'/>
                    <span>{data.cargoName}（{data.cargoTypeName}类）,{data.quantity}吨</span>
                  </div>
                  <div className={styles.detailListItem}>
                    <Icon type='shijian' size='xxs'/>
                    <span>{data.beginDateTime} ～ {data.endDateTime}</span>
                  </div>
                  <div className={styles.detailNote}>{data.remark === ' ' ? '暂无备注' : data.remark}</div>
                </div>
              </div>
              {
                type === '0' ?
                <>
                  <div className={form.createForm}>
                    <List renderHeader={() => '基本信息'}>
                      <MultiplePicker
                        arrow='horizontal'
                        title='选择运力'
                        {
                          ...getFieldProps('transportList', {
                            initialValue: getInitialValue(data, 'transportList'),
                            rules: [{ required: true, message: '请选择运力' }],
                            onChange: this.handleTransportChange
                          })
                        }
                        data={transports}
                        extra={fetchTransporting ? <ActivityIndicator size='small'/> : '请选择运力，支持多选'}
                      >
                        <span className={form.required}>*</span>运力名称
                      </MultiplePicker>
                      
                      <ListItem extra={loadList.length ? loadList.join(',') : <><Icon type='xinxi' size='xs' style={{verticalAlign: 'middle', margin:'-2px 2px 0 0'}}/>载重吨从运力名称中自动带出</>}><span className={form.required}>*</span>载重吨</ListItem>
                      <InputItem
                        {
                          ...getFieldProps('quotedPrice', {
                            initialValue: getInitialValue(data, 'quotedPrice'),
                            rules: [{ required: true, message: '请输入报价' }]
                          })
                        }
                        type='money'
                        placeholder='请输入'
                        clear
                        moneyKeyboardAlign='left'
                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                        extra='元'
                      ><span className={form.required}>*</span>报价</InputItem>
                      <DatePicker
                        mode='date'
                        {
                          ...getFieldProps('validDateTime', {
                            initialValue: getInitialValue(data, 'validDateTime'),
                            rules: [{ required: true, message: '请选择报价有效期' }]
                          })
                        }
                      >
                        <ListItem arrow='horizontal'><span className={form.required}>*</span>报价有效期</ListItem>
                      </DatePicker>
                    </List>
                    <List renderHeader={() => '联系'}>
                      <InputItem
                        {
                          ...getFieldProps('contacts', {
                            initialValue: getInitialValue(data, 'contacts', currentUser.username),
                            rules: [{ required: true, message: '请输入联系人' }]
                          })
                        }
                        placeholder='请输入'
                      ><span className={form.required}>*</span>联系人</InputItem>
                      <InputItem
                        {
                          ...getFieldProps('phone', {
                            initialValue: getInitialValue(data, 'phone', currentUser.phone),
                            rules: [{ required: true, message: '请输入联系电话' }]
                          })
                        }
                        placeholder='请输入'
                      ><span className={form.required}>*</span>联系电话</InputItem>
                    </List>
                    <List renderHeader={() => '运输工具情况描述'}>
                      <TextareaItem
                        {
                          ...getFieldProps('details', {
                            initialValue: getInitialValue(data, 'details')
                          })
                        }
                        placeholder='请输入'
                        rows={5}
                        count={100}
                        className='needsclick'
                      />
                    </List>
                  </div>
                  <div className={form.bottomButton}>
                    <Button 
                      type='primary' 
                      onClick={this.handleSubmit}
                      disabled={updatePriceReplying || hasError(getFieldsError()) || !loadList.length}
                      loading={updatePriceReplying}
                    >提交</Button>
                  </div>
                </> :
                <>
                  <Fields
                    columns={columns}
                    data={data}
                    fieldHeader={() => '询价信息'}
                  />
                  <List renderHeader={() => '运输工具情况描述'}>
                    <ListItem wrap multipleLine align='top'>
                      {data.hasOwnProperty('details') ? data.details : '暂无描述'}
                    </ListItem>
                  </List>
                </>
              }  
            </> :
            <Empty/>
          }
        </StickyContainer>
      </Screen>
    )
  }
}

export default PriceReplyDetail;