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

import axios from '../../../axiosInst' //'../../../../../axiosInst'

import moment from 'moment'
import _ from 'lodash'

import TestFabricRelax from './relax'
import TestFabricWeight from './weight'
import TestFabricColorShard from './colorshard'
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

const test_fabric_relax_save = '/api/testfabric/relax/save'

const test_fabric_weight_save = '/api/testfabric/weight/save'
const test_fabric_colorshard_save = '/api/testfabric/colorshard/save'
const test_fabric_fourpoint_save = '/api/testfabric/fourpoint/save'
const test_fabric_skew_save = '/api/testfabric/skew/save'

const fabric_import_updateprocess = 'api/fabric/import/updateprocess/'

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

  componentDidMount = () => {
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
        this.onUpdateProcess()
        // xa vai
        this.onSaveRelax()
        break
      case 1:
        //trong luong
        this.onSaveWeight()
        break
      case 2:
        // phan tach nhom mau
        this.onSaveColorShard()
        break
      case 3:
        // kiem tra 4 diem
        this.onSaveFourPoint()
        break
      case 4:
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
    axios
      .post(test_fabric_relax_save, data_detail)
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

  onSaveColorShard = () => {
    const { data_detail } = this.colorShardChild.state
    axios
      .post(test_fabric_colorshard_save, data_detail)
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

  onSaveSkew = () => {
    const { data_detail } = this.skewChild.state
    axios
      .post(test_fabric_skew_save, data_detail)
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

  onSaveWeight = () => {
    const { data_detail } = this.weightChild.state
    axios
      .post(test_fabric_weight_save, data_detail)
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

  onSaveFourPoint = () => {
    const { data_detail } = this.fourPointChild.state
    axios
      .post(test_fabric_fourpoint_save, data_detail)
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

  onUpdateProcess = () => {
    const { import_row_selected } = this.state
    if (_.isEmpty(import_row_selected)) {
      alert('Not import data selected. Please try again.!')
      return
    } else {
      let id = import_row_selected._id
      axios
        .post(fabric_import_updateprocess + `${id}`, {})
        .then(res => {
          let data = res.data
          if (!data.valid) {
            alert('update data failed. Error=> ' + data.message)
          } else {
            message.success('Process data starting!')
            const { show_detail } = this.state
            this.setState({ show_detail: !show_detail })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
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
      { key: 'declare_no', dataIndex: 'declare_no', title: 'STK', name: 'STK' },
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
    const TestFabricColorShardWapper = Form.create()(TestFabricColorShard)
    const TestFabricSkewWapper = Form.create()(TestFabricSkewShrinlege)
    const TestFabricFourPointWapper = Form.create()(TestFabricFourPoint)

    const steps = [
      {
        title: 'Xả Vải',
        content: (
          <TestFabricRelaxWapper
            data={this.state.import_row_selected_details}
            data_parent={this.state.import_row_selected}
            wrappedComponentRef={ref => (this.relaxChild = ref)}
          />
        ),
      },
      {
        title: 'Kiểm Tra Trọng Lượng',
        content: (
          <TestFabricWeightWapper
            data={this.state.import_row_selected_details}
            data_parent={this.state.import_row_selected}
            wrappedComponentRef={ref => (this.weightChild = ref)}
          />
        ),
      },
      {
        title: 'Phân Tách Nhóm Màu',
        content: (
          <TestFabricColorShardWapper
            data={this.state.import_row_selected_details}
            data_parent={this.state.import_row_selected}
            wrappedComponentRef={ref => (this.colorShardChild = ref)}
          />
        ),
      },
      {
        title: 'Kiểm Tra Hệ Thống 4 Điểm',
        content: (
          <TestFabricFourPointWapper
            data={this.state.import_row_selected_details}
            data_parent={this.state.import_row_selected}
            wrappedComponentRef={ref => (this.fourPointChild = ref)}
          />
        ),
      },
      {
        title: 'Kiểm Tra Độ Co Rút',
        content: (
          <TestFabricSkewWapper
            data={this.state.import_row_selected_details}
            data_parent={this.state.import_row_selected}
            wrappedComponentRef={ref => (this.skewChild = ref)}
          />
        ),
      },
      {
        title: 'Tổng kết',
        content: '',
      },
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
            {current > 0 && (
              <Button
                icon="caret-left"
                type="primary"
                style={{ marginTop: 5 }}
                onClick={() => this.prev()}
              >
                Previous
              </Button>
            )}
            {current < steps.length - 1 &&
              (current === 0 ? (
                <Button
                  icon="caret-right"
                  type="primary"
                  style={{ marginTop: 5 }}
                  onClick={() => this.next()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  icon="caret-right"
                  type="primary"
                  style={{ marginLeft: 8, marginTop: 5 }}
                  onClick={() => this.next()}
                >
                  Next
                </Button>
              ))}

            {current === steps.length - 1 && (
              <Button
                type="primary"
                style={{ marginLeft: 8, marginTop: 5 }}
                onClick={buttonDoneClick}
              >
                Done
              </Button>
            )}
          </div>
        </Row>
      </div>
    )
  }
}

export default TestFabricProcessView
