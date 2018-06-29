
import React, { Component } from 'react'
import { Tabs, Form, Icon } from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

//css
import '../views.css'
//import { constants } from 'zlib';

import WarehouseImport from './warehouseimport'
import WarehouseExport from './warehouseexport'

const TabPane = Tabs.TabPane

const WrappedWarehouseExport = Form.create()(WarehouseExport)
const WrappedWarehouseImport = Form.create()(WarehouseImport)


const tab_size = 'small'
class ViewWarehouseInOut extends Component {
    static defaultProps = {
        pathName: 'Fabric Warehouse Import &amp Export',
    }
    render() {
        const props = this.props
        return (
            <Page {...props}>
                <Helmet title="Management Import &amp Export" />
                <section className="card">
                    <div className="card-body">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span> <Icon type="arrow-down" />IMPORT</span>} size={tab_size} key="1" ><WrappedWarehouseImport /></TabPane>
                            <TabPane tab={<span> <Icon type="arrow-up" />EXPORT </span>} size={tab_size} key="2" ><WrappedWarehouseExport /></TabPane>
                        </Tabs>
                    </div>
                </section>
            </Page>
        )
    }
}

export default ViewWarehouseInOut
