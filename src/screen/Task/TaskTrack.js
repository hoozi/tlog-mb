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
import { BaiduMap, Polyline, Marker } from 'react-baidu-maps';
import Timeline from '@/component/Timeline';
import Screen from '@/component/Screen';
import Empty from '@/component/Empty';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects, hasError } from '@/utils';
import map from '@/style/map.module.less';
import form from '@/style/form.module.less';
import { FORM_ID } from '@/constants';
import Authorized from '@/hoc/Authorized';
import styles from './index.module.less';
import startTag from '@/assets/start.png';
import currentTag from '@/assets/current.png';

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

@connect(
  ({loading}) => (
    {
      uploading:loading.effects['common']['upload']
    }
  ),
  ({task, common}) => (
    {
      fetchTrackNode: task.fetchTrackNode, 
      upload: common.upload
    }
  )
)
class NodeModal extends Component {
  state = { 
    nextNodeTypeId: [],
    files:[]
  }
  reset() {
    this.setState({
      nextNodeTypeId: [],
      files: []
    });
    this.props.form.resetFields();
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
      this.reset();
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
    const file = files[files.length-1].file;
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
          <CenterLoading/> :
          <>
            <h2 className='popup-list-title'>添加节点</h2>
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
                  accept='image/jpeg,image/gif,image/png,application/msword,application/pdf,application/msexcel,application/mspowerpoint'
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
      editNodeing: 'editNode',
      fetchRouteing: 'fetchRoute'
    }),
    ...mapLoading('common', {
      bindFileing: 'bindFile',
      fetchUploadKeying: 'fetchUploadKey'
    })
  }
}

const mapDispatchToProps = ({ task, common }) => ({
  ...mapEffects(task, ['fetchTaskTrack', 'fetchTrackNode', 'editNode', 'fetchRoute']),
  ...mapEffects(common, ['bindFile', 'fetchUploadKey'])
});

@connect(mapStateToProps, mapDispatchToProps)
@createForm()
class TaskTrack extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location
    this.state = {
      center: {lng:121.721133,lat:30.605635},
      modalVisible: false,
      startPoint: {},
      endPoint: {}
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
    this.props.fetchRoute({}, data => {
      const endPoint = data.pop();
      const startPoint = data.shift();
      const { lon:lng, lat } = endPoint;
      this.setState({
        center: {lng, lat},
        endPoint: { lng: endPoint.lon, lat: endPoint.lat },
        startPoint: { lng: startPoint.lon, lat: startPoint.lat }
      });
    });
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
    this.props.history.push(`/attachments?id=${decodeURI(id)}`)
    /* this.props.bindFile({
      formId: FORM_ID,
      id,
      operateType: 'listAttachments',
      attachmentPanels: ['attachmentpanel']
    }) */
  }
  render(){
    // eslint-disable-next-line
    const { 
      task: {taskNodes, nodes, route}, 
      form, 
      fetchTaskTracking, 
      fetchUploadKeying, 
      fetchTrackNodeing, 
      history, 
      editNodeing,
      fetchRouteing, 
      bindFileing 
    } = this.props;
    const tracks = taskNodes.filter(item => item.nodeTypeName);
    const mainNodes = nodes.filter(item => item.keyNode === 'true');
    const polyline = route.length ? route.map(item => ({
      lng: item.lon,
      ...item
    })) : [{lng: 0, lat: 0}];
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
          <BaiduMap 
            mapContainer={<div style={{ height: '100%', width: '100%' }} />}
            zoom={7} 
            center={this.state.center}
            enableScrollWheelZoom
          >
            {
              fetchRouteing ?
              <CenterLoading className='center-loading' text='运行轨迹加载中...'/> :
              <>
                <Marker 
                  position={this.state.startPoint}
                  icon={{ imageUrl: startTag, size: { width: 32, height: 32 } }} 
                  offset={{width: -1, height: -17}}
                />
                {polyline.length && <Polyline path={polyline.filter(item => item.lng!=='0' && item.lat!=='0')} strokeWeight={5} strokeColor='#3c73f0' />}
                <Marker
                  position={this.state.endPoint}
                  icon={{ imageUrl: currentTag, size: { width: 32, height: 32 } }}
                  offset={{width: -1, height: -17}}
                />
              </>
            }
          </BaiduMap>
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
                    <Authorized authority='add_node'>
                      <div className='pt16 pl16 pr16'>
                        <Button size='small' className={styles.addNodes} onClick={() => this.handleModalVisible(true)}>添加节点</Button>
                      </div>
                    </Authorized>
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
                            <span className='text-primary' onClick={() => this.handleNodeAttachmentClick(item.id)}>查看附件</span>
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

export default TaskTrack;

