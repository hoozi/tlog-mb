import React from 'react';
import { connect } from 'react-redux';
import { mapEffects, mapLoading } from '@/utils';
import useAnalysis from './hook';
import PieCard from './PieCard';
import BarCard from './BarCard';

const color = [
  '#1890FF', 
  '#f5222d', 
  '#ffbb96',
  '#eb2f96', 
  '#faad14', 
  '#fadb14', 
  '#a0d911',
  '#52c41a',
  '#13c2c2',
  '#2f54eb'
];

const Customer = props => {
  const { analysis, fetchBarAnalysising, fetchPieAnalysising } = props
  const { pieData, barData, handleCustomerChange, handleYearChange, years } = useAnalysis({...props, operation: 'customer'})
  return (
    <>
      <PieCard
        loading={fetchPieAnalysising}
        years={years}
        onYearChange={handleYearChange}
        pieColor={color}
        pieData={pieData}
        totalTitle='客户业务量总计'
        total={pieData.reduce((cur, pre) => cur+pre.x,0)}
      />
      <BarCard
        loading={fetchBarAnalysising}
        data={barData.histogramItemList}
        pickerData={analysis.picker}
        onOk={handleCustomerChange}
        title='客户月度统计'
      />
    </>
  )
}

const mapStateToProps = ({analysis}) => ({
  analysis,
  ...mapLoading('analysis', {
    fetchBarAnalysising: 'fetchBarAnalysis',
    fetchPieAnalysising: 'fetchPieAnalysis'
  })
});
const mapDispatchToProps = ({analysis}) => mapEffects(analysis, ['fetchBarAnalysis', 'fetchPieAnalysis'])

export default connect(mapStateToProps, mapDispatchToProps)(Customer);