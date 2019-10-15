import React from 'react';
import { Modal, SearchBar, List, Radio } from 'antd-mobile';
import Empty from '@/component/Empty';
import CenterLoading from '@/component/CenterLoading';
import styles from './index.module.less';

const RadioItem = Radio.RadioItem;
const ListItem = List.Item;

export default props => {
  const { visible, onCancel, placeholder='请输入货名', onSearchChange, data, value, loading, onItemChange, selectedValue } = props;
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
        placeholder={placeholder} 
        className={styles.searchBar} 
        onChange={onSearchChange}
        onCancel={onCancel} 
        showCancelButton
      />
      {
        loading ? 
        <CenterLoading/> :
        data.length ? 
        <List style={{height: 'calc(100% - 45px)', overflow: 'auto'}}>
          {
            data.map(item => (
              <RadioItem key={item.id} checked={item.id === selectedValue} onChange={e => onItemChange(item)}>
                {item.label}<ListItem.Brief>{item.brief}</ListItem.Brief>
              </RadioItem>
            ))
          }
        </List> :
        <Empty/>
      }
    </Modal>
  )
}