import React, { Component } from 'react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Icon, Menu, Dropdown } from 'choerodon-ui';
import classNames from 'classnames';
import { getKeyAndTypeByLink, MENU_TYPE, getLinkByMenuType } from '../menu/util';
import './style';

@withRouter
@inject('MenuStore', 'AppState')
@observer
export default class Nav extends Component {
  handleLink(tab) {
    const { MenuStore, AppState: { isTabMode } } = this.props;
    const { selectedKeys } = MenuStore;
    const { code, route, pagePermissionType } = tab;

    if (selectedKeys.length && selectedKeys[0] === tab.code && isTabMode) return;
    
    const link = getLinkByMenuType(pagePermissionType, route, code);
    this.props.history.push(link);
    if (link === '/') {
      MenuStore.setActiveMenu({});
    }
  }

  handleCloseTab(tab, event) {
    const { MenuStore } = this.props;
    const { selectedKeys } = MenuStore;
    if (event) event.stopPropagation();
    if (selectedKeys.length && selectedKeys[0] === tab.code) {
      const desTab = MenuStore.getNextTab(tab);
      let desUrl;
      if (desTab.code !== 'HOME_PAGE') {
        const { code, route, pagePermissionType } = desTab;
        desUrl = getLinkByMenuType(pagePermissionType, route, code);
      } else {
        desUrl = '/';
        MenuStore.setActiveMenu({});
      }
      this.props.history.push(desUrl);
    }
    MenuStore.closeTabAndClearCacheByCacheKey(tab);
  }

  render() {
    const { location: { pathname }, MenuStore, AppState: { isTabMode } } = this.props;
    const { tabs, activeMenu, collapsed } = MenuStore;

    const isHome = pathname === '/';
    const htmlPlaceholder = '/iframe/';
    const activeIndex = tabs
      .findIndex(tab => pathname === (tab.pagePermissionType === MENU_TYPE.html ? `${htmlPlaceholder}${tab.code}` : `${tab.route}`));

    return (
      isTabMode ? null : (
        <Dropdown
          trigger={['click']}
          overlay={(
            <ul className="nav-wrapper">
              {
                tabs.filter(v => !!v).map((tab, i) => (
                  <li
                    key={tab.code}
                    className={classNames({
                      tab: true,
                      'tab-active': activeIndex === i,
                      'tab-hover': activeIndex !== i,
                      'tab-active-before': activeIndex >= 1 && i === activeIndex - 1,
                      'tab-active-after': activeIndex >= 0 && i === activeIndex + 1,
                    })}
                    onClick={this.handleLink.bind(this, tab)}
                  >
                    <div className="li-wrapper" style={{ positon: 'relative' }}>
                      <div
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {tab.name}
                      </div>
                      {
                        tab.code === 'HOME_PAGE' ? null : (
                          <Icon
                            type="close"
                            style={{ fontSize: 14, marginLeft: 20 }}
                            onClick={this.handleCloseTab.bind(this, tab)}
                          />
                        )
                      }
                    </div>
                  </li>
                ))}
            </ul>
          )}
        >
          <span className="header-nav-action">
            <span>页面导航</span>
            <Icon type="baseline-arrow_drop_down" />
          </span>
        </Dropdown>
      )
    );
  }
}
