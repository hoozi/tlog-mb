import React from 'react';
import { List, ActivityIndicator, Flex } from 'antd-mobile';
import isEmpty from 'lodash/isEmpty';
import form from '@/style/form.less';
import Empty from '../Empty';

const ListItem = List.Item;

const FieldItem = ({item, data, labelWidth}) => {
  return (
    <ListItem extra={item.extra ? item.extra(data[item.dataIndex], item, data) : null} {...item.props}>
      <Flex className={form.fieldContainer} align='start'>
        <span className={form.fieldName} style={{width: labelWidth}}>{item.title}</span>
        <span className={form.fieldValue}>{item.render ? item.render(data[item.dataIndex], item, data) : data[item.dataIndex]}</span>
      </Flex>
    </ListItem>
  )
}

export default props => {
  const { columns=[], data={}, loading=false, fieldHeader=null, labelWidth=85 } = props;
  return (
    <List renderHeader={fieldHeader ? fieldHeader : null}>
      {
        loading ?
        <div style={{minHeight: 128, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator text='加载中...'/>
        </div> :
        !isEmpty(data) ?
        columns.map((item, index) => <FieldItem item={item} data={data} key={index} labelWidth={labelWidth}/>) :
        <div style={{minHeight: 128, position: 'relative'}}><Empty/></div>
      }
    </List>
  )
}