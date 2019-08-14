import React, { PureComponent, memo } from 'react';
import { 
  NavBar, 
  Icon, 
  Picker, 
  List, 
  InputItem, 
  TextareaItem,
  DatePicker,
  SearchBar,
  Modal,
  Radio,
  ActivityIndicator,
  Button,
  Toast
} from 'antd-mobile';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import Screen from '@/component/Screen';
import Empty from '@/component/Empty';
//import { BARND_COLOR } from '@/constants/color';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.less';

const RadioItem = Radio.RadioItem;
const ListItem = List.Item;

const mapStateToProps = ({ any }) => {
  return {
    ...any,
    ...mapLoading('any',{
      fetchCargoInfoing: 'fetchCargoInfo',
      fetchCargoTyping: 'fetchCargoType',
      fetchLocationing: 'fetchLocation',
      createCargoing: 'createCargo'
    })
  }
}
const mapDispatchToProps = ({ any }) => ({
  ...mapEffects(any, ['fetchCargoInfo', 'fetchCargoType', 'fetchLocation','createCargo'])
});

const SearchCargo = props => {
  const { visible, onCancel, onSearchChange, data, value, loading, onItemChange, selectedValue } = props;
  return (
    <Modal
      popup
      visible={visible}
      animationType='slide-up'
      className={styles.modalFullScreen}
      afterClose={() => document.documentElement.style.overflow=''}
    >
      <SearchBar 
        defaultValue={value}
        placeholder='请输入货名，模糊搜索' 
        className={styles.searchBar} 
        onChange={onSearchChange}
        onCancel={onCancel} 
        showCancelButton
      />
      {
        loading ? 
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 128}}><ActivityIndicator text='查询中...'/></div> :
        data.length ? 
        <List style={{height: 'calc(100% - 45px)', overflow: 'auto'}}>
          {
            data.map(item => (
              <RadioItem key={item.id} checked={item.id === selectedValue} onChange={e => onItemChange(item)}>
                {item.cargoChineseName}<ListItem.Brief>{item.cargoCode}</ListItem.Brief>
              </RadioItem>
            ))
          }
        </List> :
        <Empty description='暂无货物信息'/>
      }
    </Modal>
  )
}

const hasError = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

@connect(mapStateToProps, mapDispatchToProps)
@createForm()
class CargoCreate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visibleSearchModal: false,
      cargo:{
        cargoId: -1,
        cargoChineseName: ''
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
    const { id:cargoId, cargoChineseName } = data;
    this.setState({
      cargo: {
        cargoId,
        cargoChineseName
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
        const beginDate = moment(values.beginDate).format('YYYY-MM-DD HH:mm:ss');
        const endDate = moment(values.endDate).format('YYYY-MM-DD HH:mm:ss');
        const effectiveDate = moment(values.effectiveDate).format('YYYY-MM-DD HH:mm:ss');
        const expireDate = moment(values.expireDate).format('YYYY-MM-DD HH:mm:ss');
        this.props.createCargo({
          ...values,
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
              cargoId: -1
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
    const { cargo: { cargoChineseName, cargoId }, visibleSearchModal } = this.state
    const cargoTypes = cargoType.map(t => ({
      label: t.cargoName,
      value: t.id
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
    return (
      <Screen
        className={styles.cargoScreen}
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
        <div className={styles.createForm}>
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
              <ListItem arrow='horizontal'><span className={styles.required}>*</span>出发地</ListItem>
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
              <ListItem arrow='horizontal'><span className={styles.required}>*</span>目的地</ListItem>
            </Picker>
            {/* <InputItem
              placeholder='请输入'
              clear
              extra='¥'
            >价格</InputItem> */}
          </List>
          <List renderHeader={() =>'货物信息'}>
            <Picker
              cols={1}
              {...getFieldProps('cargoTypeId', {
                
              })}
              title='货类'
              data={cargoTypes}
              extra={fetchCargoTyping? '加载中...' : '请选择'}
            >
              <ListItem arrow='horizontal'><span className={styles.required}>*</span>货类</ListItem>
            </Picker>
            <ListItem
              arrow='horizontal'
              extra={cargoChineseName ? cargoChineseName : '请选择'}
              onClick={() => this.handleShowCargoSearch(true)}
            ><span className={styles.required}>*</span>货名</ListItem>
            <InputItem
              {...getFieldProps('tonnage', {
                rules: [
                  { required: true, message: '请输入货物吨位' }
                ]
              })}
              placeholder='请输入'
              clear
              extra='吨'
            ><span className={styles.required}>*</span>货物吨位</InputItem>
          </List>
          <List renderHeader={() =>'联系'}>
            <InputItem
              {...getFieldProps('contacts')}
              placeholder='请输入'
              clear
            >联系人</InputItem>
            <InputItem
              type='number'
              {...getFieldProps('contactsPhone')}
              placeholder='请输入'
              clear
            >联系电话</InputItem>
          </List>
          <List renderHeader={() =>'要求出运日期'}  className={styles.datePickerList}>
            <DatePicker
              extra='请选择'
              {...getFieldProps('beginDate', {
                rules: [
                  { required: true, message: '请选择出运开始日期' }
                ]
              })}
            >
              <ListItem arrow='horizontal'><span className={styles.required}>*</span>从</ListItem>
            </DatePicker>
            <DatePicker
              {...getFieldProps('endDate', {
                rules: [
                  { required: true, message: '请选择出运结束日期' }
                ]
              })}
            >
              <ListItem arrow='horizontal'><span className={styles.required}>*</span>到</ListItem>
            </DatePicker>
          </List>
          <List renderHeader={() =>'有效期'} className={styles.datePickerList}>
            <DatePicker
              {...getFieldProps('effectiveDate', {
                rules: [
                  { required: true, message: '请选择生效日期' }
                ]
              })}
            >
              <ListItem arrow='horizontal'><span className={styles.required}>*</span>从</ListItem>
            </DatePicker>
            <DatePicker
              {...getFieldProps('expireDate', {
                rules: [
                  { required: true, message: '请选择失效日期' }
                ]
              })}
            >
              <ListItem arrow='horizontal'><span className={styles.required}>*</span>到</ListItem>
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
        <SearchCargo
          visible={visibleSearchModal}
          data={cargoInfo}
          value={cargoChineseName}
          selectedValue={cargoId}
          loading={fetchCargoInfoing}
          {...parentMethods}
        />
        <div className={styles.bottomButton}>
          <Button 
            type='primary' 
            onClick={this.handleSubmit}
            disabled={!cargoChineseName || createCargoing || hasError(getFieldsError())}
            loading={createCargoing}
          >提交</Button>
        </div>
      </Screen>
    )
  }
}

export default CargoCreate;
