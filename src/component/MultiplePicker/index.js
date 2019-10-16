import React, { Component } from 'react';
import { Modal, List, Checkbox, Flex } from 'antd-mobile';
import includes from 'lodash/includes';
import findIndex from 'lodash/findIndex';
import styles from './index.module.less';
const ListItem = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;

export default class MultiplePicker extends Component {
  state = {
    visible: false,
    selected: this.props.value.filter(item => item) || []
  }
  handleShowPicker = flag => {
    this.setState({
      visible: !!flag
    })
  }
  handleChange = item => {
    const index = findIndex(this.state.selected, selected => selected.value === item.value);
    index === -1 ? this.state.selected.push(item) : this.state.selected.splice(index,1);
    this.forceUpdate();
  }
  handleOk = () => {
    const { selected } = this.state;
    this.handleShowPicker();
    this.props.onChange && this.props.onChange(selected)
  }
  render() {
    const { data=[], value, title='', extra='' } = this.props
    const { visible } = this.state;
    const _value = value.filter(item => item);
    return (
      <>
        <ListItem onClick={() => this.handleShowPicker(true)} arrow='horizontal' extra={_value.length ? _value.map(item => item.label).join(',') : extra}>{this.props.children}</ListItem>
        <Modal
          visible={visible}
          popup
          animationType='slide-up'
          maskClosable
          onClose={() => this.handleShowPicker()}
        >
          <Flex justify='between' className={styles.multiplePickerHeader}>
            <span className='text-primary' onClick={() => this.handleShowPicker()}>取消</span>
            <span className={styles.title}>{title}</span>
            <span className='text-primary' onClick={this.handleOk}>确定</span>
          </Flex>
          <List style={{height: 238, overflowY: 'auto'}}>
            {
              data.map(item => (
                <CheckboxItem defaultChecked={includes(this.props.value.map(item=>item.value), item.value)} key={item.value} onChange={() => this.handleChange(item)}>{item.label}</CheckboxItem>
              ))
            }
          </List>
        </Modal>
      </>
    )
  }
}
