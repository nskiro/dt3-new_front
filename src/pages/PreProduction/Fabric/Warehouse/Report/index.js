
import React, { Component } from 'react'
import { Tabs, Form, Icon } from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

//css
import '../views.css'
//import { constants } from 'zlib';

import WarehouseReport from './warehousereport'

const TabPane = Tabs.TabPane
const WrappedWarehouseReport = Form.create()(WarehouseReport)


const tab_size = 'small'
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
                        <Tabs defaultActiveKey="3">
                            <TabPane tab={<span> <Icon type="table" />REPORT </span>} size={tab_size} key="3"> <WrappedWarehouseReport /></TabPane>
                        </Tabs>
                    </div>
                </section>
            </Page>
        )
    }
}

export default ViewWarehouseReport
