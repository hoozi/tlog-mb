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
import form from '@/style/form.module.less';
import { getUser } from '@/utils/token';

const userOrgId = getUser().orgId;
const ListItem = List.Item;
const { username, phone } = getUser();

const mapStateToProps = ({ common }) => {
  return {
    ...common,
    ...mapLoading('common',{
      fetchTransportTyping: 'fetchTransportType',
      fetchTransportNameing: 'fetchTransportName',
      fetchTransportByIding: 'fetchTransportById',
      fetchOrging: 'fetchOrg'
    }),
    ...mapLoading('transport', {
      createTransporting: 'createTransport'
    })
  }
}
const mapDispatchToProps = ({ common, transport }) => ({
  ...mapEffects(common, ['fetchTransportType', 'fetchTransportName', 'fetchTransportById', 'findTransports', 'findOrgs', 'fetchOrg']),
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
    logisticsProviderId: -1,
    logisticsProviderName: '',
    transportName: ''
  }
  componentDidMount() {
    const { form:{setFieldsValue} } = this.props
    this.props.form.validateFields();
    this.props.fetchTransportType();
    this.props.fetchTransportName();
    this.props.fetchOrg(data => {
      const logisticsProvider = data.filter(item => item.id === userOrgId);
      const { id:logisticsProviderId, name:logisticsProviderName } = logisticsProvider[0];
      setFieldsValue({logisticsProviderId})
      this.setState({
        logisticsProviderName
      });
    });
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
        })
      }
    })
  }
  @Debounce(200)
  handleTransportSearchChange = name => {
    this.props.findTransports({name});
  }
  @Debounce(200)
  handleOrgSearchChange = name => {
    this.props.findOrgs({name});
  }
  handleTransportNameChange = (value, data) => {
    const { chineseName:transportName, vesselLoadWeight:loadWeight } = data;
    this.props.form.setFieldsValue({loadWeight})
    this.setState({
      transportName
    });
  }
  handleOrgNameChange = (value, data) => {
    const { name:logisticsProviderName } = data;
    this.setState({
      logisticsProviderName
    });
  }
  render() {
    const { 
      form: { getFieldProps, getFieldsError }, 
      createTransporting,
      fetchTransportTyping,
      fetchTransportNameing,
      transportSplice,
      orgSplice,
      transportType,
      fetchOrging
    } = this.props;
    const { transportName, logisticsProviderName, logisticsProviderId } = this.state;
    const transportSplices = transportSplice.length ? transportSplice.map(item => ({
      ...item,
      label: item.chineseName,
      brief: item.englishName,
      key: item.id,
      value: item.id
    })) : []
    const orgSplices = orgSplice.length ? orgSplice.map(item => ({
      ...item,
      label: item.name,
      value: item.id,
      key: item.id,
      brief: item.code
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
            <SearchModal
              {...getFieldProps('transportId',
              {
                onChange: this.handleTransportNameChange,
                rules: [
                  { required: true, message: '请选择运力' }
                ]
              })}
              placeholder='请输入运力名称'
              data={transportSplices}
              loading={fetchTransportNameing}
              onSearchChange={this.handleTransportSearchChange}
            >
              <ListItem
                arrow='horizontal'
                extra={transportName ? transportName : '请选择'}
              ><span className={form.required}>*</span>运力名称</ListItem>
            </SearchModal>
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
            <SearchModal
              {...getFieldProps('logisticsProviderId',
              {
                onChange: this.handleOrgNameChange,
                rules: [
                  { required: true, message: '请选择组织' }
                ]
              })}
              placeholder='请输入组织名称'
              data={orgSplices}
              loading={fetchOrging}
              onSearchChange={this.handleOrgSearchChange}
            >
              <ListItem
                arrow='horizontal'
                extra={fetchOrging ? <ActivityIndicator size='small'/> : logisticsProviderName ? logisticsProviderName : '请选择'}
              ><span className={form.required}>*</span>服务商</ListItem>
            </SearchModal>
            
            <InputItem
              {...getFieldProps('freePlace')}
              placeholder='请输入'
              clear
            >空闲地</InputItem>
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
              {...getFieldProps('freeStartTime')}
              mode='date'
            >
              <ListItem arrow='horizontal'>从</ListItem>
            </DatePicker>
            <DatePicker
              {...getFieldProps('freeEndTime')}
              mode='date'
            >
              <ListItem arrow='horizontal'>到</ListItem>
            </DatePicker>
          </List>
          <List renderHeader={() =>'有效期'}>
            <DatePicker
              {...getFieldProps('validateTime')}
              mode='date'
            >
              <ListItem arrow='horizontal'>从</ListItem>
            </DatePicker>
            <DatePicker
              {...getFieldProps('invalidateTime')}
              mode='date'
            >
              <ListItem arrow='horizontal'>到</ListItem>
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
