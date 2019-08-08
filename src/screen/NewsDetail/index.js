import React, { Component } from 'react';
import { parse } from 'qs';
import { NavBar, Icon, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import Screen from '@/component/Screen';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.less';

const typeMap = {
  "X": "公司新闻",
  "G": "通知公告", 
  "Z": "行业资讯"
}

const mapStateToProps = ({ any }) => {
  return {
    ...any,
    ...mapLoading('any',{
      fetchNewsing: 'fetchNews'
    })
  }
}

const mapDispatchToProps = ({ any }) => ({
  ...mapEffects(any, ['fetchNews'])
});

const NewsContent = props => {
  const { data } = props
  if(!data) return null;
  document.documentElement.scrollTop = 0;
  return (
    <div className={styles.newsContainer}>
      <h2 className={styles.newsTitle}>{data.title}</h2>
      <div className={styles.newsExtra}>
        <span>{data.createUserName}</span>
        <span className={styles.newsType}>{typeMap[data.type]}</span>
        <span>{data.createDate}</span>
      </div>
      <div className={styles.newsContent} dangerouslySetInnerHTML={{__html: data.details}}></div>
    </div>
  )
}

@connect(mapStateToProps, mapDispatchToProps)
class NewsDetail extends Component {
  constructor(props) {
    super(props);
    document.documentElement.scrollTop = 0;
  }
  shouldComponentUpdate(nextProp) {
    return nextProp.fetchNewsing !== this.props.fetchNewsing;
  }
  componentDidMount() {
    const { location } = this.props;
    const id = parse(location.search.substring(1))['id'];
    this.props.fetchNews({
      crudType:'selectById',
      id
    });
  }
  render() {
    const { history, news } = this.props;
    return (
      <Screen
        className={styles.newsScreen}
        fixed
        header={() => {
          return (
            <NavBar   
              mode='dark'
              icon={<Icon type='left' size='lg'/>}
              onLeftClick={() => history.goBack()}
            >
              新闻详情
            </NavBar>
          )
        }}
      >
        <ActivityIndicator
          toast
          text='加载中...'
          animating={this.props.fetchNewsing}
        />
        {
          this.props.fetchNewsing ? 
          null :
          <NewsContent data={news[0]}/>
        }
      </Screen>
    )
  }
}

export default NewsDetail;