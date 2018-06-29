import React, { Component } from 'react'
import { Tabs, Form, Icon } from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

import '../views.css'

import WarehouseFabricProvider from './warehousefabricprovider'
import WarehouseFabricType from './warehousefabrictype'
import WarehouseFabricColor from './warehousefabriccolor'

const TabPane = Tabs.TabPane

const WrappedWarehouseFabricProvider = Form.create()(WarehouseFabricProvider)
const WrappedWarehouseFabricType = Form.create()(WarehouseFabricType)
const WrappedWarehouseFabricColor = Form.create()(WarehouseFabricColor)

const tab_size = 'small'
class ViewWarehouseCategory extends Component {
  static defaultProps = {
    pathName: 'Fabric Category',
  }
  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Management Category" />
        <section className="card">
          <div className="card-body">
            <Tabs defaultActiveKey="4">
              <TabPane tab={<span> <Icon type="select" />SUPPLIER </span>} size={tab_size} key="4"><WrappedWarehouseFabricProvider /></TabPane>
              <TabPane tab={<span><Icon type="wallet" />TYPE</span>} size={tab_size} key="5"><WrappedWarehouseFabricType /></TabPane>
              <TabPane tab={<span><Icon type="appstore" />COLOR</span>} size={tab_size} key="6"><WrappedWarehouseFabricColor /></TabPane>
            </Tabs>
          </div>
        </section>
      </Page>
    )
  }
}

export default ViewWarehouseCategory
