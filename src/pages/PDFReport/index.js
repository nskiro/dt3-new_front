import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import { Tabs } from 'antd'

const { TabPane } = Tabs

class PDFReportPage extends Component {
    static defaultProps = {
        pathName: 'PDF Report Management',
    }

    render() {
        const props = { ...this.props }
        return (
            <Page {...props}>
                <Helmet title="PDF Report Management" />
                <section className="card">
                    <div className="card-body">
                        <Tabs defaultActiveKey="1" size='small'>
                            <TabPane tab="Upload PDF" key="1">Form upload</TabPane>
                            <TabPane tab="Category Management" key="2">Form category</TabPane>
                        </Tabs>
                    </div>
                </section>
            </Page>
        )
    }
}

export default PDFReportPage
