import React, { Component } from 'react';
import { NavBar, List, Icon } from 'antd-mobile';
import { parse } from 'qs';
import { connect } from 'react-redux';
import CenterLoading from '@/component/CenterLoading';
import Empty from '@/component/Empty';
import Screen from '@/component/Screen';
import { mapLoading, mapEffects } from '@/utils';
import { FORM_ID } from '@/constants';
import styles from './index.less';

const B2MB = 1024 * 1024;

const getFileTypeIcon = type => {
  let icon = <Icon type='unknown' size='lg'/>;
  const fileTypeIconMap = {
    'doc|docx|dot': <Icon type='w' size='lg'/>,
    'xlsx|xls': <Icon type='x' size='lg'/>,
    'pdf': <Icon type='pdf' size='lg'/>,
    'txt': <Icon type='txt' size='lg'/>,
    'jpg|png|gif|jpeg': <Icon type='pic' size='lg'/>,
    'zip|rar': <Icon type='zip' size='lg'/>,
    'ppt|pptx': <Icon type='ppt' size='lg'/>
  }
  Object.keys(fileTypeIconMap).forEach(key => {
    if(key.indexOf(type)!==-1) {
      icon = fileTypeIconMap[key];
    }
  });
  return icon;
}

const mapStateToProps = ({ common }) => ({
  common,
  ...mapLoading('common', {
    fetchAttachmenting: 'bindFile'
  })
})
const mapDispatchToProps = ({common}) => mapEffects(common, ['bindFile'])

@connect(mapStateToProps, mapDispatchToProps)
class Attachments extends Component {
  constructor(props) {
    super(props);
    const { location: {search} } = props;
    this.id = parse(search.substring(1))['id'];
    this.state = {
      data: []
    }
  }
  componentDidMount() {
    const id = this.id;
    this.props.bindFile({
      id,
      formId: FORM_ID,
      operateType: 'listAttachments',
      attachmentPanels: ['attachmentpanel']
    }, data => {
      const { attachmentpanel } = data;
      this.setState({
        ...this.state,
        data: attachmentpanel
      })
    })
  }
  render() {
    return (
      <Screen
        header={() => (
          <NavBar
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => this.props.history.goBack()}
          >
            附件列表
          </NavBar>
        )}
      >
        {
          this.props.fetchAttachmenting ? 
          <CenterLoading/> :
          this.state.data.length ?
          <List className={styles.fileList}>
            {
              this.state.data.map(item => (
                <List.Item thumb={getFileTypeIcon(item.type)} key={item.uid}>
                  <div>{item.name}</div>
                  <List.Item.Brief style={{fontSize: 12}}>{(item.size >= B2MB ? item.size/B2MB : item.size/1024).toFixed(1)}{item.size >= B2MB ? 'MB' : 'KB'}</List.Item.Brief>
                </List.Item>
              ))
            }
          </List> :
          <Empty/>
        }
      </Screen>
    )
  }
}

export default Attachments;
