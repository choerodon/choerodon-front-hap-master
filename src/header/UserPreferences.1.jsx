import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Menu, Popover, Icon } from 'choerodon-ui';
import Avatar from './Avatar';
import axios from '@choerodon/boot/lib/containers/components/pro/axios';
import { authorize, logout } from '@choerodon/boot/lib/containers/common/authorize';
import defaultAvatarPath from './style/icons/avatar.png';

const PREFIX_CLS = 'c7n-pro';
const MenuItem = Menu.Item;
const prefixCls = `${PREFIX_CLS}-boot-header-user`;

@withRouter
@inject('AppState', 'MenuStore', 'HeaderStore')
@observer
export default class UserPreferences extends Component {
  componentDidMount() {
    const { history, MenuStore } = this.props;
    if (window.location.href.split('#')[1].split('&')[1] === 'token_type=bearer') {
      history.push('/');
    }
    MenuStore.loadMenuData({ type: 'site' }, true);
  }

  preferences = () => {
    const { MenuStore, history, HeaderStore } = this.props;
    MenuStore.loadMenuData({ type: 'site' }, true).then((menus) => {
      if (menus.length) {
        const { route, domain } = findFirstLeafMenu(menus[0]);
        historyPushMenu(history, `${route}?type=site`, domain);
      }
    });
    HeaderStore.setUserPreferenceVisible(false);
  };

  handleVisibleChange = (visible) => {
    this.props.HeaderStore.setUserPreferenceVisible(visible);
  };

  handleMenuItemClick = ({ key }) => {
    const { history } = this.props;
    history.push(`${key}?type=site`);
  };

  render() {
    const { AppState, HeaderStore, MenuStore } = this.props;
    const { imageUrl, loginName, realName, email } = AppState.getUserInfo || {};
    const realData = MenuStore.menuGroup && MenuStore.menuGroup.user.slice()[0] && MenuStore.menuGroup.user.slice()[0].subMenus.filter(item => !blackList.has(item.code));
    const AppBarIconRight = (
      <div className={`${prefixCls}-popover-content`}>
        <Avatar src={imageUrl} prefixCls={prefixCls} onClick={() => { window.location = '/#/iam/user-info?type=site'; }}>
          {realName && realName.charAt(0)}
        </Avatar>
        <div className={`${prefixCls}-popover-title`}>
          <span>{realName}</span>
          <span>{email}</span>
        </div>
        <div className={`${prefixCls}-popover-menu`}>
          <Menu selectedKeys={[-1]} onClick={this.handleMenuItemClick}>
            {realData && realData.map(item => (
              <MenuItem className={`${prefixCls}-popover-menu-item`} key={item.route}>
                <Icon type={item.icon} />
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <div className="divider" />
        <div className={`${prefixCls}-popover-logout`}>
          <li
            onClick={() => logout()}
          >
            <Icon type="exit_to_app" />
            {getMessage('退出登录', 'sign Out')}
          </li>
        </div>
      </div>
    );
    return (
      <Popover
        overlayClassName={`${prefixCls}-popover`}
        content={AppBarIconRight}
        trigger="click"
        visible={HeaderStore.userPreferenceVisible}
        placement="bottomRight"
        onVisibleChange={this.handleVisibleChange}
      >
        <Avatar src={imageUrl} prefixCls={prefixCls}>
          {realName && realName.charAt(0)}
        </Avatar>
      </Popover>
    );
  }
}
