import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

export default props => (
  <div style={styles.loadingContainer}><ActivityIndicator text='列表加载中...' {...props}/></div>
) 

const styles = {
  loadingContainer: {
    position: 'absolute', 
    top: '50%', 
    width: '100%',  
    display: 'flex', 
    justifyContent: 'center', 
    marginTop: -10
  }
}