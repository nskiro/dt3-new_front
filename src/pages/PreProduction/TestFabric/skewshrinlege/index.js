import React, { Component } from 'react'
import { Table, Button, Tag, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formItemLayout, tailFormItemLayout } from '../../../Common/FormStyle'
import { formatDate } from '../../../Common/formatdate'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import _ from 'lodash'
import moment from 'moment'

import '../../TestFabric/testfabric.css'
import { isBuffer } from 'util'

const uuidv1 = require('uuid/v1')
const decimal_fix = 1
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
    let rows = []
    for (let j = 0; j < 4; j++) {
      let r = {
        _id: uuidv1(),
        iron_length: 0,
        iron_width: 0,
        iron_skew: 0,

        washing_length: 0,
        washing_width: 0,
        washing_skew: 0,

        isPass: '',
        remark: '',
      }
      if (j === 3) {
        r.detail_stt = 'Diff %'
      }
      rows.push(r)
    }
    return rows
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
            r.condition = 0
            r.note = ''
            r.end_date = moment().format(formatDate.shortType)
            r.start_date = moment().format(formatDate.shortType)
            let details = []
            for (let j = 0; j < 2; j++) {
              details = details.concat(this.createDataNewRow(j))
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
            new_data_detail[i].condition = find_weight.condition
            new_data_detail[i].fail_no = find_weight.fail_no
            new_data_detail[i].note = find_weight.note

            let details = [...find_weight.details]
            for (let j = 0; j < details.length; j++) {
              if (j % 4 === 3) {
                details[j].detail_stt = 'Diff %'
              }
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
  onNewRow = e => {
    if (e.target) {
      let fourpoint_id = e.target.value
      if (fourpoint_id) {
        const data_detail = [...this.state.data_detail]
        const row_index = _.findIndex(data_detail, { _id: fourpoint_id })
        if (row_index >= 0) {
          const target = data_detail[row_index]
          if (target) {
            const row_group = Math.floor(target.details.length / 4)
            let new_item = this.createDataNewRow(row_group)
            target.details = target.details.concat(new_item)
            data_detail[row_index] = target
            this.setState({ data_detail })
          }
        }
      }
    }
  }
  onCellChange = (key, dataIndex) => {
    return value => {
      const data_detail = [...this.state.data_detail]
      const target = data_detail.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value

        if (dataIndex === 'condition') {
          const size = Math.floor(target.details.length / 4)
          for (let i = 0; i < size; i++) {
            const start_line = size * i

            let iron_length_total = 0
            let iron_width_total = 0

            let washing_length_total = 0
            let washing_width_total = 0

            for (let j = start_line; j < start_line + 3; j++) {
              iron_length_total += parseFloat(target.details[j]['iron_length'])
              iron_width_total += parseFloat(target.details[j]['iron_width'])

              washing_length_total += parseFloat(target.details[j]['washing_length'])
              washing_width_total += parseFloat(target.details[j]['washing_width'])
            }

            const iron_ac_skew = parseFloat(target.details[start_line]['iron_skew'])
            const iron_bd_skew = parseFloat(target.details[start_line + 1]['iron_skew'])

            const wash_ac_skew = parseFloat(target.details[start_line]['washing_skew'])
            const wash_bd_skew = parseFloat(target.details[start_line + 1]['washing_skew'])

            const iron_skew_total =
              (2 * (iron_ac_skew - iron_bd_skew) * 100) / (iron_ac_skew + iron_bd_skew)
            const washing_skew_total =
              (2 * (wash_ac_skew - wash_bd_skew) * 100) / (wash_ac_skew + wash_bd_skew)

            const iron_length = ((iron_length_total / 3 - 10) * 10).toFixed(decimal_fix)
            const iron_width = ((iron_width_total / 3 - 10) * 10).toFixed(decimal_fix)
            const iron_skew = iron_skew_total.toFixed(1)

            const washing_length = ((washing_length_total / 3 - 10) * 10).toFixed(decimal_fix)
            const washing_width = ((washing_width_total / 3 - 10) * 10).toFixed(decimal_fix)
            const washing_skew = washing_skew_total.toFixed(decimal_fix)

            target.details[start_line + 3]['iron_length'] = iron_length
            target.details[start_line + 3]['iron_width'] = iron_width
            target.details[start_line + 3]['iron_skew'] = iron_skew

            target.details[start_line + 3]['washing_length'] = washing_length
            target.details[start_line + 3]['washing_width'] = washing_width
            target.details[start_line + 3]['washing_skew'] = washing_skew

            const percent_arr = [
              iron_length,
              iron_width,
              iron_skew,
              washing_length,
              washing_width,
              washing_skew,
            ]
            const condition = target.condition
            let ispass = ''
            if (condition) {
              ispass = 'PASS'
              const condition_down = -1.0 * Math.abs(parseFloat(condition))
              const condition_up = Math.abs(parseFloat(condition))
              for (let i = 0; i < percent_arr.length; i++) {
                let value = parseFloat(percent_arr[i])
                if (value >= condition_up || value <= condition_down) {
                  ispass = 'FAIL'
                  break
                }
              }
            }
            target.details[start_line + 3]['isPass'] = ispass
          }
        }

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

        const group_row = Math.floor(row_index / 4)
        const start_line = group_row * 4

        let iron_length_total = 0
        let iron_width_total = 0

        let washing_length_total = 0
        let washing_width_total = 0

        for (let j = start_line; j < start_line + 3; j++) {
          iron_length_total += parseFloat(target.details[j]['iron_length'])
          iron_width_total += parseFloat(target.details[j]['iron_width'])

          washing_length_total += parseFloat(target.details[j]['washing_length'])
          washing_width_total += parseFloat(target.details[j]['washing_width'])
        }

        const iron_ac_skew = parseFloat(target.details[start_line]['iron_skew'])
        const iron_bd_skew = parseFloat(target.details[start_line + 1]['iron_skew'])

        const wash_ac_skew = parseFloat(target.details[start_line]['washing_skew'])
        const wash_bd_skew = parseFloat(target.details[start_line + 1]['washing_skew'])

        const iron_skew_total =
          (2 * (iron_ac_skew - iron_bd_skew) * 100) / (iron_ac_skew + iron_bd_skew)
        const washing_skew_total =
          (2 * (wash_ac_skew - wash_bd_skew) * 100) / (wash_ac_skew + wash_bd_skew)

        const iron_length = ((iron_length_total / 3 - 10) * 10).toFixed(decimal_fix)
        const iron_width = ((iron_width_total / 3 - 10) * 10).toFixed(decimal_fix)
        const iron_skew = iron_skew_total.toFixed(1)

        const washing_length = ((washing_length_total / 3 - 10) * 10).toFixed(decimal_fix)
        const washing_width = ((washing_width_total / 3 - 10) * 10).toFixed(decimal_fix)
        const washing_skew = washing_skew_total.toFixed(decimal_fix)

        target.details[start_line + 3]['iron_length'] = iron_length
        target.details[start_line + 3]['iron_width'] = iron_width
        target.details[start_line + 3]['iron_skew'] = iron_skew

        target.details[start_line + 3]['washing_length'] = washing_length
        target.details[start_line + 3]['washing_width'] = washing_width
        target.details[start_line + 3]['washing_skew'] = washing_skew

        const percent_arr = [
          iron_length,
          iron_width,
          iron_skew,
          washing_length,
          washing_width,
          washing_skew,
        ]
        const condition = target.condition
        let ispass = ''
        if (condition) {
          ispass = 'PASS'
          const condition_down = -1.0 * Math.abs(parseFloat(condition))
          const condition_up = Math.abs(parseFloat(condition))
          for (let i = 0; i < percent_arr.length; i++) {
            let value = parseFloat(percent_arr[i])
            if (value >= condition_up || value <= condition_down) {
              ispass = 'FAIL'
              break
            }
          }
        }

        target.details[start_line + 3]['isPass'] = ispass

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
        key: 'condition',
        dataIndex: 'condition',
        title: 'CONDITION',
        name: 'CONDITION',
        render: (text, record) => (
          <EditableNumberCell
            value={text}
            suffix="%"
            onChange={this.onCellChange(record.key, 'condition')}
          />
        ),
      },
      {
        key: 'test_no',
        dataIndex: 'test_no',
        title: 'TEST #',
        name: 'TEST #',
        render: (text, record) => (
          <EditableNumberCell value={text} onChange={this.onCellChange(record.key, 'test_no')} />
        ),
      },
      {
        key: 'fail_no',
        dataIndex: 'fail_no',
        title: 'FAIL #',
        name: 'FAIL #',
        render: (text, record) => (
          <EditableNumberCell value={text} onChange={this.onCellChange(record.key, 'fail_no')} />
        ),
      },
      {
        key: 'note',
        dataIndex: 'note',
        title: 'NOTE',
        name: 'NOTE',
        render: (text, record) => (
          <EditableInputCell value={text} onChange={this.onCellChange(record.key, 'note')} />
        ),
      },
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
        { title: '       ', dataIndex: 'detail_stt', key: 'detail_stt' },
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
                  render: (text, record, index) => {
                    if (index % 4 !== 3) {
                      return (
                        <EditableNumberCell
                          value={text}
                          onChange={this.onCellDetailChange('iron_length', index, fabricrelax_id)}
                        />
                      )
                    } else {
                      return <Tag color="#147BAB">{text}%</Tag>
                    }
                  },
                },
                {
                  title: 'Width',
                  dataIndex: 'iron_width',
                  key: 'iron_width',
                  render: (text, record, index) => {
                    if (index % 4 !== 3) {
                      return (
                        <EditableNumberCell
                          value={text}
                          onChange={this.onCellDetailChange('iron_width', index, fabricrelax_id)}
                        />
                      )
                    } else {
                      return <Tag color="#147BAB">{text}%</Tag>
                    }
                  },
                },
              ],
            },
            {
              title: 'Skew',
              dataIndex: 'iron_skew',
              key: 'iron_skew',
              render: (text, record, index) => {
                if (index % 4 < 2) {
                  return (
                    <EditableNumberCell
                      value={text}
                      prefix={index % 4 === 0 ? 'AC' : 'BD'}
                      onChange={this.onCellDetailChange('iron_skew', index, fabricrelax_id)}
                    />
                  )
                } else {
                  if (index % 4 === 3) {
                    return <Tag color="#042E60">{text}%</Tag>
                  } else {
                    return { text }
                  }
                }
              },
            },
          ],
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
                  render: (text, record, index) => {
                    if (index % 4 !== 3) {
                      return (
                        <EditableNumberCell
                          value={text}
                          onChange={this.onCellDetailChange(
                            'washing_length',
                            index,
                            fabricrelax_id,
                          )}
                        />
                      )
                    } else {
                      return <Tag color="#147BAB">{text}%</Tag>
                    }
                  },
                },
                {
                  title: 'Width',
                  dataIndex: 'washing_width',
                  key: 'washing_width',
                  render: (text, record, index) => {
                    if (index % 4 !== 3) {
                      return (
                        <EditableNumberCell
                          value={text}
                          onChange={this.onCellDetailChange('washing_width', index, fabricrelax_id)}
                        />
                      )
                    } else {
                      return <Tag color="#147BAB">{text}%</Tag>
                    }
                  },
                },
              ],
            },
            {
              title: 'Skew',
              dataIndex: 'washing_skew',
              key: 'washing_skew',
              render: (text, record, index) => {
                if (index % 4 < 2) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('washing_skew', index, fabricrelax_id)}
                    />
                  )
                } else {
                  if (index % 4 === 3) {
                    return <Tag color="#042E60">{text}%</Tag>
                  } else {
                    return { text }
                  }
                }
              },
            },
          ],
        },
        {
          title: 'Pass/Fail',
          dataIndex: 'isPass',
          key: 'isPass',
          render: (text, record, index) => {
            if (index % 4 === 3) {
              if (text === 'PASS') {
                return <Tag color="green">{text}</Tag>
              } else if (text === 'FAIL') {
                return <Tag color="red">{text}</Tag>
              } else {
                return <Tag color="#f50">{text}</Tag>
              }
            } else {
              return ''
            }
          },
        },
        {
          title: 'Remarks',
          dataIndex: 'remark',
          key: 'remark',
          render: (text, record, index) => {
            if (index % 4 === 3) {
              return (
                <EditableInputCell
                  value={text}
                  onChange={this.onCellDetailChange('remark', index, fabricrelax_id)}
                />
              )
            } else {
              return ''
            }
          },
        },
      ]
      const data = r.details
      return (
        <div>
          <Row gutter={8}>
            <Col>
              <Button
                icon="plus"
                type="primary"
                size="small"
                value={fabricrelax_id}
                onClick={this.onNewRow}
              >
                New row
              </Button>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
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
