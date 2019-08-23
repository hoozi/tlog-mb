import React, { PureComponent } from 'react';
import { ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile';
import PropTypes from 'prop-types';
import Empty from '@/component/Empty';
import card from '@/style/card.less';
import StandardCard from '../StandardCard';

const ListBody = props => (
  <div className='am-list-body no-top-bor' style={{backgroundColor: '#f5f5f9'}}>{props.children}</div>
)
const ListFirstLoading = props => (
  <div style={styles.loadingContainer}><ActivityIndicator text='列表加载中...' {...props}/></div>
) 

export default class StandardList extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    hasMore: PropTypes.bool,
    refreshing: PropTypes.bool,
    firstLoading: PropTypes.bool,
    dataSource: PropTypes.object,
    onEndReached: PropTypes.func,
    onRefresh: PropTypes.func,
    renderListCardHeader: PropTypes.func,
    renderListCardBody: PropTypes.func,
    renderListCardExtra: PropTypes.func,
    renderListCardFooter: PropTypes.func,
    onCardClick: PropTypes.func,
  }
  static defaultProps = {
    loading: true,
    refreshing: true,
    firstLoading: true,
    hasMore: true,
    dataSource: {},
    onEndReached: () => void 0,
    onRefresh: () => void 0,
    renderListCardHeader: () => null,
    renderListCardBody: () => null,
    renderListCardExtra: () => null,
    renderListCardFooter: () => null,
    onCardClick: () => null
  }
  handleEndReached = () => {
    this.props.onEndReached && this.props.onEndReached();
  }
  handleRefresh = () => {
    this.props.onRefresh && this.props.onRefresh();
  }
  __renderItem = (item, sectionID, rowID) => {
    return <StandardCard item={item} key={rowID} {...this.props}/>
  }
  renderListFooter = () => {
    const { loading, hasMore } = this.props;
    return (
      <div style={{ padding: 4, paddingTop: 6, textAlign: 'center' }}>
        { loading? '加载中...' : ( hasMore ? '加载完成' : '没有更多了' ) }
      </div>
    )
  }
  render() {
    const { refreshing,firstLoading,dataSource  } = this.props;
    return (
      firstLoading ? 
      <ListFirstLoading/> :
      (dataSource && !dataSource.getRowCount()) ? 
      <Empty description='暂无信息'/> : 
      <ListView
        dataSource={dataSource}
        renderBodyComponent={() => <ListBody/>}
        renderFooter={this.renderListFooter}
        renderRow={this.__renderItem}
        onEndReachedThreshold={16}
        onEndReached={this.handleEndReached}
        useBodyScroll
        pullToRefresh={
          <PullToRefresh
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
          />
        }
      />
    )
  }
}

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