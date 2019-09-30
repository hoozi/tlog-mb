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
import Debounce from 'lodash-decorators/debounce';
import Screen from '@/component/Screen';
import SearchModal from '@/component/SearchModal';
import { mapEffects, mapLoading, hasError } from '@/utils';
import styles from './index.less';
import form from '@/style/form.less';
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
      } 
    }
    this.handleSearchChange = this.handleSearchChange.bind(this)
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
  handleCargoNameChange = data => {
    const { id:cargoId, cargoChineseName, cargoType } = data;
    this.setState({
      cargo: {
        cargoId,
        cargoChineseName,
        selectedCargoType: parseInt(cargoType,10)
      }
    })
    this.handleShowCargoSearch();
  }
  @Debounce(200)
  handleSearchChange(cargoChineseName){
    if(!cargoChineseName) return
    this.getCargoInfo({cargoChineseName})
  }
  handleSubmit = () => {
    const { form: { validateFields, resetFields } } = this.props;
    const { cargo: { cargoChineseName, cargoId } } = this.state
    validateFields((errors, values) => {
      if(!cargoChineseName) return Toast.info('请选择货名');
      if(errors) {
        Object.keys(errors).forEach(key => {
          return Toast.info(errors[key]['errors'][0].message)
        });
        return;
      } else {
        const originId = values.originId[0];
        const terminalId = values.terminalId[0];
        const cargoTypeId = values.cargoTypeId[0];
        const beginDate = moment(values.beginDate).format('YYYY-MM-DD');
        const endDate = moment(values.endDate).format('YYYY-MM-DD');
        const effectiveDate = moment(values.effectiveDate).format('YYYY-MM-DD');
        const expireDate = moment(values.expireDate).format('YYYY-MM-DD');
        this.props.createCargo({
          ...values,
          message: '货盘发布成功',
          originId,
          terminalId,
          cargoTypeId,
          cargoId,
          beginDate,
          endDate,
          effectiveDate,
          expireDate
        },() => {
          resetFields();
          this.setState({
            cargo: {
              cargoChineseName:'', 
              cargoId: -1,
              selectedCargoType: -1
            }
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
    const { cargo: { cargoChineseName, cargoId, selectedCargoType }, visibleSearchModal } = this.state
    const cargoTypes = cargoType.map(t => ({
      ...t,
      label: t.cargoName,
      value: t.id,
      cargoType: parseInt(t.cargoType,10)
    }));
    const locations = location.map(l => ({
      label: <div key={l.id}>{l.name} <span style={{color:'#a4a9b0', fontSize: 12}}>{l.helpcode}</span></div>,
      value: l.id
    }));
    const parentMethods = {
      onCancel: () => this.handleShowCargoSearch(),
      onSearchChange: this.handleSearchChange,
      onItemChange: this.handleCargoNameChange
    }
    const selectedCargoTypes = cargoTypes ? cargoTypes.filter(item => {
      return this.state.cargo.selectedCargoType === item.cargoType;
    }).map(item => item.id) : [];
    const cargos = cargoInfo.length ? cargoInfo.map(item => ({
      label: item.cargoChineseName,
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
            <Picker
              cols={1}
              {...getFieldProps('originId', {
                rules: [
                  { required: true, message: '请选择出发地' }
                ]
              })}
              title='出发地'
              data={locations}
              extra={fetchLocationing? '加载中...' : '请选择'}
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>出发地</ListItem>
            </Picker>
            <Picker
              cols={1}
              {...getFieldProps('terminalId', {
                rules: [
                  { required: true, message: '请选择目的地' }
                ]
              })}
              title='目的地'
              data={locations}
              extra={fetchLocationing? '加载中...' : '请选择'}
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>目的地</ListItem>
            </Picker>
            {/* <InputItem
              placeholder='请输入'
              clear
              extra='¥'
            >价格</InputItem> */}
          </List>
          <List renderHeader={() =>'货物信息'}>
            <ListItem
              arrow='horizontal'
              extra={cargoChineseName ? cargoChineseName : '请选择'}
              onClick={() => this.handleShowCargoSearch(true)}
            ><span className={form.required}>*</span>货名</ListItem>
            <Picker
              cols={1}
              {...getFieldProps('cargoTypeId', {
                initialValue: selectedCargoTypes
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
              {...getFieldProps('effectiveDate', {
                rules: [
                  { required: true, message: '请选择生效日期' }
                ]
              })}
              mode='date'
            >
              <ListItem arrow='horizontal'><span className={form.required}>*</span>从</ListItem>
            </DatePicker>
            <DatePicker
              {...getFieldProps('expireDate', {
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
              {...getFieldProps('remark')}
              placeholder='请输入备注'
              rows={5}
              count={100}
              className='needsclick'
            />
          </List>
        </div>
        <SearchModal
          visible={visibleSearchModal}
          data={cargos}
          value={cargoChineseName}
          selectedValue={cargoId}
          loading={fetchCargoInfoing}
          {...parentMethods}
        />
        <div className={form.bottomButton}>
          <Button 
            type='primary' 
            onClick={this.handleSubmit}
            disabled={!cargoChineseName || createCargoing || hasError(getFieldsError()) || !selectedCargoType}
            loading={createCargoing}
          >提交</Button>
        </div>
      </Screen>
    )
  }
}

export default CargoCreate;
