/* eslint-disable */
import { useState, useEffect } from 'react';
import find from 'lodash/find';

export default props => {
  const { analysis, operation } = props;
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
    props.fetchBarAnalysis({operation}, analysisBarCallback);
    props.fetchPieAnalysis({operation}, analysisPieCallback);
  }, []);
  const analysisBarCallback = data => {
    getCurrentBarData(data, 0);
  }
  const analysisPieCallback = data => {
    getCurrentPieData(data, 0);
  }
  const getCurrentBarData = (data,index) => {
    const current = data[index];
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