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
import { createForm,createFormField } from 'rc-form';
import { parse } from 'qs';
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

const mapStateToProps = ({ common, transport:transportModel }) => {
  return {
    transportModel,
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
@createForm({
  mapPropsToFields(props) {
    const { transportModel:{recordList} } = props;
    const filds = {};
    const search = props.history.location.search;
    const id = search ? parse(search.substring(1)).id : '';
    const currentRow = id ? recordList.filter(item => item.id === id).map(item => {
      const { freeStartTime='', freeEndTime='', invalidateTime='', validateTime='', transportTypeId} = item
      return {
        ...item,
        transportTypeId: [transportTypeId],
        freeStartTime: freeStartTime ? new Date(freeStartTime.replace(/-/g,'/')) : '',
        freeEndTime: freeEndTime ? new Date(freeEndTime.replace(/-/g,'/')) : '',
        invalidateTime: invalidateTime ? new Date(invalidateTime.replace(/-/g,'/')) : '',
        validateTime: validateTime ? new Date(validateTime.replace(/-/g,'/')) : ''
      }
    })[0] : {};
    if(currentRow) {
      Object.keys(currentRow).forEach(key => {
        filds[key] = createFormField({
          value: currentRow[key]
        })
      })
    }
    return id ? filds : {
      logisticsProviderId: createFormField({
        value: userOrgId
      })
    };
  }
})
class TransportCreate extends PureComponent {
  constructor(props) {
    super(props);
    const { transportModel:{recordList} } = props;
    const search = props.history.location.search;
    const id = this.id = search ? parse(search.substring(1)).id : '';
    this.currentRow = this.id ? recordList.filter(item => item.id === id)[0]: {};
    const logisticsProviderId = this.id ? this.currentRow.logisticsProviderId : userOrgId;
    const { transportName='' } = this.currentRow;
    this.state = {
      logisticsProviderId,
      logisticsProviderName: '',
      transportName
    }
  }
  componentDidMount() {
    this.props.fetchTransportType();
    this.props.fetchTransportName();
    this.props.fetchOrg(data => {
      const logisticsProvider = data.filter(item => item.id === this.state.logisticsProviderId)
      
      const { name:logisticsProviderName } = logisticsProvider[0];
      this.setState({
        logisticsProviderName
      }, () => this.props.form.validateFields());
    });
  }
  handleSubmit = flag => {
    const type = !!flag;
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
        const params = {
          ...this.currentRow,
          ...values,
          status: type ? 20 : 10,
          message: this.id ? '运力编辑成功' : ( type ? '运力提交并上报成功' : '运力发布成功'),
          transportTypeId,
          freeStartTime,
          freeEndTime,
          invalidateTime,
          validateTime
        }
        this.props.createTransport({
          crudType: this.id ? 'update' : 'create',
          ...params
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
      transportType
    } = this.props;
    const { transportName } = this.state;
    const transportSplices = transportSplice.length ? transportSplice.map(item => ({
      ...item,
      label: item.chineseName,
      brief: item.englishName,
      key: item.id,
      value: item.id
    })) : [];
    const buttonDisabled = createTransporting || hasError(getFieldsError())
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
              {
                ...getFieldProps('transportId',{
                  onChange: this.handleTransportNameChange,
                  rules: [
                    { required: true, message: '请选择运力' }
                  ]
                })
              }
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
            {/* <SearchModal
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
            </SearchModal> */}
            
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
            type='ghost' 
            className='mr8'
            onClick={() => this.handleSubmit(true)}
            disabled={buttonDisabled}
            loading={createTransporting}
          >提交并上报</Button>
          <Button 
            type='primary' 
            onClick={() => this.handleSubmit()}
            disabled={buttonDisabled}
            loading={createTransporting}
          >提交</Button>
        </div>
      </Screen>
    )
  }
}

export default TransportCreate;
