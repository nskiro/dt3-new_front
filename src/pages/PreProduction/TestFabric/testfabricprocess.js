import React, { Component } from 'react'
import { Row, Col, Input } from 'antd'
import {
  InputNumber,
  Form,
  Collapse,
  Icon,
  Steps,
  Button,
  DatePicker,
  Select,
  Table,
  Divider,
  message,
} from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

import axios from '../../../axiosInst' //'../../../../../axiosInst'

import { formItemLayout, tailFormItemLayout } from '../../Common/FormStyle'
import TestFabricRelax from './relax'
import { combineAll } from 'rxjs/operator/combineAll'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel

const FORMAT_SHORT_DATE = 'MM/DD/YYYY'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'
const button_size = 'small'

const Step = Steps.Step

class TestFabricProcessView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      data: {},
      import_row_selected:{},
      import_row_selected_details:[]
    }
  }

  componentWillReceiveProps = nextprops => {
    console.log('TestFabricProcessView  recive props ' + JSON.stringify(nextprops))
  }

  componentDidMount = () => {//
    //load detail of stk
    // and send it to component of step
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

    const steps = [
      {
        title: 'Xả Vải',
        content: <TestFabricRelax data={this.state.import_row_selected_details} />,
      },
      { title: 'Kiểm Tra Độ Co Rút', content: 'Second-content' },
      { title: 'Kiểm Tra Trọng Lượng', content: 'Second-content' },
      { title: 'Kiểm Tra Hệ Thống 4 Điểm', content: 'Last-content' },
      { title: 'Phân Tách Nhóm Màu', content: 'Last-content' },
      { title: 'Tổng Kết', content: 'Last-content' },
    ]

    const columns = [
      {
        key: 'declare_date',
        dataIndex: 'declare_date',
        title: 'STK DATE',
        name: 'STK DATE',
        render: (text, row) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_SHORT_DATE)}</span>
        ),
      },
      { key: 'invoice_no', dataIndex: 'invoice_no', title: 'STK', name: 'STK' },
      {
        key: 'create_date',
        dataIndex: 'create_date',
        title: 'CREATE DATE',
        name: 'CREATE DATE',
        render: (text, row) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_LONG_DATE)}</span>
        ),
      },
      {
        key: 'record_status',
        dataIndex: 'record_status',
        title: 'STATUS',
        name: 'STATUS',
        render: (text, row, index) => {
          if (text === 'O') {
            return 'Chưa kiểm'
          }
          if (text === 'P') {
            return 'Đang kiểm'
          }
          if (text === 'Q') {
            return 'Đã kiểm xong'
          }
          return 'Không xác định'
        },
      },
    ]

    return (
      <div>
        <Row>
          <Table
            rowKey={'_id'}
            size="small"
            bordered
            style={{ marginTop: '5px' }}
            columns={columns}
            pagination={false}
            dataSource={[this.state.import_row_selected]}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? 'even-row' : 'old-row'
            }}
          />
        </Row>
        <Divider />
        <Row>

          <Steps size="small" current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="steps-content">{steps[this.state.current].content}</div>
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
        </Row>
      </div>
    )
  }
}

export default TestFabricProcessView
