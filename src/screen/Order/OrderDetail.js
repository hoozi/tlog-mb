import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { Link } from 'react-router-dom';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import Empty from '@/component/Empty';
import Screen from '@/component/Screen';
import Fields from '@/component/Fields';
import RouteCard from '@/component/RouteCard';
import form from '@/style/form.module.less';

const STATUS_MAP = {
  '00': '未知',
  '10': '已创建',
  '20': '待配载',
  '30': '已配载',
  '40': '待审核',
  '50': '执行中',
  '90': '已完成'
}

const mapStateToProps = (({order}) => ({...order}));

export default connect(mapStateToProps)(props => {
  const { history, recordList, location:{search} } = props;
  const id = parse(search.substring(1))['id'];
  const data = find(recordList.map(item => ({...item})), item => item.id === id);
  const columns = [
    {
      title: '合同号',
      dataIndex: 'orderNo',
      extra: (value, row, {status}) => {
        return <b style={{fontWeight:500, color: status === '90' ? '#6abf47' :'#3c73f0'}}>{STATUS_MAP[status]}</b>
      }
    },/* ,
    {
      title: '合同号',
      dataIndex: 'contractNo',
      render: value => <span className='text-important'><Icon type='fujian' size='xxs' style={{verticalAlign: 'middle', margin: '-4px 2px 0 0'}}/>{value}</span>
    }, */
    {
      title: '作业类型',
      dataIndex: 'bizTypeName'
    },
    {
      title: '托运人',
      dataIndex: 'customerName'
    },
    {
      title: '船名/航次',
      dataIndex: '_',
      render: (value, row, {vesselEnglishName, voyage}) => `${vesselEnglishName}/${voyage}`
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
      title: '单价',
      dataIndex: 'price',
      render: value => `¥ ${value}`,
      extra: () => '元'
    },
    {
      title: '支付方式',
      dataIndex: 'payTypeName'
    },
    {
      title: '结算方式',
      dataIndex: 'settleTypeName'
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
          订单详情
        </NavBar>
      )}
    >
      {
        !isEmpty(data) ?
        <>
          <RouteCard justify='between' from={data.loadName} to={data.unloadName}/>
          <div className={form.createForm}><Fields columns={columns} data={data}/></div>
          <div className={form.bottomButton}>
            <Link to={`/task?id=${data.id}`} className='text-center'>
              <span>物流任务</span>
            </Link>
            <Link to={`/order-comment?id=${data.id}`} className='text-center'>
              <span>订单评价</span>
            </Link>
          </div>
        </> : 
        <Empty/>
      }
      
    </Screen>
  )
})