/* eslint-disable */

import React, { PureComponent } from 'react';
import { Modal, Button, Progress, Toast } from 'antd-mobile';
import styles from './index.module.less';
import updateBg from '@/assets/updatebg.png';

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

const onWrapTouchStart = (e) => {
  // fix touch to scroll background page on iOS
  if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    return;
  }
  const pNode = closest(e.target, '.am-modal-content');
  if (!pNode) {
    e.preventDefault();
  }
}

function onError(error) {
  console.log("An error occurred. " + error);
};

export default class UpdateModal extends PureComponent {
  state = {
    version: '0.0.0',
    description: '',
    percent: 0,
    visible:false,
    startDownload: false
  }
  remotePackage = null;
  componentDidMount() {
    codePush.notifyApplicationReady();
    codePush.checkForUpdate(this.handleUpdateChecked);
  }
  componentWillUnmount() {
    this.remotePackage = null;
  }
  handleUpdateChecked = remotePackage => {
    if(!remotePackage) return;
    const { appVersion: version, description = ''  } = remotePackage;
    this.remotePackage = remotePackage;
    this.setState({
      version,
      description,
      visible: true
    });
  }
  handlePackageDownloadStart = () => {
    if(!this.remotePackage) return;
    this.setState({
      startDownload: true
    }, () => {
      if (!this.remotePackage.failedInstall) {
        this.remotePackage.download(this.handlePackageDownloaded, () => Toast.fail('下载失败'), this.handleProgress);
      } else {
        Toast.fail('更新失败')
      }
    })
  }
  handlePackageDownloaded = localPackage => {
    this.handleShowModal();
    Toast.loading('正在安装...');
    localPackage.install(this.handleInstallSuccess, error => alert(error), { installMode: InstallMode.ON_NEXT_RESUME, mandatoryInstallMode: InstallMode.ON_NEXT_RESTART });
  }
  handleInstallSuccess = () => {
    Toast.success('安装成功,请重启APP');
  }
  handleProgress = downloadProgress => {
    const percent = parseInt(downloadProgress.receivedBytes / downloadProgress.totalBytes * 100, 10);
    this.setState({
      percent
    });
  }
  handleShowModal = flag => {
    this.setState({
      visible: !!flag
    });
  }
  render() {
    const { version, description, visible, startDownload, percent } = this.state;
    const percentPosition = percent/100*267-32;
    return (
      <Modal
        visible={visible}
        onClose={() => this.handleShowModal()}
        className={styles.updateModal}
        transparent
        maskClosable={!startDownload}
        wrapProps={{ onTouchStart: onWrapTouchStart }}
      >
        <div className={styles.updateModalHeader} style={{backgroundImage: `url(${updateBg})`}}>
          <h1>APP有更新</h1>
          <div className={styles.updateVersion}>v{version}</div>
        </div>
        <div className={styles.updateModalBody}>
          {
            startDownload ?
            <>
              <div style={{position: 'relative', bottom: 7, color: '#060606'}}>
                <span className={styles.percent} style={{left:`${percentPosition<0 ? 0 :percentPosition}px`}}>{percent}%</span>
              </div>
              <Progress
                percent={percent} 
                position='normal'
                style={{borderRadius: 100}}
                barStyle={{borderRadius: 100}}
              />
            </> :
            <>
              {
                description.split('\n').map((item, index)=><p key={index}>{item}</p>)
              }
              <Button type='primary' className='mt24' onClick={() => this.handlePackageDownloadStart(true)}>点击更新</Button>
            </>
          }
        </div>
      </Modal>
    )
  }
  
}