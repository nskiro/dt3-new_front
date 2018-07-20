import React, { Component } from 'react'
import { Table, Button, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formItemLayout, tailFormItemLayout } from '../../../Common/FormStyle'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import _ from 'lodash'
import moment from 'moment'

const formatDate = require('../../../Common/formatdate')
const uuidv1 = require('uuid/v1')

const test_fabric_skew_get = '/api/testfabric/skew/get'

class TestFabricSkewShrinlege extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_received: [],
      data_detail: [],
      data_detail_id: [],
      loadtestfabricskew_done: false,
    }
  }

  static getDerivedStateFromProps = (nextProps, state) => {
    if (_.isEmpty(state.data_received)) {
      let data_detail_id = []
      _.forEach(nextProps.data, r => {
        data_detail_id.push(r._id)
      })
      let nextState = { ...state }
      nextState.data_received = nextProps.data
      nextState.data_detail_id = data_detail_id
      nextState.loadtestfabricskew_done = false
      return nextState
    }
    return null
  }

  componentDidMount = () => {
    let { data_received, data_detail_id } = this.state
    this.loadtestfabricskew(data_received, data_detail_id)
  }

  createDataNewRow = i => {
    return {
      detail_stt: i + 1,
      _id: uuidv1(),
      iron_lenght: 0,
      iron_width: 0,
      iron_skew: 0,

      washing_lenght: 0,
      washing_width: 0,
      washing_skew: '',

      isPass: '',
      remark: ''
    }
  }

  loadtestfabricskew = (data_received, data_detail_id) => {
    axios
      .get(test_fabric_skew_get, { params: { _ids: data_detail_id } })
      .then(res => {
        let data = res.data
        let new_data_detail = [...data_received]
        if (_.isEmpty(data.data)) {
          for (let i = 0; i < new_data_detail.length; i++) {
            let r = new_data_detail[i]
            r.test_no = 0
            r.fail_no = 0
            r.note = ''
            r.end_date = moment().format(formatDate.shortType)
            r.start_date = moment().format(formatDate.shortType)
            let details = []
            for (let j = 0; j < 5; j++) {
              details.push(this.createDataNewRow(j))
            }
            r.details = details
            new_data_detail[i] = r
          }
          this.setState({
            data_detail: new_data_detail,
            loadtestfabricweight_done: true,
            isUpdate: false,
          })
        } else {
          for (let i = 0; i < new_data_detail.length; i++) {
            const find_weight = _.find(data.data, { _id: new_data_detail[i]._id })
            new_data_detail[i].test_no = find_weight.test_no
            new_data_detail[i].fail_no = find_weight.fail_no
            new_data_detail[i].note = find_weight.note

            let details = [...find_weight.details]
            for (let j = 0; j < details.length; j++) {
              details[j].detail_stt = (j + 1)
            }
            new_data_detail[i].details = details
          }
          this.setState({
            data_detail: new_data_detail,
            loadtestfabricweight_done: true,
            isUpdate: true,
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_detail: [], loadtestfabricweight_done: true })
      })
  }

  onCellChange = (key, dataIndex) => {
    return value => {
      const data_detail = [...this.state.data_detail]
      const target = data_detail.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.setState({ data_detail })
      }
    }
  }

  onCellDetailChange = (dataIndex, row_index, fabricrelax_id) => {
    return value => {
      const data_detail = [...this.state.data_detail]
      const target = data_detail.find(item => item._id === fabricrelax_id)
      if (target) {
        target.details[row_index][dataIndex] = value
        this.setState({ data_detail })
      }
    }
  }

  render() {
    const columns = [
      { key: 'fabric_type', dataIndex: 'fabric_type', title: 'TYPE', name: 'TYPE' },
      { key: 'fabric_color', dataIndex: 'fabric_color', title: 'COLOR', name: 'COLOR' },
      { key: 'roll', dataIndex: 'roll', title: 'ROLL', name: 'ROLL' },
      { key: 'met', dataIndex: 'met', title: 'MET', name: 'MET' },
      {
        key: 'no_test',
        dataIndex: 'no_test',
        title: 'TEST #',
        name: 'TEST #',
        render: (text, record) => (
          <EditableInputCell value={text} onChange={this.onCellChange(record.key, 'no_test')} />
        ),
      },
      {
        key: 'no_fail',
        dataIndex: 'no_fail',
        title: 'FAIL #',
        name: 'FAIL #',
        render: (text, record) => (
          <EditableInputCell value={text} onChange={this.onCellChange(record.key, 'no_fail')} />
        ),
      },
      { key: 'skew_note', dataIndex: 'skew_note', title: 'NOTE', name: 'NOTE' },
      {
        key: 'start_date',
        dataIndex: 'start_date',
        title: 'START DATE',
        name: 'START DATE',
        render: (text, record) => (
          <EditableDateCell value={text} onChange={this.onCellChange(record.key, 'start_date')} />
        ),
      },
      {
        key: 'end_date',
        dataIndex: 'end_date',
        title: 'END DATE',
        name: 'END DATE',
        render: (text, record) => (
          <EditableDateCell value={text} onChange={this.onCellChange(record.key, 'end_date')} />
        ),
      },
    ]

    const expandedRowRender = r => {
      const fabricrelax_id = r._id
      const columns = [
        { title: 'STT', dataIndex: 'detail_stt', key: 'detail_stt' },
        {
          title: 'After Iron',
          children: [
            {
              title: 'Skrinkage',
              children: [
                {
                  title: 'Length',
                  dataIndex: 'iron_length',
                  key: 'iron_length',
                  render: (text, record, index) => (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('iron_length', index, fabricrelax_id)}
                    />
                  ),
                },
                {
                  title: 'Width',
                  dataIndex: 'iron_width',
                  key: 'iron_width',
                  render: (text, record, index) => (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('iron_width', index, fabricrelax_id)}
                    />
                  ),
                }
              ]
            },
            {
              title: 'Skew',
              dataIndex: 'iron_skew',
              key: 'iron_skew',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('iron_skew', index, fabricrelax_id)}
                />
              ),
            }
          ]

        },

        {
          title: 'After Washing',
          children: [
            {
              title: 'Skrinkage',
              children: [
                {
                  title: 'Length',
                  dataIndex: 'washing_length',
                  key: 'washing_length',
                  render: (text, record, index) => (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('washing_length', index, fabricrelax_id)}
                    />
                  ),
                },
                {
                  title: 'Width',
                  dataIndex: 'washing_width',
                  key: 'washing_width',
                  render: (text, record, index) => (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('washing_width', index, fabricrelax_id)}
                    />
                  ),
                }
              ]
            },
            {
              title: 'Skew',
              dataIndex: 'washing_skew',
              key: 'washing_skew',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('washing_skew', index, fabricrelax_id)}
                />
              ),
            }
          ]
        }, {
          title: 'Pass/Fail',
          dataIndex: 'isPass',
          key: 'isPass',
          render: (text, record, index) => (
            <EditableInputCell
              value={text}
              onChange={this.onCellDetailChange('isPass', index, fabricrelax_id)}
            />
          ),
        },
        {
          title: 'Remarks',
          dataIndex: 'remark',
          key: 'remark',
          render: (text, record, index) => (
            <EditableInputCell
              value={text}
              onChange={this.onCellDetailChange('remark', index, fabricrelax_id)}
            />
          ),
        },
      ]
      const data = r.details
      return (
        <div>
          <Row gutter={8}>
            <Col>
              <Button icon="plus" type="primary" size="small"> NEW ROW
              </Button>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Table
                size="small"
                bordered
                style={{ marginTop: '5px' }}
                rowKey={'_id'}
                columns={columns}
                dataSource={data}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      )
    }

    return (
      <Table
        rowKey={'_id'}
        size="small"
        bordered
        style={{ marginTop: '5px' }}
        columns={columns}
        pagination={false}
        dataSource={this.state.data_detail}
        expandedRowRender={expandedRowRender}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? 'even-row' : 'old-row'
        }}
      />
    )
  }
}

export default TestFabricSkewShrinlege
