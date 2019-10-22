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
import { createForm, createFormField } from 'rc-form';
import moment from 'moment';
import { parse } from 'qs';
import Debounce from 'lodash-decorators/debounce';
import Screen from '@/component/Screen';
import SearchModal from '@/component/SearchModal';
import { mapEffects, mapLoading, hasError } from '@/utils';
import styles from './index.module.less';
import form from '@/style/form.module.less';
import { getUser } from '@/utils/token';

const ListItem = List.Item;
const { username, phone } = getUser();

const mapStateToProps = ({ common, cargo }) => {
  return {
    cargo,
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
@createForm({
  mapPropsToFields(props) {
    const { cargo:{recordList} } = props;
    const filds = {};
    const search = props.history.location.search;
    const id = search ? parse(search.substring(1)).id : '';
    const currentRow = id ? recordList.filter(item => item.id === id).map(item => {
      const { beginDate='', endDate='', effectiveDate='', expireDate='', cargoTypeId } = item
      return {
        ...item,
        cargoTypeId: [cargoTypeId],
        beginDate: beginDate ? new Date(beginDate.replace(/-/g,'/')) : '',
        endDate: endDate ? new Date(endDate.replace(/-/g,'/')) : '',
        effectiveDate: effectiveDate ? new Date(effectiveDate.replace(/-/g,'/')) : '',
        expireDate: expireDate ? new Date(expireDate.replace(/-/g,'/')) : ''
      }
    })[0] : {};
    if(currentRow) {
      Object.keys(currentRow).forEach(key => {
        filds[key] = createFormField({
          value: currentRow[key]
        })
      })
    }
    return filds;
  }
})
class CargoCreate extends PureComponent {
  constructor(props) {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    super(props);
    const { cargo:{recordList} } = props;
    const search = props.history.location.search;
    const id = search ? parse(search.substring(1)).id : '';
    this.currentRow = id ? recordList.filter(item => item.id === id)[0]: {};
    const { cargo,originName,terminalName } = this.currentRow;
    this.state = {
      cargo:{
        cargoChineseName: cargo
      },
      originName,
      terminalName
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
    const { cargoChineseName, cargoType } = data;
    const cargoTypeId = this.props.cargoType.length ? this.props.cargoType.filter(item => {
      return parseInt(cargoType,10) === parseInt(item.cargoType,10);
    }).map(item => item.id) : [];
    
    this.setState({
      ...this.state,
      cargo: {
        cargoChineseName
      }
    },() => console.log(this.state));
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
          crudType: this.id ? 'update' : 'create',
          ...this.currentRow,
          ...values,
          message: this.id ? '货盘编辑成功' : '货盘发布成功',
          cargoTypeId,
          beginDate,
          endDate,
          effectiveDate,
          expireDate
        },() => {
          resetFields();
          this.setState({
            cargo: {
              cargoChineseName: ''
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
    const { cargo: { cargoChineseName }, originName, terminalName } = this.state
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
                onChange: value => this.handleLocationChange('originName', value),
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
                onChange: value => this.handleLocationChange('terminalName', value),
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
