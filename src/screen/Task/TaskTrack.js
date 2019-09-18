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
  Modal 
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


@connect(null, ({task, common}) => ({fetchTrackNode: task.fetchTrackNode, upload: common.upload}))
@createForm()
class NodeModal extends Component {
  state = { 
    nextNodeTypeId: []
  }
  componentDidMount() {
    this.props.form.validateFields();
  }
  handleNodeSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      if(errors) return;
      const nodeTypeId = values.nodeTypeId[0];
      const nextNodeTypeId = values.nextNodeTypeId && values.nextNodeTypeId[0];
      const nodeTime = moment(values.nodeTime).format('YYYY-MM-DD HH:mm:ss');
      const nextNodeTime = moment(values.nextNodeTime).format('YYYY-MM-DD HH:mm:ss');
      const attachment = [];
      const params = {
        ...values,
        nodeTypeId,
        nextNodeTypeId,
        nodeTime,
        nextNodeTime,
        attachment
      }
      this.props.onNodeSubmit && this.props.onNodeSubmit(params);
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
    })
  }
  render() {
    const { form:{getFieldProps,getFieldsError}, visible, onModalVisible, submiting, nodes } = this.props;
    return (
      <Modal
        visible={visible}
        popup
        animationType='slide-up'
        onClose={() => onModalVisible && onModalVisible()}
        className={styles.nodesModal}
      >
        <List renderHeader={() => '当前节点'}>
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
        </List>
        <List renderHeader={() => '下个节点'}>
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
            <List.Item arrow='horizontal'>节点类型</List.Item>
          </Picker>
          <DatePicker
            {
              ...getFieldProps('nextNodeTime')
            }
            title='节点时间'
            mode='datetime'
          >
            <List.Item arrow='horizontal'>节点时间</List.Item>
          </DatePicker>
        </List>
        <List renderHeader={() => '其他信息'}>
          <List.Item>
            <ImagePicker
              onImageClick={(index, fs) => console.log(index, fs)}
              onAddImageClick={(e) => console.log(e)}
              onChange={this.handleUploadChange}
              //selectable={files.length < 5}
              //accept="image/gif,image/jpeg,image/jpg,image/png"
            />
          </List.Item>
          <TextareaItem 
            {
              ...getFieldProps('remark')
            }
            placeholder='请输入...'
            title='备注'
            rows={2}
            count={100}
          />
        </List>
        <div className='p16'>
          <Button type='primary' onClick={this.handleNodeSubmit} disabled={hasError(getFieldsError()) || submiting} loading={submiting}>提交</Button>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = ({ task }) => {
  return {
    task,
    ...mapLoading('task',{
      fetchTaskTracking: 'fetchTaskTrack',
      fetchTrackNodeing: 'fetchTrackNode',
      editNodeing: 'editNode'
    })
  }
}

const mapDispatchToProps = ({ task }) => ({
  ...mapEffects(task, ['fetchTaskTrack', 'fetchTrackNode', 'editNode'])
});

@connect(mapStateToProps, mapDispatchToProps)
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
  componentDidMount() { 
    this.props.fetchTaskTrack({
      taskId: this.taskId
    });
    this.props.fetchTrackNode();
  }
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    })
  }
  hanndleNodeSubmit = params => {
    this.props.editNode({
      message: '节点添加成功',
      taskId: this.taskId,
      ...params
    },() => {
      this.setState({
        modalVisible: false
      });
      this.props.fetchTaskTrack({
        taskId: this.taskId
      });
    })
  }
  render(){
    // eslint-disable-next-line
    const { task: {recordList, nodes}, fetchTaskTracking, fetchTrackNodeing, history, editNodeing } = this.props;
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
                  <div style={{ ...style, zIndex: 10}}>
                    <Tabs.DefaultTabBar {...props}/>
                    <div className='pt16 pl16 pr16'>
                      <Button className={styles.addNodes} onClick={() => this.handleModalVisible(true)}>添加节点</Button>
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
                            <a href="">查看附件</a>
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
        <NodeModal visible={this.state.modalVisible} nodes={nodes} submiting={editNodeing} {...modalMethods}/>
      </Screen>
    )
  }
}

export default WharfSock;

