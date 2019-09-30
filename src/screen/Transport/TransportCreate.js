import React, { PureComponent } from 'react';
import { 
  NavBar, 
  Icon, 
  Picker, 
  List, 
  InputItem, 
  TextareaItem,
  DatePicker,
  ActivityIndicator,
  Button,
  Toast
} from 'antd-mobile';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import moment from 'moment';
import Screen from '@/component/Screen';
import Debounce from 'lodash-decorators/debounce';
import SearchModal from '@/component/SearchModal';
import { mapEffects, mapLoading, hasError } from '@/utils';
import form from '@/style/form.less';
import { getUser } from '@/utils/token';

const ListItem = List.Item;
const { username, phone } = getUser();

const mapStateToProps = ({ common }) => {
  return {
    ...common,
    ...mapLoading('common',{
      fetchTransportTyping: 'fetchTransportType',
      fetchTransportNameing: 'fetchTransportName',
      fetchTransportByIding: 'fetchTransportById'
    }),
    ...mapLoading('transport', {
      createTransporting: 'createTransport'
    })
  }
}
const mapDispatchToProps = ({ common, transport }) => ({
  ...mapEffects(common, ['fetchTransportType', 'fetchTransportName', 'fetchTransportById', 'findTransports']),
  ...mapEffects(transport, ['createTransport']),
});

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
@createForm()
class TransportCreate extends PureComponent {
  state = {
    transportName: '',
    transportVisible: false,
    transportId: -1
  }
  componentDidMount() {
    this.props.form.validateFields();
    this.props.fetchTransportType();
    this.props.fetchTransportName();
  }
  handleSubmit = () => {
    const { form: { validateFields, resetFields } } = this.props;
    const { tranportId, transportName } = this.state
    validateFields((errors, values) => {
      if(errors) {
        Object.keys(errors).forEach(key => {
          return Toast.info(errors[key]['errors'][0].message)
        });
        return;
      } else {
        const transportTypeId = values.transportTypeId[0];
        const freeStartTime = moment(values.freeStartTime).format('YYYY-MM-DD');
        const freeEndTime = moment(values.freeEndTime).format('YYYY-MM-DD');
        const invalidateTime = moment(values.invalidateTime).format('YYYY-MM-DD');
        const validateTime = moment(values.validateTime).format('YYYY-MM-DD');
        this.props.createTransport({
          ...values,
          status: 10,
          message: '运力发布成功',
          transportTypeId,
          tranportId,
          transportName,
          freeStartTime,
          freeEndTime,
          invalidateTime,
          validateTime
        },() => {
          resetFields();
        })
      }
    })
  }
  handleShowTransportSearch = flag => {
    this.setState({
      transportVisible: !!flag
    })
  }
  @Debounce(200)
  handleTransportSearchChange = name => {
    this.props.findTransports({name});
  }
  handleTransportNameChange = data => {
    console.log(data)
    const { id:transportId, chineseName:transportName, vesselLoadWeight:loadWeight } = data;
    this.props.form.setFieldsValue({loadWeight})
    this.setState({
      transportId,
      transportName
    });
    this.handleShowTransportSearch();
  }
  render() {
    const { 
      form: { getFieldProps, getFieldsError }, 
      createTransporting,
      fetchTransportTyping,
      transportSplice,
      transportType
    } = this.props;
    const { transportName, transportVisible, transportId } = this.state;
    const transportModalMethods = {
      onCancel: () => this.handleShowTransportSearch(),
      onSearchChange: this.handleTransportSearchChange,
      onItemChange: this.handleTransportNameChange
    }
    const transportSplices = transportSplice.length ? transportSplice.map(item => ({
      ...item,
      label: item.chineseName,
      brief: item.englishName
    })) : []
    return (
      <Screen
        fixed
        header={() => {
          return (
            <NavBar   
              mode='dark'
              icon={<Icon type='left' size='lg'/>}
              onLeftClick={() => this.props.history.goBack()}
            >
              运力发布
            </NavBar>
          )
        }}
      >
        <div className={form.createForm}>
          <List renderHeader={() =>'基本信息'}>
            <Picker
              cols={1}
              {...getFieldProps('transportTypeId', {
                rules: [
                  { required: true, message: '请选择运力类型' }
                ]
              })}
              data={transportType}
              title='运力类型'
              extra={fetchTransportTyping? <ActivityIndicator size='small'/> : '请选择'}
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>运力类型</ListItem>
            </Picker>
            <ListItem
              arrow='horizontal'
              extra={transportName ? transportName : '请选择'}
              onClick={() => this.handleShowTransportSearch(true)}
            ><span className={form.required}>*</span>运力名称</ListItem>
            <InputItem
              {...getFieldProps('loadWeight', {
                rules: [
                  { required: true, message: '请输入载重吨' }
                ]
              })}
              type='money'
              placeholder='请输入'
              clear
              moneyKeyboardAlign='left'
              moneyKeyboardWrapProps={moneyKeyboardWrapProps}
              extra='吨'
            ><span className={form.required}>*</span>载重吨</InputItem>
            <InputItem
              {...getFieldProps('freePlace', {
                rules: [
                  { required: true, message: '请输入空闲地' }
                ]
              })}
              placeholder='请输入'
              clear
            >空闲地</InputItem>
            <InputItem
              {...getFieldProps('logisticsProvider', {
                rules: [
                  { required: true, message: '请输入服务商' }
                ]
              })}
              placeholder='请输入'
              clear
            >服务商</InputItem>
          </List>
          <List renderHeader={() =>'联系'}>
            <InputItem
              {...getFieldProps('contact', {
                initialValue: username,
                rules: [
                  { required: true, message: '请输入联系人' }
                ]
              })}
              placeholder='请输入'
              clear
            ><span className={form.required}>*</span>联系人</InputItem>
            <InputItem
              type='number'
              {...getFieldProps('contactTel', {
                initialValue: phone,
                rules: [
                  { required: true, message: '请输入联系电话' }
                ]
              })}
              placeholder='请输入'
              clear
            ><span className={form.required}>*</span>联系电话</InputItem>
          </List>
          <List renderHeader={() =>'空闲日期'}>
            <DatePicker
              {...getFieldProps('freeStartTime', {
                rules: [
                  { required: true, message: '请选择出运开始日期' }
                ]
              })}
              mode='date'
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>从</ListItem>
            </DatePicker>
            <DatePicker
              {...getFieldProps('freeEndTime', {
                rules: [
                  { required: true, message: '请选择出运结束日期' }
                ]
              })}
              mode='date'
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>到</ListItem>
            </DatePicker>
          </List>
          <List renderHeader={() =>'有效期'}>
            <DatePicker
              {...getFieldProps('validateTime', {
                rules: [
                  { required: true, message: '请选择生效日期' }
                ]
              })}
              mode='date'
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>从</ListItem>
            </DatePicker>
            <DatePicker
              {...getFieldProps('invalidateTime', {
                rules: [
                  { required: true, message: '请选择失效日期' }
                ]
              })}
              mode='date'
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>到</ListItem>
            </DatePicker>
          </List>
          <List renderHeader={() =>'其他'}>
            <TextareaItem
              {...getFieldProps('note')}
              placeholder='请输入备注'
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
            disabled={createTransporting || hasError(getFieldsError())}
            loading={createTransporting}
          >提交</Button>
        </div>
        <SearchModal
          visible={transportVisible}
          data={transportSplices}
          value={transportName}
          selectedValue={transportId}
          placeholder='请输入中文或者英文船名'
          { ...transportModalMethods }
        />
      </Screen>
    )
  }
}

export default TransportCreate;
