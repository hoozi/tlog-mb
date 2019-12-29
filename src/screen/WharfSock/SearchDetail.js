import React, { PureComponent } from 'react';
import { NavBar, Icon, List, Badge} from 'antd-mobile';
import { connect } from 'react-redux';
import { parse } from 'qs';
import Screen from '@/component/Screen';
import { mapEffects, mapLoading } from '@/utils';
import list from '@/style/list.module.less';
import styles from './index.module.less';
import CenterLoading from '@/component/CenterLoading';
import Empty from '@/component/Empty';

const mapStateToProps = ({ sock }) => {
  return {
    ...sock,
    ...mapLoading('sock',{
      fetchSockDetailing: 'fetchSockDetail'
    })
  }
}

const mapDispatchToProps = ({ sock }) => ({
  ...mapEffects(sock, ['fetchSockDetail'])
});


@connect(mapStateToProps, mapDispatchToProps)
class SearchDetail extends PureComponent {
  constructor(props) {
    super(props);
    const { history } = this.props;
    const { location: {search} } = history;
    this.query = parse(search.substring(1));
  }
  componentDidMount() {
    this.props.fetchSockDetail(this.query);
  }
  
  /* renderListCard = item => (
    <div className={styles.sockItem}>
      <Flex className={styles.sockItemContainer} justify='between'>
        <div className={styles.sockItemContent}>
          <div>{item.terminalName}</div>
          <div className='mt8'>
            <Badge text={item.customerName} style={{ padding: '0 3px', backgroundColor: '#21b68a', borderRadius: 2 }} />
          </div>
        </div>
        <div className={styles.sockItemExtra}>
          <div>
            <div>{item.cargoName}</div>
            <div className='mt8 text-primary'>{item.cargoQuantity}吨</div>
          </div>
        </div>
      </Flex>
    </div>
  ) */
  
  render() {
    const { history, fetchSockDetailing, sockDetail } = this.props;
    return (
      <Screen
        className={list.listScreen}
        fixed
        zIndex={11}
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            码头库存详情
          </NavBar>
        )}
      >
        {
          fetchSockDetailing ? 
          <CenterLoading/> : 
          sockDetail.length ? 
          <List>
            {
              sockDetail.map(item => (
                  <List.Item key={item.voyage} extra={
                    <>
                      <div>{item.cargoName}</div>
                      <div className='text-primary'>{item.cargoQuantity}吨</div>
                    </>
                  }>
                    {item.terminalName} | {item.customerName}
                    <List.Item.Brief>
                      <Badge text={item.vesselCname} style={{ backgroundColor: '#21b68a', borderRadius: 2 }} />
                      <Badge text={item.vesselEname+'/'+item.voyage} style={{marginLeft: 8, backgroundColor: '#3c73f0', borderRadius: 2 }} />
                      <Badge text={item.storagePeriod+'天'} style={{ 
                        marginLeft: 8,
                        backgroundColor: '#fff', 
                        borderRadius: 2,
                        color: '#3c73f0',
                        border: '1px solid #3c73f0', 
                      }} />
                    </List.Item.Brief>
                  </List.Item>
                )
              )
            }
          </List> :
          <Empty/>
        }
      </Screen>
    )
  }
}

export default SearchDetail;