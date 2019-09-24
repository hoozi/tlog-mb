import React from 'react';
import { NavBar, Icon, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { Link } from 'react-router-dom';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import Empty from '@/component/Empty';
import Screen from '@/component/Screen';
import Fields from '@/component/Fields';
import RouteCard from '@/component/RouteCard';
import form from '@/style/form.less';

const mapStateToProps = (({task}) => ({...task}));

export default connect(mapStateToProps)(props => {
  const { history, recordList, location:{search} } = props;
  const id = parse(search.substring(1))['id'];
  const data = find(recordList.map(item => ({...item})), item => item.id === id);
  const columns = [
    {
      title: '合同号',
      dataIndex: 'contractNo',
      render: value => <span className='text-important'><Icon type='fujian' size='xxs' style={{verticalAlign: 'middle', margin: '-4px 2px 0 0'}}/>{value}</span>
    },
    {
      title: '船名/航次',
      dataIndex: '_',
      render: (value, row, {vesselEnglishName, voyage}) => `${vesselEnglishName}/${voyage}`
    },
    {
      title: '船长',
      extra: () => 'm'
    },
    {
      title: '吃水',
      extra: () => 'm'
    },
    {
      title: '载重吨',
      extra: () => '吨'
    },
    {
      title: '作业类型',
      dataIndex: 'bizTypeName'
    },
    {
      title: '托运人',
      dataIndex: 'customerName'
    },
    {
      title: '货名',
      dataIndex: 'skuName'
    },
    {
      title: '计划量',
      dataIndex: 'planQuantity',
      extra: () => '吨'
    },
    {
      title: '结算量',
      dataIndex: 'seitQuantity',
      extra: () => '吨'
    },
    {
      title: '联系人',
      dataIndex: 'contactName'
    },
    {
      title: '联系电话',
      dataIndex: 'contactNumber'
    }
  ]
  return (
    <Screen
      header={() => (
        <NavBar
          mode='dark'
          icon={<Icon type='left' size='lg'/>}
          onLeftClick={() => history.goBack()}
        >
          任务详情
        </NavBar>
      )}
    >
      {
        !isEmpty(data) ?
        <>
          <RouteCard from={data.loadName} to={data.unloadName}/>
          <div className={form.createForm}><Fields columns={columns} data={data}/></div>
          <div className={form.bottomButton}>
            <Flex>
              <Flex.Item className='text-center'>
                <Link to={`/task-track?id=${data.id}`}>
                  <span>物流跟踪</span>
                </Link>
              </Flex.Item>
            </Flex>
          </div>
        </> : 
        <Empty/>
      }
    </Screen>
  )
})