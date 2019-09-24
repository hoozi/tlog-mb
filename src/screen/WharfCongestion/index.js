import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { NavBar, Icon } from 'antd-mobile';
import { connect } from 'react-redux';
import Empty from '@/component/Empty';
import CenterLoading from '@/component/CenterLoading';
import Screen from '@/component/Screen';
import { mapEffects, mapLoading } from '@/utils';

const mapStateToProps = (({congestion}) => ({
  ...congestion,
  ...mapLoading('congestion', {
    fetchCongestioning: 'fecthCongestion'
  })
}));

const mapDispatchToProps = (({congestion}) => mapEffects(congestion, ['fetchCongestion']))

const LeftList = props => {

}

const TopList = props => {
  
}

@connect(mapStateToProps, mapDispatchToProps)
class WharfCongestion extends Component {
  dir = 1
  s = React.createRef()
  componentDidMount() {
    this.props.fetchCongestion({}, data => {
      console.log(this.s.current)
    });
    /* findDOMNode(this.s.current).addEventListener('scroll', function(e){
      
    }, false) */
  }
  render() {
    const { congestions, fetchCongestioning, history } = this.props;
    return (
      <Screen
        header={() => (
          <NavBar
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            拥堵情况
          </NavBar>
        )}
      >
      {
        fetchCongestioning ? 
        <CenterLoading/> :
        congestions.length ? 
        <div style={{width: '100%', height: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch'}}>
          <div style={{width: 1000, height: 1000}}>
            <div style={{float: 'left', width: 500}}>1</div>
            <div style={{float: 'left', width: 500}}>1</div>
          </div>
        </div> 
        :
        <Empty/>
      }
      </Screen>
    )
  }
}

export default WharfCongestion;
