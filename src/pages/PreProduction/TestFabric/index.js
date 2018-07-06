import React, { Component } from 'react'
import { Row, Col, Input } from 'antd'
import {
  Tabs,
  InputNumber,
  Form,
  Collapse,
  Select,
  Icon,
  Steps,
  Button,
  DatePicker,
  message,
} from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

import TestFabricRelax from './relax'
import { combineAll } from 'rxjs/operator/combineAll'

const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel

const FORMAT_SHORT_DATE = 'MM/DD/YYYY'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'
const button_size = 'small'

const Step = Steps.Step

const steps = [
  { title: 'Xả Vải', content: <TestFabricRelax /> },
  { title: 'Kiểm Tra Độ Co Rút', content: 'Second-content' },
  { title: 'Kiểm Tra Trọng Lượng', content: 'Second-content' },
  { title: 'Kiểm Tra Hệ Thống 4 Điểm', content: 'Last-content' },
  { title: 'Phân Tách Nhóm Màu', content: 'Last-content' },
  { title: 'Tổng Kết', content: 'Last-content' },
]

class TestFabricListView extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 8 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
    }
    const tailFormItemLayout = {
      wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
    }

    const colums = []

    return (
      <div>
        <Collapse className="ant-advanced-search-panel-collapse">
          <Panel header="Search" key="1">
            <Form onSubmit={this.handleSearch}>
              <Row gutter={2}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                  style={{ marginTop: '0' }}
                >
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="Stk">
                    {getFieldDecorator('stk', {}, {})(<Input />)}
                  </FormItem>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                  style={{ textAlign: 'left' }}
                >
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="Type ">
                    {getFieldDecorator('fabrictype_name', {})(<Input />)}
                  </FormItem>
                </Col>

                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                  style={{ textAlign: 'left' }}
                >
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="Color ">
                    {getFieldDecorator('fabricolor_name', {})(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={2}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                  style={{ textAlign: 'left' }}
                >
                  <FormItem {...formItemLayout} label="From Import Date ">
                    {getFieldDecorator('from_date', {}, {})(
                      <DatePicker format={FORMAT_SHORT_DATE} style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                  style={{ textAlign: 'left' }}
                >
                  <FormItem {...formItemLayout} label="To Import Date ">
                    {getFieldDecorator('to_date', {}, {})(
                      <DatePicker format={FORMAT_SHORT_DATE} style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={2}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...tailFormItemLayout}>
                    <Button icon="search" size={button_size} type="primary" htmlType="submit">
                      Search
                    </Button>
                    <Button
                      icon="sync"
                      size={button_size}
                      style={{ marginLeft: 8 }}
                      onClick={this.handleReset}
                    >
                      Clean
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Panel>
        </Collapse>
      </div>
    )
  }
}

class TestFabricProcessView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
    }
  }
  next = () => {
    const current = this.state.current + 1
    this.setState({ current })
  }

  prev = () => {
    const current = this.state.current - 1
    this.setState({ current })
  }
  render() {
    const { current } = this.state
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
        </div>
      </div>
    )
  }
}

const TestFabricListViewWapper = Form.create()(TestFabricListView)

class TestFabric extends Component {
  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Management Import &amp Export" />
        <section className="card">
          <div className="card-body">
            <TestFabricListViewWapper />
          </div>
        </section>
      </Page>
    )
  }
}

export default TestFabric
