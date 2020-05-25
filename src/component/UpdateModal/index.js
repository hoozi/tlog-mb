/* eslint-disable */

import React, { PureComponent } from 'react';
import { Modal, Button, Progress, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
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

@connect(() => {}, ({common}) => ({
  checkUpgrade: common.checkUpgrade
}))
class UpdateModal extends PureComponent {
  state = {
    version: '0.0.0',
    label: 'v0',
    description: '',
    percent: 0,
    visible:false,
    startDownload: false
  }
  remotePackage = null;
  async getCurrentVersion() {
    const version = await cordova.getAppVersion.getVersionNumber();
    return version;
  }
  async componentDidMount() {
    /* codePush.notifyApplicationReady();
    codePush.checkForUpdate(this.handleUpdateChecked); */
    const currentPlatform = device.platform.toLocaleLowerCase();
    const currentVersion = await this.getCurrentVersion();
    this.props.checkUpgrade(data => {
      const { version, description } = data[currentPlatform];
      if(version > currentVersion) {
        this.setState({
          version,
          description,
          visible: true
        })
      }
    })
    
  }
  handleShowModal = flag => {
    this.setState({
      visible: !!flag
    });
  }
  render() {
    const { version, description, visible} = this.state;
    return (
      <Modal
        visible={visible}
        onClose={() => this.handleShowModal()}
        className={styles.updateModal}
        transparent
        wrapProps={{ onTouchStart: onWrapTouchStart }}
      >
        <div className={styles.updateModalHeader} style={{backgroundImage: `url(${updateBg})`}}>
          <h1>APP有更新</h1>
          <div className={styles.updateVersion}>v{version}</div>
        </div>
        <div className={styles.updateModalBody}>
          {
            description.split('\n').map((item, index)=><p key={index} style={{lineHeight:'21px'}}>{item}</p>)
          }
          <Button type='primary' className='mt24' onClick={() => {
            cordova.InAppBrowser.open('https://app.npedi.com/update/index.html?appid=qcwl', '_system')
          }}>去下载</Button>
        </div>
      </Modal>
    )
  }
  /* componentWillUnmount() {
    this.remotePackage = null;
  }
  handleUpdateChecked = remotePackage => {
    if(!remotePackage) return;
    const { appVersion: version, description = '', label  } = remotePackage;
    this.remotePackage = remotePackage;
    this.setState({
      version,
      label,
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
    Toast.loading('正在安装...', 0);
    localPackage.install(this.handleInstallSuccess, error => {
      Toast.hide();
      alert(error);
    }, { installMode: InstallMode.ON_NEXT_RESUME, mandatoryInstallMode: InstallMode.ON_NEXT_RESTART });
  }
  handleInstallSuccess = () => {
    Toast.hide();
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
   */
  
}

export default UpdateModal;