import React, { Component } from 'react';
import styles from './index.less';
import TimelineItem from './TimelineItem';

export default class Timeline extends Component {
  static Item = TimelineItem;
  render() {
    return (
      <div className={styles.timeline} {...this.props}>
        {this.props.children}
      </div>
    )
  }
}
