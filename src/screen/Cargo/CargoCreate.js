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
import Debounce from 'lodash-decorators/debounce';
import Screen from '@/component/Screen';
import SearchModal from '@/component/SearchModal';
import { mapEffects, mapLoading, hasError } from '@/utils';
import styles from './index.module.less';
import form from '@/style/form.module.less';
import { getUser } from '@/utils/token';

const ListItem = List.Item;
const { username, phone } = getUser();

const mapStateToProps = ({ common }) => {
  return {
    ...common,
    ...mapLoading('common',{
      fetchCargoInfoing: 'fetchCargoInfo',
      fetchCargoTyping: 'fetchCargoType',
      fetchLocationing: 'fetchLocation'
    }),
    ...mapLoading('cargo', {
      createCargoing: 'createCargo'
    })
  }
}
const mapDispatchToProps = ({ common, cargo }) => ({
  ...mapEffects(common, ['fetchCargoInfo', 'fetchCargoType', 'fetchLocation']),
  ...mapEffects(cargo, ['createCargo']),
});

@connect(mapStateToProps, mapDispatchToProps)
@createForm()
class CargoCreate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visibleSearchModal: false,
      cargo:{
        cargoId: -1,
        cargoChineseName: '',
        selectedCargoType: -1
      },
      originName: '',
      terminalName: ''
    }
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleLoctionSearchChange = this.handleLoctionSearchChange.bind(this);
  }
  getCargoType() {
    this.props.fetchCargoType();
  }
  getCargoInfo(params) {
    this.props.fetchCargoInfo(params);
  }
  getLocation() {
    this.props.fetchLocation();
  }
  componentDidMount() {
    this.props.form.validateFields();
    this.getCargoType();
    this.getLocation();
  }
  handleShowCargoSearch = flag => {
    document.documentElement.style.overflow = 'hidden';
    this.setState({
      visibleSearchModal: !!flag
    })
  }
  handleCargoNameChange =(value, data) => {
    const { form:{setFieldsValue} } = this.props
    const { id:cargoId, cargoChineseName, cargoType } = data;
    const cargoTypeId = this.props.cargoType.length ? this.props.cargoType.filter(item => {
      return parseInt(cargoType,10) === parseInt(item.cargoType,10);
    }).map(item => item.id) : [];
    this.setState({
      cargo: {
        cargoId,
        cargoChineseName
      }
    });
    setFieldsValue({cargoTypeId});
  }
  handleLocationChange = (locationName, name) => {
    const { form:{setFieldsValue} } = this.props;
    this.setState({
      [locationName]: name
    })
    setFieldsValue({[locationName]: name});
  }
  @Debounce(200)
  handleSearchChange(cargoChineseName){
    if(!cargoChineseName) return
    this.getCargoInfo({cargoChineseName})
  }
  @Debounce(200)
  handleLoctionSearchChange(name) {
    if(!name) return;
    this.props.fetchLocation({name})
  }
  handleSubmit = () => {
    const { form: { validateFields, resetFields } } = this.props;
    const { cargo: { cargoChineseName } } = this.state;
    validateFields((errors, values) => {
      if(!cargoChineseName) return Toast.info('请选择货名');
      if(errors) {
        Object.keys(errors).forEach(key => {
          return Toast.info(errors[key]['errors'][0].message)
        });
        return;
      } else {
        const cargoTypeId = values.cargoTypeId[0];
        const beginDate = moment(values.beginDate).format('YYYY-MM-DD');
        const endDate = moment(values.endDate).format('YYYY-MM-DD');
        const effectiveDate = moment(values.effectiveDate).format('YYYY-MM-DD');
        const expireDate = moment(values.expireDate).format('YYYY-MM-DD');
        this.props.createCargo({
          ...values,
          message: '货盘发布成功',
          cargoTypeId,
          beginDate,
          endDate,
          effectiveDate,
          expireDate
        },() => {
          resetFields();
          this.setState({
            cargo: {
              cargoChineseName: '',
              selectedCargoType: -1
            },
            originName: '',
            terminalName: ''
          })
        })
      }
    })
  }
  render() {
    const { 
      form: { getFieldProps, getFieldsError }, 
      fetchCargoTyping, 
      fetchLocationing,
      fetchCargoInfoing, 
      createCargoing,
      cargoType, 
      cargoInfo,
      location 
    } = this.props;
    const { cargo: { cargoChineseName, selectedCargoType }, originName, terminalName } = this.state
    const cargoTypes = cargoType.map(t => ({
      ...t,
      label: t.cargoName,
      value: t.id,
      cargoType: parseInt(t.cargoType,10)
    }));
    const locations = location.map(l => ({
      label: l.name,
      brief: l.number,
      value: l.name,
      key: l.id,
      ...l
    }));
    
    const cargos = cargoInfo.length ? cargoInfo.map(item => ({
      label: item.cargoChineseName,
      value: item.id,
      key: item.id,
      brief: item.cargoCode,
      ...item
    })) : [];
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
              货盘发布
            </NavBar>
          )
        }}
      >
        <div className={form.createForm}>
          <List renderHeader={() =>'基本信息'}>
            <InputItem
              {...getFieldProps('originName', {
                initialValue: originName,
                rules: [
                  { required: true, message: '请输入出发地' }
                ]
              })}
              placeholder='请输入'
              extra={
                <SearchModal
                  placeholder='请输入出发地名称'
                  onChange={value => this.handleLocationChange('originName', value)}
                  data={locations}
                  value={originName}
                  loading={fetchLocationing}
                  onSearchChange={this.handleLoctionSearchChange}
                >
                  <span className='text-primary'>列表</span>
                </SearchModal>
              }
            >
              <span className={form.required}>*</span>出发地
            </InputItem>
            <InputItem
              {...getFieldProps('terminalName', {
                initialValue: terminalName,
                rules: [
                  { required: true, message: '请输入目的地' }
                ]
              })}
              placeholder='请输入'
              extra={
                <SearchModal
                  placeholder='请输入目的地名称'
                  onChange={value => this.handleLocationChange('terminalName', value)}
                  value={terminalName}
                  data={locations}
                  loading={fetchLocationing}
                  onSearchChange={this.handleLoctionSearchChange}
                >
                  <span className='text-primary'>列表</span>
                </SearchModal>
              }
            >
              <span className={form.required}>*</span>目的地
            </InputItem>
            {/* <InputItem
              placeholder='请输入'
              clear
              extra='¥'
            >价格</InputItem> */}
          </List>
          <List renderHeader={() =>'货物信息'}>
            <SearchModal
              {...getFieldProps('cargoId',
              {
                onChange: this.handleCargoNameChange
              })}
              data={cargos}
              loading={fetchCargoInfoing}
              onSearchChange={this.handleSearchChange}
            >
              <ListItem
                arrow='horizontal'
                extra={cargoChineseName ? cargoChineseName : '请选择'}
              ><span className={form.required}>*</span>货名</ListItem>
            </SearchModal>
            <Picker
              cols={1}
              {...getFieldProps('cargoTypeId', {
                rules: [
                  { required: true, message: '请选择货类' }
                ]
              })}
              title='货类'
              data={cargoTypes}
              extra={fetchCargoTyping? '加载中...' : '请选择'}
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>货类</ListItem>
            </Picker>
            <InputItem
              {...getFieldProps('tonnage', {
                rules: [
                  { required: true, message: '请输入货物吨位' }
                ]
              })}
              placeholder='请输入'
              clear
              extra='吨'
            ><span className={form.required}>*</span>货物吨位</InputItem>
          </List>
          <List renderHeader={() =>'联系'}>
            <InputItem
              {...getFieldProps('contacts', {
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
              {...getFieldProps('contactsPhone', {
                initialValue: phone,
                rules: [
                  { required: true, message: '请输入联系电话' }
                ]
              })}
              placeholder='请输入'
              clear
            ><span className={form.required}>*</span>联系电话</InputItem>
          </List>
          <List renderHeader={() =>'要求出运日期'}  className={styles.datePickerList}>
            <DatePicker
              extra='请选择'
              {...getFieldProps('beginDate', {
                rules: [
                  { required: true, message: '请选择出运开始日期' }
                ]
              })}
              mode='date'
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>从</ListItem>
            </DatePicker>
            <DatePicker
              {...getFieldProps('endDate', {
                rules: [
                  { required: true, message: '请选择出运结束日期' }
                ]
              })}
              mode='date'
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>到</ListItem>
            </DatePicker>
          </List>
          <List renderHeader={() =>'有效期'} className={styles.datePickerList}>
            <DatePicker
              {...getFieldProps('effectiveDate')}
              mode='date'
            >
              <ListItem arrow='horizontal'>从</ListItem>
            </DatePicker>
            <DatePicker
              {...getFieldProps('expireDate')}
              mode='date'
            >
              <ListItem arrow='horizontal'>到</ListItem>
            </DatePicker>
          </List>
          <List renderHeader={() =>'其他'}>
            <TextareaItem
              {...getFieldProps('remark')}
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
            disabled={
              createCargoing || 
              hasError(getFieldsError())
            }
            loading={createCargoing}
          >提交</Button>
        </div>
      </Screen>
    )
  }
}

export default CargoCreate;
