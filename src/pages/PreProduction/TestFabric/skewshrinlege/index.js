import React, { Component } from 'react'
import { Table, Button, Tag, Form, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formItemLayout, tailFormItemLayout } from '../../../Common/FormStyle'
import { formatDate } from '../../../Common/formatdate'
import ExportToExcel from '../../../Common/exportToExcel'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import _ from 'lodash'
import moment from 'moment'

import { isBuffer } from 'util'

const uuidv1 = require('uuid/v1')
const decimal_fix = 1
const test_fabric_skew_get = '/api/testfabric/skew/get'

const BORDER_STYLE = 'thin'
const COLOR_SPEC = 'FF000000'

const exportDataset = (data_detail, data_parent) => {
  let dataset = []
  dataset.push({
    xSteps: 2,
    ySteps: 0,
    columns: ['KIỂM TRA ĐỘ CO RÚT'],
    data: [],
  })

  let data = {
    xSteps: 0,
    ySteps: 2,
    columns: [
      'DATE',
      'STK',
      'TYPE',
      'COLOR',
      'ROLL #',
      'TEST #',
      'FAIL #',
      'NOTE',
      'START TIME',
      'END TIME',
    ],
  }
  let data_row = []

  for (let i = 0; i < data_detail.length; i++) {
    let row = []
    let r = data_detail[i]
    row.push(moment(new Date(data_parent.declare_date)).format('MM/DD/YYYY'))
    row.push(data_parent.declare_no)
    row.push(r.fabric_type)
    row.push(r.fabric_color)
    row.push(r.roll)
    row.push(r.test_no)
    row.push(r.fail_no)
    row.push(r.condition)
    row.push(r.note)
    row.push(r.start_date)
    row.push(r.end_date)

    for (let j = 0; j < row.length; j++) {
      if (i % 2 === 0) {
        let j_value = {
          value: row[j] + '',
          style: {
            border: {
              top: { style: BORDER_STYLE, color: COLOR_SPEC },
              bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
            },
            fill: { patternType: 'solid', fgColor: { rgb: 'FFFFFF00' } },
          },
        }
        row[j] = j_value
      } else {
        let j_value = {
          value: row[j] + '',
          style: {
            border: {
              top: { style: BORDER_STYLE, color: COLOR_SPEC },
              bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
            },
          },
        }
        row[j] = j_value
      }
    }

    data_row.push(row)
  }
  data.data = data_row
  dataset.push(data)

  const dataDetail = exportDatasetDetail(data_detail, data_parent)
  const multiDataSet = [
    { data: dataset, sheetname: 'Sheet1' },
    { data: dataDetail, sheetname: 'Sheet2' },
  ]
  return multiDataSet
}
const exportDatasetDetail = (data_detail, data_parent) => {
  let dataset = []
  dataset.push({
    xSteps: 2,
    ySteps: 0,
    columns: ['KIỂM TRA ĐỘ CO RÚT'],
    data: [],
  })

  const rgb_value = 'ff00cce6'
  for (let i = 0; i < data_detail.length; i++) {
    let data = {
      xSteps: 0,
      ySteps: 2,
      columns: [
        'DATE',
        'STK',
        'TYPE',
        'COLOR',
        'ROLL #',
        'TEST #',
        'FAIL #',
        'NOTE',
        'START TIME',
        'END TIME',
      ],
    }
    let data_row = []

    let row = []
    let r = data_detail[i]
    row.push(moment(new Date(data_parent.declare_date)).format('MM/DD/YYYY'))
    row.push(data_parent.declare_no)
    row.push(r.fabric_type)
    row.push(r.fabric_color)
    row.push(r.roll)
    row.push(r.test_no)
    row.push(r.fail_no)
    row.push(r.note)
    row.push(r.start_date)
    row.push(r.end_date)

    for (let j = 0; j < row.length; j++) {
      let j_value = {
        value: row[j] + '',
        style: { fill: { patternType: 'solid', fgColor: { rgb: 'FFFFFF00' } } },
      }
      row[j] = j_value
    }

    data_row.push(row)

    data.data = data_row
    dataset.push(data)

    dataset.push({
      xSteps: 0,
      ySteps: 1,
      columns: [
        '',
        'After Iron( Sau khi ủi )',
        '',
        '',
        'After Washing( Sau khi giặt )',
        '',
        '',
        'Pass/Fail(Đạt/Không đạt)',
        'Remarks (Ghi chú )',
      ],
      data: [],
    })
    dataset.push({
      xSteps: 0,
      ySteps: 0,
      columns: [
        '',
        'Shrinkage(Độ rút )',
        '',
        'Skew (Độ xéo)',
        'Shrinkage (Độ rút )',
        '',
        'Skew (Độ xéo)',
        '',
        '',
      ],
      data: [],
    })
    let details = {
      xSteps: 0,
      ySteps: 0,
      columns: [
        '',
        'Length (Dài )',
        'Width (Rộng)',
        '',
        'Length (Dài )',
        'Width (Rộng)',
        '',
        '',
        '',
      ],
    }
    let details_data = []
    for (let j = 0; j < r.details.length; j++) {
      const d = r.details[j]
      const row = []
      row.push(d.detail_stt)
      if (j % 4 === 3) {
        row.push(d.iron_length === 0 ? '' : d.iron_length + '%')
        row.push(d.iron_width === 0 ? '' : d.iron_width + '%')
        row.push(d.iron_skew === 0 ? '' : d.iron_skew + '%')

        row.push(d.washing_length === 0 ? '' : d.washing_length + '%')
        row.push(d.washing_width === 0 ? '' : d.washing_width + '%')
        row.push(d.washing_skew === 0 ? '' : d.washing_skew + '%')
      } else {
        row.push(d.iron_length === 0 ? '' : d.iron_length)
        row.push(d.iron_width === 0 ? '' : d.iron_width)
        if (j % 4 === 0) {
          row.push(d.iron_skew === 0 ? '' : 'AC:' + d.iron_skew)
        } else if (j % 4 === 1) {
          row.push(d.iron_skew === 0 ? '' : 'BD:' + d.iron_skew)
        } else {
          row.push('')
        }

        row.push(d.washing_length === 0 ? '' : d.washing_length)
        row.push(d.washing_width === 0 ? '' : d.washing_width)
        if (j % 4 === 0) {
          row.push(d.washing_skew === 0 ? '' : 'AC:' + d.washing_skew)
        } else if (j % 4 === 1) {
          row.push(d.washing_skew === 0 ? '' : 'BD:' + d.washing_skew)
        } else {
          row.push('')
        }
      }

      row.push(d.isPass)
      row.push(d.remark)

      for (let k = 0; k < row.length; k++) {
        if (j % 4 === 3) {
          let k_value = {
            value: row[k] ? row[k] + '' : '',
            style: {
              auto: 1,
              border: {
                top: { style: BORDER_STYLE, color: COLOR_SPEC },
                bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
              },
              fill: { patternType: 'solid', fgColor: { rgb: 'FFCCEEFF' } },
            },
          }
          row[k] = k_value
        } else {
          let k_value = {
            value: row[k] ? row[k] + '' : '',
            style: {
              auto: 1,
              border: {
                top: { style: BORDER_STYLE, color: COLOR_SPEC },
                bottom: { style: BORDER_STYLE, color: COLOR_SPEC },
              },
            },
          }
          row[k] = k_value
        }
      }

      details_data.push(row)
    }
    details.data = details_data
    dataset.push(details)
  }

  return dataset
}

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
      nextState.data_parent = nextProps.data_parent
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
            for (let j = 0; j < 1; j++) {
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
            const start_line = i * 4

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

            let fail_no = 0
            let test_no = 0

            let group_size = Math.floor(target.details.length / 4)
            for (let i = 0; i < group_size; i++) {
              if (target.details[4 * i + 3]['isPass'] === 'FAIL') {
                fail_no += 1
                test_no += 1
              } else if (target.details[4 * i + 3]['isPass'] === 'PASS') {
                test_no += 1
              }
            }
            target.fail_no = fail_no
            target.test_no = test_no
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
        console.log('row_index ==' + row_index + ',dataIndex ==' + dataIndex)
        target.details[row_index][dataIndex] = value

        const group_row = Math.floor(row_index / 4)
        const start_line = group_row * 4
        console.log('start_line ==' + start_line)
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

        if (ispass === 'PASS' || ispass === 'FAIL') {
          let fail_no = 0
          let test_no = 0

          let group_size = Math.floor(target.details.length / 4)
          for (let i = 0; i < group_size; i++) {
            if (target.details[4 * i + 3]['isPass'] === 'FAIL') {
              fail_no += 1
              test_no += 1
            } else if (target.details[4 * i + 3]['isPass'] === 'PASS') {
              test_no += 1
            }
          }
          target.fail_no = fail_no
          target.test_no = test_no
        }

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
        render: (text, record) => <Tag color="blue">{text}</Tag>,
      },
      {
        key: 'fail_no',
        dataIndex: 'fail_no',
        title: 'FAIL #',
        name: 'FAIL #',
        render: (text, record) => <Tag color="blue">{text}</Tag>,
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
    const { data_detail, data_parent } = this.state
    const multiDataSet = exportDataset(data_detail, data_parent)
    const filename = data_parent.declare_no + '-skewshrinlege-' + moment().format('MMDDYYYYhhmmss')
    return (
      <Form>
        <ExportToExcel dataset={multiDataSet} filename={filename} />
        <Table
          rowKey={'_id'}
          size="small"
          bordered
          style={{ marginTop: '5px' }}
          columns={columns}
          pagination={false}
          dataSource={data_detail}
          expandedRowRender={expandedRowRender}
        />
      </Form>
    )
  }
}

export default TestFabricSkewShrinlege
