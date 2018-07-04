import React, { Component } from 'react'
import { Tabs, Form, Icon } from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

import WarehouseReportInvent from './warehousereportinvent'
import WarehouseReportExport from './warehousereportexport'
import WarehouseReportImport from './warehousereportimport'

const tab_size = 'small'
const TabPane = Tabs.TabPane

const WapperInventory = Form.create()(WarehouseReportInvent)
const WapperImports = Form.create()(WarehouseReportImport)
const WapperExports = Form.create()(WarehouseReportExport)

class ViewWarehouseReport extends Component {
  static defaultProps = {
    pathName: 'Fabric Warehouse Reportt',
  }
  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Management Warehouse Report" />
        <section className="card">
          <div className="card-body">
            <Tabs defaultActiveKey="1" size={tab_size}>
              <TabPane
                tab={
                  <span>
                    {' '}
                    <Icon type="arrow-down" />IMPORT
                  </span>
                }
                size={tab_size}
                key="1"
              >
                <WapperImports />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    {' '}
                    <Icon type="arrow-up" />EXPORT{' '}
                  </span>
                }
                size={tab_size}
                key="2"
              >
                <WapperExports />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    {' '}
                    <Icon type="table" />INVENTORY{' '}
                  </span>
                }
                size={tab_size}
                key="3"
              >
                {' '}
                <WapperInventory />
              </TabPane>
            </Tabs>
          </div>
        </section>
      </Page>
    )
  }
}

export default ViewWarehouseReport
