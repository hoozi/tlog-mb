import React, { Component } from 'react';
import { NavBar, Icon, Picker, List, InputItem, TextareaItem, DatePicker } from 'antd-mobile';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import Screen from '@/component/Screen';
import { BARND_COLOR } from '@/constants/color';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.less';

const mapStateToProps = ({ any }) => {
  return {
    ...any,
    ...mapLoading('any',{
      fetchCargoInfoing: 'fetchCargoInfo',
      fetchCargoTyping: 'fetchCargoType',
      fetchLocationing: 'fetchLocation',
    })
  }
}

const mapDispatchToProps = ({ any }) => ({
  ...mapEffects(any, ['fetchCargoInfo', 'fetchCargoType', 'fetchLocation'])
});

@connect(mapStateToProps, mapDispatchToProps)
@createForm()
class CargoCreate extends Component {
  getCargoType() {
    this.props.fetchCargoType();
  }
  getCargoInfo() {
    this.props.fetchCargoInfo();
  }
  getLocation() {
    this.props.fetchLocation();
  }
  componentDidMount() {
    this.getCargoInfo();
    this.getCargoType();
    this.getLocation();
  }
  render() {
    const { form: { getFieldProps, getFieldError } } = this.props
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
              rightContent={<span>提交</span>}
            >
              货盘发布
            </NavBar>
          )
        }}
      >
        <div className={styles.createForm}>
          <List renderHeader={() =>'基本信息'}>
            <InputItem
              {...getFieldProps('originId', {
                // initialValue: 'little ant',
                rules: [
                  { required: true, message: '请输入出发地' }
                ],
              })}
              error={!!getFieldError('originId')}
              placeholder='请输入'
              clear
            >出发地</InputItem>
            <InputItem
              {...getFieldProps('terminalId', {
                // initialValue: 'little ant',
                rules: [
                  { required: true, message: '请输入出发地' }
                ],
              })}
              error={!!getFieldError('terminalId')}
              placeholder='请输入'
              clear
            >目的地</InputItem>
            {/* <InputItem
              placeholder='请输入'
              clear
              extra='¥'
            >价格</InputItem> */}
          </List>
          <List renderHeader={() =>'货物信息'}>
            <Picker
              cols={1}
            >
              <List.Item arrow='horizontal'>货类</List.Item>
            </Picker>
            <InputItem
              placeholder='请输入'
              clear
              editable={false}
              onExtraClick={this.handleSearchCargo}
              extra={<Icon type='search' size='xs' color={BARND_COLOR}/>}
            >货名</InputItem>
            <InputItem
              placeholder='请输入'
              clear
              extra='吨'
            >货物吨位</InputItem>
          </List>
          <List renderHeader={() =>'联系'}>
            <InputItem
              placeholder='请输入'
              clear
            >联系人</InputItem>
            <InputItem
              type='number'
              placeholder='请输入'
              clear
            >联系电话</InputItem>
          </List>
          <List renderHeader={() =>'要求出运日期'}  className={styles.datePickerList}>
            <DatePicker
              extra='请选择'
              {...getFieldProps('beginDate', {
                // initialValue: 'little ant',
                rules: [
                  { required: true, message: '请选择出运开始日期' }
                ],
              })}
            >
              <List.Item arrow='horizontal'>从</List.Item>
            </DatePicker>
            <DatePicker
              {...getFieldProps('endDate', {
                // initialValue: 'little ant',
                rules: [
                  { required: true, message: '请选择出运结束日期' }
                ],
              })}
            >
              <List.Item arrow='horizontal'>到</List.Item>
            </DatePicker>
          </List>
          <List renderHeader={() =>'有效期'} className={styles.datePickerList}>
            <DatePicker
              {...getFieldProps('effectiveDate', {
                // initialValue: 'little ant',
                rules: [
                  { required: true, message: '请选择生效日期' }
                ],
              })}
            >
              <List.Item arrow='horizontal'>从</List.Item>
            </DatePicker>
            <DatePicker
              {...getFieldProps('expireDate', {
                // initialValue: 'little ant',
                rules: [
                  { required: true, message: '请选择失效日期' }
                ],
              })}
            >
              <List.Item arrow='horizontal'>到</List.Item>
            </DatePicker>
          </List>
          <List renderHeader={() =>'其他'}>
            <TextareaItem
              placeholder='请输入备注'
              rows={5}
              count={100}
              className='needsclick'
            />
          </List>
        </div>
      </Screen>
    )
  }
}

export default CargoCreate;
