import React, { Component } from 'react';
import { 
  Icon, 
  Tabs, 
  Flex, 
  Button, 
  Grid, 
  List,
  DatePicker,
  Picker, 
  TextareaItem,
  ImagePicker,
  ActivityIndicator,
  Modal, 
  Toast
} from 'antd-mobile';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import { Sticky, StickyContainer } from 'react-sticky';
import moment from 'moment';
import { parse } from 'qs';
import HopeMap from '@/component/HopeMap';
import Timeline from '@/component/Timeline';
import Screen from '@/component/Screen';
import Empty from '@/component/Empty';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects, hasError } from '@/utils';
import map from '@/style/map.less';
import form from '@/style/form.less';
import { FORM_ID } from '@/constants'
import styles from './index.less';

const tabs = [
  {
    title: '全部节点'
  },
  {
    title: '主要节点'
  }
]

const CheckedItem = props => (
  <div className={styles.checkItem}>
    <Icon type={!props.checked ? 'check-circle-o' : 'check-circle'} size='xxs' color={props.checked ? '#6abf47' : ''}/>
    <span style={{color: props.checked ? '#6abf47' : ''}}>{props.name}</span>
  </div>
)

@connect((({loading}) => ({uploading:loading.effects['common']['upload']})), ({task, common}) => ({fetchTrackNode: task.fetchTrackNode, upload: common.upload}))
class NodeModal extends Component {
  state = { 
    nextNodeTypeId: [],
    files:[]
  }
  handleNodeSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      if(errors) return;
      const nodeTypeId = values.nodeTypeId[0];
      const nextNodeTypeId = values.nextNodeTypeId ? values.nextNodeTypeId[0] : '';
      const nodeTime = moment(values.nodeTime).format('YYYY-MM-DD HH:mm:ss');
      const nextNodeTime = values.nextNodeTime ? moment(values.nextNodeTime).format('YYYY-MM-DD HH:mm:ss') : '';
      const attachment = this.state.files.length > 0;
      const params = {
        ...values,
        nodeTypeId,
        nextNodeTypeId,
        nodeTime,
        nextNodeTime,
        attachment
      }
      this.props.onNodeSubmit && this.props.onNodeSubmit(params);
      this.setState({
        files: []
      });
      this.props.form.resetFields();
    })
  }
  handleNodeTypeChange = ids => {
    this.props.fetchTrackNode({
      crudType: 'selectById',
      id: ids[0]
    }, data=>{
      const { nextNode } = data;
      this.setState({
        nextNodeTypeId: [nextNode]
      })
    });
  }
  handleUploadChange = files => {
    const file = files[0].file;
    const fd = new FormData();
    fd.append('file', file);
    this.props.upload({
      file,
      fd
    }, () => {
      this.setState({
        files
      })
    })
  }
  render() {
    const { form:{getFieldProps,getFieldsError}, uploading, visible, onModalVisible, submiting, nodes, loading } = this.props;
    return (
      <Modal
        visible={visible}
        popup
        animationType='slide-up'
        onClose={() => onModalVisible && onModalVisible()}
        className={styles.nodesModal}
        afterClose={() => document.documentElement.style.overflow=''}
      >
        {
          loading ? 
          <ActivityIndicator/> :
          <>
            <h2 className={styles.addNodesTitle}>添加节点</h2>
            <List>
              <Picker
                {
                  ...getFieldProps('nodeTypeId', {
                    rules: [
                      { required: true, message: '请选择当前节点类型' }
                    ],
                    onChange: this.handleNodeTypeChange
                  })
                }
                cols={1}
                title='节点类型'
                data={nodes.map(item=>({label: item.name, value: item.id}))}
              >
                <List.Item arrow='horizontal'><span className={form.required}>*</span>节点类型</List.Item>
              </Picker>
              <DatePicker
                {
                  ...getFieldProps('nodeTime', {
                    initialValue: new Date(),
                    rules: [
                      { required: true, message: '请选择当前节点时间' }
                    ]
                  })
                }
                title='节点时间'
                mode='datetime'
              >
                <List.Item arrow='horizontal'><span className={form.required}>*</span>节点时间</List.Item>
              </DatePicker>
              <Picker
                {
                  ...getFieldProps('nextNodeTypeId', {
                    initialValue: this.state.nextNodeTypeId
                  })
                }
                cols={1}
                title='节点类型'
                data={nodes.map(item=>({label: item.name, value: item.id}))}
              >
                <List.Item arrow='horizontal'>下个节点类型</List.Item>
              </Picker>
              <DatePicker
                {
                  ...getFieldProps('nextNodeTime')
                }
                title='节点时间'
                mode='datetime'
              >
                <List.Item arrow='horizontal'>下个节点时间</List.Item>
              </DatePicker>
            </List>
            <List renderHeader={() => uploading ? <ActivityIndicator text='附件上传中...'/> : '其他信息'} className={styles.extraInfo}>
              <List.Item>
                <ImagePicker
                  length={4}
                  files={this.state.files}
                  onImageClick={(index, fs) => console.log(index, fs)}
                  onAddImageClick={(e) => console.log(e)}
                  onChange={this.handleUploadChange}
                  disableDelete
                  selectable={this.state.files.length < 4}
                  accept=''
                /> 
              </List.Item>
              <TextareaItem 
                {
                  ...getFieldProps('remark')
                }
                placeholder='请输入...'
                title='节点备注'
                rows={2}
                count={100}
              />
            </List>
            <div className='p16'>
              <Button type='primary' onClick={this.handleNodeSubmit} disabled={hasError(getFieldsError()) || submiting} loading={submiting}>提交</Button>
            </div>
          </>
        }
        
      </Modal>
    )
  }
}

const mapStateToProps = ({ task, common }) => {
  return {
    common,
    task,
    ...mapLoading('task',{
      fetchTaskTracking: 'fetchTaskTrack',
      fetchTrackNodeing: 'fetchTrackNode',
      fetchUploadKeying: 'fetchUploadKey',
      editNodeing: 'editNode'
    }),
    ...mapLoading('common', {
      bindFileing: 'bindFile'
    })
  }
}

const mapDispatchToProps = ({ task, common }) => ({
  ...mapEffects(task, ['fetchTaskTrack', 'fetchTrackNode', 'editNode']),
  ...mapEffects(common, ['bindFile', 'fetchUploadKey'])
});

@connect(mapStateToProps, mapDispatchToProps)
@createForm()
class WharfSock extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location
    this.state = {
      center: [121.84922218322755, 30.673635005950928],
      modalVisible: false
    }
    this.taskId = parse(search.substring(1))['id'];
  }
  getTaskTrack() {
    this.props.fetchTaskTrack({
      taskId: this.taskId
    });
  }
  closeModalAndRefreshList() {
    this.setState({
      modalVisible: false
    });
    this.getTaskTrack();
  }
  componentDidMount() { 
    this.getTaskTrack();
    this.props.fetchTrackNode();
  }
  handleModalVisible = flag => {
    if(flag) {
      document.documentElement.style.overflow='hidden';
      this.props.fetchUploadKey({formId: FORM_ID});
      this.props.form.validateFields();
    }
    this.setState({
      modalVisible: !!flag
    })
  }

  hanndleNodeSubmit = params => {
    const { common:{uploadKey} } = this.props
    const { attachment, ...restParams } = params;
    this.props.editNode({
      message: '节点添加成功',
      taskId: this.taskId,
      id: uploadKey,
      ...restParams
    },() => {
      if(attachment) {
        Toast.loading('正在绑定附件...');
        this.props.bindFile({formId: FORM_ID,id: uploadKey}, () => {
          Toast.success('附件绑定成功', 2, () => {
            this.closeModalAndRefreshList();
          });
        })
      } else {
        this.closeModalAndRefreshList();
      }
    })
  }
  handleNodeAttachmentClick = id => {
    this.props.history.push(`/attachments?id=${id}`)
    /* this.props.bindFile({
      formId: FORM_ID,
      id,
      operateType: 'listAttachments',
      attachmentPanels: ['attachmentpanel']
    }) */
  }
  render(){
    // eslint-disable-next-line
    const { task: {recordList, nodes}, form, fetchTaskTracking, fetchUploadKeying, fetchTrackNodeing, history, editNodeing, bindFileing } = this.props;
    const tracks = recordList.filter(item => item.nodeTypeName);
    const mainNodes = nodes.filter(item => item.keyNode === 'true');
    const checked = item => {
      return tracks.some(el => {
        return el.nodeTypeId === item.id
      })
    }
    const modalMethods = {
      onModalVisible: this.handleModalVisible,
      onNodeSubmit: this.hanndleNodeSubmit
    }
    return (
      <Screen className={styles.trackScreen}>
        <div className={map.mapHeader}>
          <div className={map.mapHeaderInner}>
            <div className={map.backButton} onClick={e => history.goBack()}>
              <Icon type='left' size='f'/>
            </div>
          </div>
        </div>
        <div className={styles.routeMap}>
          <HopeMap 
            ak='uiwBRkB8kW2v3VHmG1GrIywNV+Cpw4KHrit+JO2B9TM=' 
            center={this.state.center}
            level={1}
            services={[
              { type: 'WMTS', url: 'http://169.169.213.123:9002/map/1947247294712/MapServer' },
              { type: 'WMTS', url: 'http://169.169.213.123:9002/map/1947246562936/MapServer' }        
            ]}
          >
          </HopeMap>
        </div>
        <StickyContainer className={styles.nodeContainer}>
          {
            fetchTaskTracking && fetchTrackNodeing ?
            <CenterLoading/> :
            <Tabs tabs={tabs} renderTabBar={props => (
              <Sticky topOffset={200}>
                {({ style }) => (
                  <div style={{ ...style, zIndex: 10, backgroundColor: '#fff'}}>
                    <Tabs.DefaultTabBar {...props}/>
                    <div className='pt16 pl16 pr16'>
                      <Button size='small' className={styles.addNodes} onClick={() => this.handleModalVisible(true)}>添加节点</Button>
                    </div>
                  </div>
                )}
              </Sticky>
            )}>
              <div className={styles.nodeTabPanel}>
                { 
                  tracks.length ? 
                  <Timeline className={styles.timeline}>
                    {
                      tracks.map((item, index) => (
                        <Timeline.Item 
                          key={item.id}  
                          color={index === 0 ? 'green' : ''}
                          last={index === tracks.length-1}
                          className={index!==0 ? styles.textGray : ''}
                          time={item.nodeTime}
                        >
                          <Flex className='mb6' style={{color: index === 0 ? '#6abf47' : ''}} justify='between'>
                            <b>{item.nodeTypeName}</b>
                            <a href='javascript:;' onClick={() => this.handleNodeAttachmentClick(item.id)}>查看附件</a>
                          </Flex>
                          <p>{item.remark}</p>
                          {
                            item.nextNodeTypeName ? 
                            <p style={{color: index === 0 && '#666'}}>预计{item.nextNodeTime}【{item.nextNodeTypeName}】</p> : 
                            null
                          }
                        </Timeline.Item>
                      ))
                    }
                  </Timeline> : 
                  <Empty/>
                }
              </div>
              <div className={`${styles.nodeTabPanel} p16`}>
                {
                  mainNodes.length ?
                  <Grid 
                    data={mainNodes} 
                    columnNum={3} 
                    hasLine={false} 
                    square={false}
                    renderItem={el => <CheckedItem checked={checked(el)} name={el.name}/>}
                  /> :
                  <Empty/>
                }
              </div>
            </Tabs>
          }
        </StickyContainer>
        <NodeModal 
          visible={this.state.modalVisible} 
          nodes={nodes} 
          submiting={editNodeing || bindFileing} 
          loading={fetchUploadKeying} 
          {...modalMethods}
          form={form}
        />
      </Screen>
    )
  }
}

export default WharfSock;

