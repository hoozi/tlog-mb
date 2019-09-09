import React, { PureComponent } from 'react';
import { NavBar, Icon, ListView, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import Debounce from 'lodash-decorators/debounce';
import Screen from '@/component/Screen';
import { mapEffects, mapLoading } from '@/utils';
import StandardList from '@/component/StandardList';
import styles from './index.less';
import withCache from '@/hoc/withCache';
import emptyImg from '@/assets/nopic.svg';

const mapStateToProps = ({ news }) => {
  return {
    ...news,
    ...mapLoading('news',{
      fetchNewing: 'fetchNews'
    })
  }
}

const mapDispatchToProps = ({ news }) => ({
  ...mapEffects(news, ['fetchNews'])
});


@connect(mapStateToProps, mapDispatchToProps)
class News extends PureComponent {
  constructor(props) {
    super(props);
    const { getInstance } = props;
    getInstance(this);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.current = 1;
    this.data = [];
    this.ls = null;
    this.state = {
      loading: true,
      refreshing: true,
      firstLoading: true,
      needCache: {
        ds,
        hasMore: true,
        data: [],
        current: this.current
      }
    }
  }
  reset() {
    this.current = 1;
    this.data = [];
  }
  resetLoading() {
    
  }
  callback = data => {
    const { recordList, pageCount } = data;
    const ds = recordList.length > 0 ? recordList.map(item =>({...item})) : [];
    this.data = [...this.data, ...ds];
    const newState = {
      ...this.state,
      refreshing: false,
      loading: false,
      firstLoading: false,
      needCache: {
        ...this.state.needCache,
        hasMore: this.current !== pageCount,
        ds: this.state.needCache.ds.cloneWithRows(this.data),
        data: this.data
      }
    }
    this.setState(newState);
  }
  newsService(name, payload, callback) {
    const _callback = callback ? callback : () => null;
    this.props[name](payload, _callback)
  }
  componentDidMount() {
    const { needCache: {current} } = this.state;
    const { cache } = this.props;
    const hasCache = typeof cache !== 'undefined' && !isEmpty(cache);
    if(hasCache) {
      const { data, hasMore, current, scrollTop } = cache;
      this.current = current;
      this.data = data;
      this.setState({
        refreshing: false,
        loading: false,
        firstLoading: false,
        needCache: {
          ds:this.state.needCache.ds.cloneWithRows(this.data),
          hasMore,
          current
        }
      }, () => {
        this.ls.scrollTo(0, scrollTop);
      })
    } else {
      this.newsService('fetchNews', {current} , this.callback);
    }
  }
  handleRefresh = () => {
    this.reset();
    this.setState({
      refreshing: true,
      needCache: {
        ...this.state.needCache,
        current: this.current
      }
    });
    this.newsService('fetchNews', { current: 1 }, this.callback);
  }
  handleEndReached = () => {
    const { loading, needCache: {hasMore} } = this.state;
    if(loading || !hasMore) return;
    this.setState({ loading: true });
    this.newsService('fetchNews', { current: ++this.current }, data => {
      this.setState({
        ...this.state,
        needCache: {
          ...this.state.needCache,
          current: this.current
        }
      })
      
      this.callback(data);
    });
  }
  @Debounce(200)
  handleLsScroll = e => {
    const scrollTop = e.target.scrollTop;
    this.setState({
      needCache: {
        ...this.state.needCache,
        scrollTop
      }
    })
  }
  renderListCard = item => {
    const typeMap = {
      'X': '公司新闻',
      'G': '通知公告', 
      'Z': '行业资讯'
    }
    return (
      <Link to={`/news-detail?id=${item.id}`} className={styles.newsItem}>
        <Flex align='start' justify='between' direction='column' className={styles.newsItemContent}>
          <h3>{item.title.length > 32 ? item.title.substring(0,30) + '...' : item.title}</h3>
          <div className={styles.newsItemExtra}>
            <span><Icon type='shijian' size='xxs'/>{item.createDate.substring(0,10)}</span>
            <span><Icon type='leixing' size='xxs'/>{typeMap[item.type]}</span>
          </div>
        </Flex>
        <div className={styles.newsItemImg}><img src={item.img ? item.img : emptyImg} alt={item.title}/></div>
      </Link>
    )
  }
  render() {
    const { refreshing, firstLoading, loading, needCache:{ ds, hasMore } } = this.state;
    return (
      <Screen
        className={styles.newsScreen}
        header={() =>(
          <NavBar   
            mode='dark'
          >
            新闻资讯
          </NavBar>
        )}
      >
        <StandardList
          withRef={el => this.ls = el}
          dataSource={ds}
          onEndReached={this.handleEndReached}
          onRefresh={this.handleRefresh}
          loading={loading}
          useBodyScroll={false}
          refreshing={refreshing}
          firstLoading={firstLoading}
          contentContainerStyle={{minHeight: '100%'}}
          hasMore={hasMore}
          renderListCard = { this.renderListCard }
          onScroll={this.handleLsScroll}
        />
      </Screen>
    )
  }
}

export default withCache(News);