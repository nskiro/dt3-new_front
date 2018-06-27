import React, { Component } from 'react'
import { Tabs, Form, Icon } from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

//css
import './views.css'
//import { constants } from 'zlib';

import WarehouseImport from './warehouseimport'
import WarehouseExport from './warehouseexport'
import WarehouseFabricProvider from './warehousefabricprovider'
import WarehouseFabricType from './warehousefabrictype'
import WarehouseFabricColor from './warehousefabriccolor'
import WarehouseReport from './warehousereport'

const TabPane = Tabs.TabPane

const WrappedWarehouseExport = Form.create()(WarehouseExport)
const WrappedWarehouseImport = Form.create()(WarehouseImport)
const WrappedWarehouseReport = Form.create()(WarehouseReport)
const WrappedWarehouseFabricProvider = Form.create()(WarehouseFabricProvider)
const WrappedWarehouseFabricType = Form.create()(WarehouseFabricType)
const WrappedWarehouseFabricColor = Form.create()(WarehouseFabricColor)

const tab_size = 'small'
class ViewWarehouse extends Component {
  static defaultProps = {
    pathName: 'Fabric Warehouse',
    roles: ['Kế Toán'],
  }
  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Management Import &amp Export" />
        <section className="card">
          <div className="card-header">
            <h5 className="mb-0 mr-3 d-inline-block text-black">
              <strong>Import &amp; Export </strong>
            </h5>
          </div>
          <div className="card-body">
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <Icon type="arrow-down" />IMPORT
                  </span>
                }
                size={tab_size}
                key="1"
              >
                <WrappedWarehouseImport />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="arrow-up" />EXPORT
                  </span>
                }
                size={tab_size}
                key="2"
              >
                <WrappedWarehouseExport />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="table" />REPORT
                  </span>
                }
                size={tab_size}
                key="3"
              >
                <WrappedWarehouseReport />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="select" />SUPPLIER
                  </span>
                }
                size={tab_size}
                key="4"
              >
                <WrappedWarehouseFabricProvider />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="wallet" />TYPE
                  </span>
                }
                size={tab_size}
                key="5"
              >
                <WrappedWarehouseFabricType />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="appstore" />COLOR
                  </span>
                }
                size={tab_size}
                key="6"
              >
                <WrappedWarehouseFabricColor />
              </TabPane>
            </Tabs>
          </div>
        </section>
      </Page>
    )
  }
}

export default ViewWarehouse
