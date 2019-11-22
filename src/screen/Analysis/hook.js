/* eslint-disable */
import { useState, useEffect } from 'react';
import find from 'lodash/find';

export default props => {
  const { analysis } = props
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const years = [
    {
      name: '今年(万吨)',
      value: 0
    },
    {
      name: '去年(万吨)',
      value: 1
    }
  ]
  useEffect(() => {
    props.fetchBarAnalysis({}, analysisBarCallback);
    props.fetchPieAnalysis({}, analysisPieCallback);
  }, []);
  const analysisBarCallback = data => {
    getCurrentBarData(data, -1);
  }
  const analysisPieCallback = data => {
    getCurrentPieData(data, 0);
  }
  const getCurrentBarData = (data,customerId) => {
    const current = find(data, item => item.customerId === customerId);
    setBarData(current)
  }
  const getCurrentPieData = (data, index) => {
    const current = data[index];
    setPieData(current);
  }
  const handleCustomerChange = value => {
    getCurrentBarData(analysis.barData, value);
  }
  const handleYearChange = value => {
    const index = years[value].value;
    getCurrentPieData(analysis.pieData, index);
  }
  return {
    years,
    barData,
    pieData,
    handleCustomerChange,
    handleYearChange
  };
}