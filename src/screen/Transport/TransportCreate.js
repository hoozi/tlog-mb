import React, { PureComponent } from 'react';
import { 
  NavBar, 
  Icon, 
  Picker, 
  List, 
  InputItem, 
  TextareaItem,
  DatePicker,
  Button,
  Toast
} from 'antd-mobile';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import moment from 'moment';
import Screen from '@/component/Screen';
//import { BARND_COLOR } from '@/constants/color';
import { mapEffects, mapLoading, hasError } from '@/utils';
import form from '@/style/form.less';

const ListItem = List.Item;

const mapStateToProps = ({ common }) => {
  return {
    ...common,
    ...mapLoading('common',{
      fetchTransportTyping: 'fetchTransportType'
    }),
    ...mapLoading('transport', {
      createTransporting: 'createTransport'
    })
  }
}
const mapDispatchToProps = ({ common, transport }) => ({
  ...mapEffects(common, ['fetchTransportType']),
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
  getTransportType() {
    this.props.fetchTransportType();
  }
  componentDidMount() {
    this.props.form.validateFields();
    this.getTransportType();
  }
  handleSubmit = () => {
    const { form: { validateFields, resetFields } } = this.props;
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
          freeStartTime,
          freeEndTime,
          invalidateTime,
          validateTime
        },() => {
          resetFields();
         /*  this.setState({
            
          }) */
        })
      }
    })
  }
  render() {
    const { 
      form: { getFieldProps, getFieldsError }, 
      createTransporting,
      fetchTransportTyping,
      transportType
    } = this.props;
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
              extra={fetchTransportTyping? '加载中...' : '请选择'}
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>运力类型</ListItem>
            </Picker>
            <InputItem
              {...getFieldProps('transportName', {
                rules: [
                  { required: true, message: '请输入运力名称' }
                ]
              })}
              placeholder='请输入'
              clear
            ><span className={form.required}>*</span>运力名称</InputItem>
            <InputItem
              {...getFieldProps('loadWeight', {
                rules: [
                  { required: true, message: '请输入运力名称' }
                ]
              })}
              type='money'
              placeholder='请输入'
              clear
              moneyKeyboardAlign='left'
              moneyKeyboardWrapProps={moneyKeyboardWrapProps}
              extra='吨'
            >载重吨</InputItem>
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
              {...getFieldProps('contact')}
              placeholder='请输入'
              clear
            >联系人</InputItem>
            <InputItem
              type='number'
              {...getFieldProps('contactTel')}
              placeholder='请输入'
              clear
            >联系电话</InputItem>
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
      </Screen>
    )
  }
}

export default TransportCreate;
