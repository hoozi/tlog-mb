import React from 'react';
import noinfo from '@/assets/noinfo.svg';

export default props => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop: 258}}>
    <img src={noinfo}/>
    <span style={{color: '#a4a9b0', marginTop: 8}}>{props.description}</span>
  </div>
)