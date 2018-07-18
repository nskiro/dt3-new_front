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
import { combineAll } from 'rxjs/operator/combineAll'
import moment from 'moment'
import _ from 'lodash'

import TestFabricRelax from './relax'
import TestFabricWeight from './weight'

import TestFabricSkewShrinlege from './skewshrinlege'
import TestFabricFourPoint from './fourpoints'

const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel

const FORMAT_SHORT_DATE = 'MM/DD/YYYY'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'
const button_size = 'small'

const Step = Steps.Step

const fabric_import_getdetail_link = 'api/fabric/import/getdetails'

const test_fabric_relax_get_add = '/api/testfabric/relax/add'
const test_fabric_relax_get_update = '/api/testfabric/relax/update'

const test_fabric_weight_get = '/api/testfabric/weight/get'
const test_fabric_weight_add = '/api/testfabric/weight/add'
const test_fabric_weight_update = '/api/testfabric/weight/update'

class TestFabricProcessView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      import_row_selected: {},
      import_row_selected_details: [],
    }
  }
  static getDerivedStateFromProps = (nextProps, state) => {
    // console.log('getDerivedStateFromProps call')
    let nextState = { ...state }
    nextState.import_row_selected = nextProps.data
    return nextState
  }

  /*
  shouldComponentUpdate = (nextProps, nextState) => {
   // console.log('shouldComponentUpdate =>')
    //console.log('nextState.import_row_selected =>' + JSON.stringify(nextState.import_row_selected))
   // console.log('this.state.import_row_selected =>' + JSON.stringify(this.state.import_row_selected))
    if (nextState.import_row_selected !== this.state.import_row_selected) {
        console.log('reload page')
      return true
    }
    return false
  }
*/
  componentDidMount = () => {
    //console.log('componentDidMount call')
    this.load_fabric_detail()
  }

  load_fabric_detail = () => {
    const { import_row_selected } = this.state

    let cond = { importid: import_row_selected._id, record_status: 'O' }
    if (!_.isEmpty(import_row_selected)) {
      axios
        .get(fabric_import_getdetail_link, { params: cond })
        .then(res => {
          if (res.data.valid) {
            this.setState({ import_row_selected_details: res.data.data })
          } else {
            this.setState({ import_row_selected_details: [] })
          }
        })
        .catch(err => {
          console.log(err)
          this.setState({ fabrictype_data: [] })
        })
    }
  }

  next = () => {
    switch (this.state.current) {
      case 0:
        // xa vai
        this.onSaveRelax()
        break
      case 1:
        //co rut
        this.onSaveWeight()
        break
      case 2:
        // trong luong
        this.onSaveSkew()
        break
      default:
        break
    }

    const current = this.state.current + 1
    this.setState({ current })
  }
  onSaveRelax = () => {
    const { data_detail, isUpdate } = this.relaxChild.state

    /*if (isUpdate) {
      axios.post(test_fabric_relax_get_update, data_detail).then(res => {
        let rs = res.data
        if (!rs.valid) {
          alert('Error ' + rs.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    } else {
      axios.post(test_fabric_relax_get_add, data_detail).then(res => {
        let rs = res.data
        if (!rs.valid) {
          alert('Error ' + rs.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    }*/
  }

  onSaveSkew = () => {}

  onSaveWeight = () => {
    const { data_detail, isUpdate } = this.weightChild.state
    axios
      .post(test_fabric_weight_add, data_detail)
      .then(res => {
        let rs = res.data
        if (!rs.valid) {
          alert('Error ' + rs.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  prev = () => {
    const current = this.state.current - 1
    this.setState({ current })
  }

  render() {
    const { current } = this.state

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
    const TestFabricRelaxWapper = Form.create()(TestFabricRelax)
    const TestFabricWeightWapper = Form.create()(TestFabricWeight)
    const TestFabricSkewWapper = Form.create()(TestFabricSkewShrinlege)
    const TestFabricFourPointWapper = Form.create()(TestFabricFourPoint)

    const steps = [
      {
        title: 'Xả Vải',
        content: (
          <TestFabricRelaxWapper
            data={this.state.import_row_selected_details}
            wrappedComponentRef={ref => (this.relaxChild = ref)}
          />
        ),
      },
      {
        title: 'Kiểm Tra Trọng Lượng',
        content: (
          <TestFabricWeightWapper
            data={this.state.import_row_selected_details}
            wrappedComponentRef={ref => (this.weightChild = ref)}
          />
        ),
      },
      {
        title: 'Kiểm Tra Độ Co Rút',
        content: (
          <TestFabricSkewWapper
            data={this.state.import_row_selected_details}
            wrappedComponentRef={ref => (this.skewChild = ref)}
          />
        ),
      },
      {
        title: 'Kiểm Tra Hệ Thống 4 Điểm',
        content: (
          <TestFabricFourPointWapper
            data={this.state.import_row_selected_details}
            wrappedComponentRef={ref => (this.fourPointChild = ref)}
          />
        ),
      },
      { title: 'Phân Tách Nhóm Màu', content: 'Last-content' },
      { title: 'Tổng Kết', content: 'Last-content' },
    ]

    const { buttonBackClick, buttonDoneClick } = this.props

    return (
      <div>
        <Row>
          <Col style={{ width: '150px' }}>
            <Button icon="left" style={{ backgroundColor: '#0190FE' }} onClick={buttonBackClick}>
              Back{' '}
            </Button>
          </Col>
        </Row>
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
