import React, { useState } from 'react';
import { Flex, Picker, Card, Icon, ActivityIndicator } from 'antd-mobile';
import find from 'lodash/find';
import Bar from '@/component/Charts/Bar';
import CenterLoading from '@/component/CenterLoading';
import Empty from '@/component/Empty';

export default props => {
  const { data=[], pickerData=[], onOk, title='', loading } = props;
  const [selected, setSelected] = useState(0);
  const handleOk = value => {
    setSelected(value[0]);
    onOk && onOk(value[0]);
  }
  return (
    <Card full className='mt8'>
      <Card.Header
        title={title}
        className='pt16 pb16'
        extra={ 
          <Picker
            value={[selected]}
            cols={1}
            data={pickerData}
            onOk={handleOk}
          >
            <Flex justify='end' align='center'>
              {
                loading ?
                <ActivityIndicator/> :
                <>
                  {
                    pickerData.length ? 
                    find(pickerData, item=>item.value === selected).label :
                    ''
                  }<Icon type='xiayiyeqianjinchakangengduo' size='xs'/>
                </>
              }
            </Flex>
          </Picker>
        }
      />
      <Card.Body>
        <div style={{minHeight: 288, position: 'relative'}}>
          {
            loading ?
            <CenterLoading text='加载中...'/> :
            data && data.length ? <Bar data={data}/> : <Empty description='暂无统计数据'/>
          }
        </div>
      </Card.Body>
    </Card>
  )
}
