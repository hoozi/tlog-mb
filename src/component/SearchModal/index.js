import React, { useCallback, useState, forwardRef } from 'react';
import { Modal, SearchBar, List, Radio } from 'antd-mobile';
import Empty from '@/component/Empty';
import CenterLoading from '@/component/CenterLoading';
import styles from './index.module.less';

const RadioItem = Radio.RadioItem;
const ListItem = List.Item;

export default forwardRef((props, ref) => {
  const { placeholder='请输入货名', data, value, loading, onChange, children, onSearchChange } = props;
  const [ visible, setVisible ] = useState(false);
  const handleModalVisible = useCallback(flag => {
    setVisible(!!flag)
  },[]);
  const handleChange = (value, item) => {
    handleModalVisible();
    onChange && onChange(value, item);
  }
  return (
    <>
      <div onClick={() => handleModalVisible(true)}>{children}</div>
      <Modal
        ref={ref}
        popup
        visible={visible}
        animationType='slide-up'
        className={styles.modalFullScreen}
        afterClose={() => document.documentElement.style.overflow=''}
      >
        <SearchBar 
          placeholder={placeholder} 
          className={styles.searchBar} 
          onChange={onSearchChange}
          onCancel={() => handleModalVisible()} 
          showCancelButton
        />
        {
          loading ? 
          <CenterLoading/> :
          data.length ? 
          <List style={{height: 'calc(100% - 45px)', overflow: 'auto'}}>
            {
              data.map(item => (
                <RadioItem key={item.key} checked={item.value === value} onChange={e => handleChange(item.value, item)}>
                  {item.label}<ListItem.Brief>{item.brief}</ListItem.Brief>
                </RadioItem>
              ))
            }
          </List> :
          <Empty/>
        }
      </Modal>
    </>
  )
})