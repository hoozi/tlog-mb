import React, { Component, forwardRef } from 'react';
import {
  NavBar,
  Icon,
  Drawer,
  DatePickerView,
  List,
  Radio
} from 'antd-mobile';
import moment from 'moment';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import Screen from '@/component/Screen';
import Empty from '@/component/Empty';
import CenterLoading from '@/component/CenterLoading';
import { mapLoading, mapEffects } from '@/utils';
import styles from './index.less';
import TideCard from './TideCard';

const RadioItem = Radio.RadioItem;

const regionData = [
  {
    value: undefined,
    label: '全部',
    key: 0
  },
  {
    value: 1,
    label: '镇海',
    key: 1
  },
  {
    value: 2,
    label: '北仑',
    key: 2
  },
  {
    value: 3,
    label: '宁波',
    key: 3
  },
  {
    value: 4,
    label: '穿山',
    key: 4
  },
  {
    value: 5,
    label: '虾峙',
    key: 5
  },
  {
    value: 6,
    label: '沈家门',
    key: 6
  },
  {
    value: 7,
    label: '定海',
    key: 7
  },
  {
    value: 8,
    label: '温州',
    key: 8
  },
  {
    value: 10,
    label: '黄大岙',
    key: 10
  }
];

const FilterButton = forwardRef(({onOpenFilter, date, tideRegion, active, ...restProps}, ref) => (
  <div className={styles.menuGroup} justify='around' {...restProps} ref={ref}>
    <div className={`${styles.menuDate} ${active === 'date' && styles.filterActive}`} onClick={() => onOpenFilter('date')}>
      <span className='mr8'>日期</span>
      <span>{moment(date).format('YYYY-MM-DD')}</span>
      <span className='down-arrow ml4'></span>
    </div>
    <div className={`${styles.menuArea} ${active === 'area' && styles.filterActive}`} onClick={() => onOpenFilter('area')}>
      <span className='mr8'>区域</span>
      <span>{tideRegion}</span>
      <span className='down-arrow ml4'></span>
    </div>
  </div>
))

const mapStateToProps = ({tide}) => ({
  tide,
  ...mapLoading('tide', {
    fetchTiding: 'fetchTide'
  })
});
const mapDispatchToProps = ({tide}) => mapEffects(tide, ['fetchTide'])

@connect(mapStateToProps, mapDispatchToProps)
class Tide extends Component {
  state = {
    date: new Date(),
    tideRegion: undefined,
    tideRegionName: '全部',
    open: false,
    type: 'date',
    active: '',
    top: 90
  }
  getTide(payload) {
    const { date, tideRegion } = this.state;
    this.props.fetchTide({
      date: moment(date).format('YYYY-MM-DD'),
      tideRegion,
      ...payload
    })
  }
  componentDidMount() {
    this.getTide();
    window.addEventListener('scroll', this.handleScroll, false);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
  }
  showDrawer = flag => {
    this.setState({
      open: !!flag,
      active: !flag && ''
    })
  }
  handleScroll = e => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    this.setState({
      top: scrollTop > 45 ? 48 : 90
    })
  }
  handleOpenFilter = type => {
    this.showDrawer(true)
    this.setState({
      type,
      active: type
    })
  }
  handleDateChange = date => {
    this.showDrawer();
    this.setState({
      date
    }, () => this.getTide());
  }
  handleOpenChange = () => {
    this.setState({
      open: !this.state.open,
      active: ''
    });
  }
  handleRegionChange = region => {
    const { label: tideRegionName, value: tideRegion } = region;
    this.showDrawer();
    this.setState({
      tideRegionName,
      tideRegion
    }, () => this.getTide())
  }
  render() {
    const { history, tide: {tides}, fetchTiding } = this.props;
    const { date, tideRegion, tideRegionName, open, type, active, top } = this.state;
    return (
      <Screen
        header={() =>(
          <NavBar   
            mode='dark'
            icon={<Icon type='left' size='lg'/>}
            onLeftClick={() => history.goBack()}
          >
            潮汐信息
          </NavBar>
        )}
      >
        <Drawer
          className={styles.selectDrawer}
          open={open}
          position='top'
          onOpenChange={this.handleOpenChange}
          style={open?{zIndex: 4}: {}}
          sidebar={
            <div style={{minHeight:128, marginTop: top, position: 'relative', backgroundColor: '#fff'}}>
              {
                type === 'date' ? 
                <DatePickerView 
                  className={styles.selectDate} 
                  mode='date' 
                  value={date}
                  onChange={this.handleDateChange}
                /> : 
                <List>
                  {
                    regionData.map(item => <RadioItem checked={tideRegion === item.value} key={item.key} onChange={() => this.handleRegionChange(item)}>{item.label}</RadioItem>)
                  }
                </List>
              }
            </div>
          }
        >
          <div></div>
        </Drawer>
        <StickyContainer>
          <Sticky>
            {
              ({style}) => (
                <FilterButton 
                  date={date} 
                  tideRegion={tideRegionName} 
                  onOpenFilter={this.handleOpenFilter}
                  active={active}
                  style={{...style, zIndex:5}}
                />
              )
            }
          </Sticky>
          
            {
              fetchTiding ? 
              <CenterLoading text='潮汐加载中...'/> :
              tides.length ? 
              tides.map(item => <TideCard key={item.tideRegion} data={item}/>) : 
              <Empty/>
            }
          
        </StickyContainer>
      </Screen>
    )
  }
}

export default Tide;
