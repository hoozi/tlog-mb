import React, { Component } from 'react';
import { parse } from 'qs';
import { NavBar, Icon } from 'antd-mobile';
import { connect } from 'react-redux';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import Empty from '@/component/Empty';
import { mapEffects, mapLoading } from '@/utils';
import styles from './index.less';

const typeMap = {
  "X": "公司新闻",
  "G": "通知公告", 
  "Z": "行业资讯"
}

const mapStateToProps = ({ news }) => {
  return {
    ...news,
    ...mapLoading('news',{
      fetchNewsing: 'fetchNews'
    })
  }
}

const mapDispatchToProps = ({ news }) => ({
  ...mapEffects(news, ['fetchNews'])
});

const NewsContent = props => {
  const { data } = props
  if(!data) return <Empty/>;
  return (
    <div className={styles.newsContainer}>
      <h2 className={styles.newsTitle}>{data.title}</h2>
      <div className={styles.newsExtra}>
        <span><Icon type='yonghu' size='xxs'/>{data.createUserName}</span>
        <span className={styles.newsType}><Icon type='leixing' size='xxs'/>{typeMap[data.type]}</span>
        <span><Icon type='shijian' size='xxs'/>{data.createDate}</span>
      </div>
      <div className={styles.newsContent} dangerouslySetInnerHTML={{__html: data.details}}></div>
    </div>
  )
}

@connect(mapStateToProps, mapDispatchToProps)
class NewsDetail extends Component {
  constructor(props) {
    super(props);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
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
    const { history, detail } = this.props;
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
        {
          this.props.fetchNewsing ? 
          <CenterLoading/> :
          <NewsContent data={detail}/>
        }
      </Screen>
    )
  }
}

export default NewsDetail;