import React from 'react';
import Menu from '../menu';
import Tabbar from '../tabbar';
import Header from '../header';

class MasterProDefault extends React.Component {
  render() {
    const { AutoRouter } = this.props;
    const originMaster = [
      <Header key="c7n-pro-master-default-header" />,
      <div className="master-body" key="c7n-pro-master-default-body" >
        <div className="master-content-wrapper">
          <Menu />
          <div className="master-content-container">
            <div className="master-container">
              <Tabbar />
              <div className="master-content">
                <AutoRouter />
              </div>
            </div>
          </div>
        </div>
      </div>,
    ];
    return originMaster;
  }
}

export default MasterProDefault;
