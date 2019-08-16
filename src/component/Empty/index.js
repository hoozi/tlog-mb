import React from 'react';
import noinfo from '@/assets/noinfo.svg';

export default props => (
  <div style={styles.container}>
    <img src={noinfo} alt={props.description || '暂无数据'}/>
    <span style={styles.text}>{props.description || '暂无数据'}</span>
  </div>
)

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: -32
  },
  text: {
    color: '#a4a9b0',
    marginTop: 8
  }
}