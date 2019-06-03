import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { $l, axiosPro as axios } from '@choerodon/boot';
import { Popover, Avatar, Button, Menu, Dropdown } from 'choerodon-ui';

@withRouter
@inject('MenuStore', 'HeaderStore', 'AppState')
@observer
export default class RoleSelect extends Component {
  state = {
    res: {},
  };

  componentDidMount() {
    this.loadRoles();
  }

  loadRoles = () => {
    axios.get('/sys/user/roles')
      .then((res) => {
        this.setState({ res });
      });
  }

  handleChangeRole = ({ key }) => {
    axios.get(`/sys/role/change?roleId=${key}`)
      .then((res) => {
        if (res.success) {
          message.success($l('preference.submit.success'));
          window.location.reload();
        } else {
          message.error($l('preference.submit.failure'));
        }
      });
  }

  render() {
    const { res: { activeUserRoles, currentUserRoleId, roleMergeFlag } } = this.state;
    if (!currentUserRoleId && !activeUserRoles) {
      return null;
    }
    const currentUserRole = activeUserRoles.find(v => v.id === currentUserRoleId);
    const menu = (
      <Menu onClick={this.handleChangeRole}>
        {
          activeUserRoles.map(role => (
            <Menu.Item key={role.id} style={{ background: role.id === currentUserRoleId ? 'rgba(0, 0, 0, 0.08)' : '' }}>
              <a href={`/sys/role/change?roleId=${role.id}`}>{role.name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <span style={{ userSelect: 'none', userSelect: 'none', lineHeight: '32px', marginRight: 12, fontSize: '12px', cursor: 'pointer' }}>{currentUserRole.name}</span>
      </Dropdown>
    );
  }
}
