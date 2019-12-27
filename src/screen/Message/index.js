import React, { PureComponent } from 'react';
import { NavBar, List, Badge } from 'antd-mobile';
import LoginCheckArea from '@/hoc/LoginCheckArea';
import { connect } from 'react-redux';
import { mapEffects, mapLoading } from '@/utils';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import Empty from '@/component/Empty';
import { getToken } from '@/utils/token';
import styles from './index.module.less';

const mapStateToProps = ({ message }) => {
  return {
    message,
    ...mapLoading('message',{
      fetchMessageing: 'fetchMessage'
    })
  }
}

const mapDispatchToProps = ({ message }) => ({
  ...mapEffects(message, ['fetchMessage'])
});


@connect(mapStateToProps, mapDispatchToProps)
class Message extends PureComponent {
  componentDidMount() {
    getToken() && this.props.fetchMessage();
  }
  render() {
    const { message:{messages}, fetchMessageing } = this.props
    return (
      <Screen
        className={styles.messageScreen}
        header={() =>(
          <NavBar   
            mode='dark'
          >
            消息
          </NavBar>
        )}
      >
        <LoginCheckArea>
          {
            fetchMessageing ? 
            <CenterLoading text='消息加载中...'/> :
            messages.length > 0 ? 
            <List>
              {
                messages.map(item => {
                  const { title, message: {text} } = item;
                  return <List.Item multipleLine wrap>{text}<List.Item.Brief><Badge text={title} style={{ padding: '0 3px', backgroundColor: '#21b68a', borderRadius: 2 }} /></List.Item.Brief></List.Item>
                })
              }
            </List> :
            <Empty/>
          }
        </LoginCheckArea>
      </Screen>
    )
  }
}

export default Message;