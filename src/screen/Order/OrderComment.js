import React,{ PureComponent } from 'react';
import { NavBar, Icon, Flex, List, Toast, TextareaItem, Button } from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { createForm } from 'rc-form';
import { Sticky, StickyContainer } from 'react-sticky';
import Rate from 'rc-rate';
import 'rc-rate/assets/index.css';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import Empty from '@/component/Empty';
import Screen from '@/component/Screen';
import CenterLoading from '@/component/CenterLoading';
import { mapEffects, mapLoading, hasError } from '@/utils';
import styles from './index.less';
import form from '@/style/form.less';

const ListItem = List.Item;

const mapStateToProps = ({order}) => ({
  ...order,
  ...mapLoading('order',{
    commenting: 'comment'
  })
})

const mapDispatchToProps = ({order}) => mapEffects(order, ['comment'])

@connect(mapStateToProps,mapDispatchToProps)
@createForm()
class OrderComment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      loading: true,
      data: {}
    }
  }
  componentDidMount() {
    const { location:{search}, recordList } = this.props;
    const id = parse(search.substring(1))['id'];
    const data = find(recordList.map(item => ({...item})), item => item.id === id)
    this.setState({
      id,
      data,
      loading: false
    }, () => {
      this.props.form.validateFields();
    })
  }
  handleSubmit = () => {
    const { form: { validateFields, resetFields } } = this.props;
    validateFields((errors, values) => {
      if(errors) {
        Object.keys(errors).forEach(key => {
          return Toast.info(errors[key]['errors'][0].message)
        });
        return;
      } else {
        this.props.comment({
          ...values,
          orderId: this.state.id
        },() => {
          resetFields();
          this.props.history.goBack();
        })
      }
    })
  }
  render(){
    const { 
      form: { getFieldProps, getFieldsError },
      history, 
      commenting
    } = this.props;
    const { data, loading } = this.state;
    return (
      <Screen
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            订单评价
          </NavBar>
        )}
      >
        <StickyContainer>
          {
            loading ?
            <CenterLoading/> :
            !isEmpty(data) ? 
            <>
              <div className={styles.routeCard}>
                {/* <div style={{fontWeight:500, color: '#fff', textAlign: 'center'}}><span className={styles.tag}>编号</span>{data.orderNo}</div> */}
                <Sticky>
                  {
                    ({style}) => (
                      <div className={styles.routeName} style={{...style, zIndex: 20}}>
                        <Flex justify='between'> 
                          <span>
                            <b>{data.loadName}</b>
                            <i>装货地</i>
                          </span>
                          <span>
                            <b>{data.unloadName}</b>
                            <i>卸货地</i>
                          </span>
                        </Flex>
                      </div>
                    )
                  }
                </Sticky>
              </div>
              <div className={form.createForm}>
                <List>
                  <ListItem extra={
                    <Rate
                      {
                        ...getFieldProps('evaluationStar')
                      }
                    />
                  }>评分</ListItem>
                  <TextareaItem
                    {
                      ...getFieldProps('evaluationContent')
                    }
                    placeholder='说点什么...'
                    rows={5}
                    count={100}
                    className='needsclick'
                  />
                </List>
              </div>
              <div className={form.bottomButton}>
                <Button 
                  type='primary' 
                  onClick={this.handleSubmit}
                  disabled={commenting || hasError(getFieldsError())}
                  loading={commenting}
                >提交</Button>
              </div>
            </> :
            <Empty/>
          }
          
        </StickyContainer>
      </Screen>
    )
  }
}

export default OrderComment;