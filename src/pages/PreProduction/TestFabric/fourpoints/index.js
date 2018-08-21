import React, { Component } from 'react'
import { Table, Form, Row, Col, Button, Icon, Tag } from 'antd'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import ExportToExcel from '../../../Common/exportToExcel'

import _ from 'lodash'
import moment from 'moment'

import { formatDate } from '../../../Common/formatdate'
import EditableDateCell from '../../../Common/editabledatecell'
const ButtonGroup = Button.Group
const uuidv1 = require('uuid/v1')

const test_fabric_fourpoint = '/api/testfabric/fourpoint/get'

const BORDER_STYLE = 'thin'
const COLOR_SPEC = 'FF000000'

const defect_items = [
  'slub_nep',
  'fly_spot',
  'hole_spliy',
  'stain_oil',
  'vline',
  'bare',
  'crease_mark',
  'uneven_dyed',
]

const exportDataset = (data_detail, data_parent) => {
  let dataset = []
  dataset.push({
    xSteps: 2,
    ySteps: 0,
    columns: ['KIỂM TRA HỆ THỐNG 4 ĐIỂM'],
    data: [[]],
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
      'INSPECT #',
      'FAIL #',
      'COLOR DIF',
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
    row.push(r.inspect_no)
    row.push(r.fail_no)
    row.push(r.color_dif)
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
    columns: ['KIỂM TRA HỆ THỐNG 4 ĐIỂM'],
    data: [[]],
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
        'INSPECT #',
        'FAIL #',
        'COLOR DIF',
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
    row.push(r.inspect_no)
    row.push(r.fail_no)
    row.push(r.color_dif)
    row.push(r.note)
    row.push(r.start_date)
    row.push(r.end_date)

    for (let j = 0; j < row.length; j++) {
      let j_value = {
        value: row[j] + '',
        style: { auto: 1, fill: { patternType: 'solid', fgColor: { rgb: 'FFFFFF00' } } },
      }
      row[j] = j_value
    }
    data_row.push(row)

    data.data = data_row
    dataset.push(data)

    //details
    let detail_group = {
      xSteps: 3,
      ySteps: 1,
      columns: ['LENGTH (MET)', '', 'YARD', 'WIDTH (khổ vải)', '', 'DEFECT ( HÀNG HƯ )'],
      data: [],
    }
    dataset.push(detail_group)

    let details = {
      xSteps: 1,
      ySteps: 0,
      columns: [
        'NO.',
        'ROLL',
        'Sticker (trên nhãn)',
        'Actual ( thực tế)',
        'Actual( thực tế)',
        'Sticker (trên nhãn)',
        'Actual ( thực tế)',
        'POINT (ĐIỂM)',
        'Slub/Nep( Lỗi sợi )',
        'Fly/Spot (Đốm)',
        'Hole/Split (Lủng/rách)',
        'Stain/Oil (Dơ/dầu)',
        'V.Line( sọc đứng)',
        'Bare ( Sợi ngang do kim móc)',
        'Crease/Mark (Gấp nếp)',
        'Uneven/Dyed (Màu nhuộm)',
        'TOTAL POINT (Tổng số điểm)',
        'DEFECTIVE POINT ( số lỗi hư )',
        'RESULT',
        'NOTE',
        'PHOTO OF DEFECT',
      ],
    }
    let details_data = []
    for (let j = 0; j < r.details.length; j++) {
      const d = r.details[j]
      const row = []
      if (j % 4 === 0) {
        row.push(d.detail_stt)
        row.push(d.no_roll)
        row.push(d.length_stick)
        row.push(d.length_actual)

        row.push(d.yard_actual)
        row.push(d.width_stick)
        row.push(d.width_actual)
      } else {
        for (let k = 0; k < 7; k++) {
          row.push('')
        }
      }

      row.push(d.points)
      row.push(d.slub_nep === 0 ? '' : d.slub_nep)
      row.push(d.fly_spot === 0 ? '' : d.fly_spot)
      row.push(d.hole_spliy === 0 ? '' : d.hole_spliy)
      row.push(d.stain_oil === 0 ? '' : d.stain_oil)
      row.push(d.vline === 0 ? '' : d.vline)
      row.push(d.bare === 0 ? '' : d.bare)
      row.push(d.crease_mark === 0 ? '' : d.crease_mark)
      row.push(d.uneven_dyed === 0 ? '' : d.uneven_dyed)
      if (j % 4 === 0) {
        row.push(d.total_point)
        row.push(d.defective_point)
        row.push(d.result)
        row.push(d.detail_note)
        row.push(d.photo_defect)
      } else {
        for (let k = 0; k < 5; k++) {
          row.push('')
        }
      }

      for (let k = 0; k < row.length; k++) {
        if (j % 2 === 0) {
          let k_value = {
            value: row[k] + '',
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
            value: row[k] + '',
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

class TestFabricFourPoint extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_received: [],
      data_detail: [],
      data_detail_id: [],
      isUpdate: false,
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
      return nextState
    }
    return null
  }

  componentDidMount = () => {
    let { data_received, data_detail_id } = this.state
    this.loadtestfabricfourpoint(data_received, data_detail_id)
  }

  loadtestfabricfourpoint = (data_received, data_detail_id) => {
    axios
      .get(test_fabric_fourpoint, { params: { _ids: data_detail_id } })
      .then(res => {
        let data = res.data
        let new_data_detail = [...data_received]
        if (_.isEmpty(data.data)) {
          for (let i = 0; i < new_data_detail.length; i++) {
            let r = new_data_detail[i]
            r.inspect_no = 0
            r.fail_no = 0
            r.note = ''
            r.color_dif = '0/0'
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
          })
        } else {
          for (let i = 0; i < new_data_detail.length; i++) {
            const find_weight = _.find(data.data, { _id: new_data_detail[i]._id })
            new_data_detail[i].inspect_no = find_weight.inspect_no
            new_data_detail[i].test_no = find_weight.test_no
            new_data_detail[i].fail_no = find_weight.fail_no
            new_data_detail[i].color_dif = find_weight.color_dif
            new_data_detail[i].note = find_weight.note

            let details = [...find_weight.details]
            let current_stt = 0
            for (let j = 0; j < details.length; j++) {
              if (j % 4 === 0) {
                current_stt += 1
              }
              details[j].detail_stt = current_stt
            }
            new_data_detail[i].details = details
          }
          this.setState({
            data_detail: new_data_detail,
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_detail: [] })
      })
  }

  createDataNewRow = i => {
    let rows = []

    for (let j = 0; j < 4; j++) {
      let r = {
        detail_stt: i + 1,
        _id: uuidv1(),
        no_roll: 0,
        length_stick: 0,
        length_actual: 0,

        yard_actual: 0,
        width_stick: 0,
        width_actual: 0,
        slub_nep: 0,
        fly_spot: 0,
        hole_spliy: 0,
        stain_oil: 0,
        vline: 0,
        bare: 0,
        crease_mark: 0,
        uneven_dyed: 0,
        total_point: 0,
        defective_point: 0,
        result: '',
        detail_note: '',
        photo_defect: '',
      }

      switch (j) {
        case 0:
          r.points = '1 (defect 0-3")'
          break

        case 1:
          r.points = '2 (defect 3-6")'
          break

        case 2:
          r.points = '3 (defect 6-9")'
          break

        case 3:
          r.points = '4 (defect >9")'
          break
        default:
      }

      rows.push(r)
    }
    return rows
  }
  onCellChange = (key, dataIndex) => {
    return value => {
      const data_detail = [...this.state.data_detail]
      const target = data_detail.find(item => item._id === key)
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
        try {
          target.details[row_index][dataIndex] = value
        } catch (error) {
          console.log('row_index =>' + row_index)
          console.log('target.details =>' + JSON.stringify(target.details))
          console.log('dataIndex =>' + dataIndex)
          console.log('value =>' + value)
          return
        }
        const group_row = Math.floor(row_index / 4)
        const start_line = group_row * 4
        if (dataIndex === 'length_actual') {
          const yard_actual = value / 0.9144
          target.details[start_line]['yard_actual'] = yard_actual.toFixed(6)
        }

        let total_point = 0
        for (let i = 0; i < defect_items.length; i++) {
          const defect_key = defect_items[i]
          total_point += parseFloat(target.details[start_line][defect_key])
          total_point += parseFloat(target.details[start_line + 1][defect_key]) * 2
          total_point += parseFloat(target.details[start_line + 2][defect_key]) * 3
          total_point += parseFloat(target.details[start_line + 3][defect_key]) * 4
        }
        target.details[start_line]['total_point'] = total_point
        const width_actual = parseFloat(target.details[start_line]['width_actual'])
        const yard_actual = parseFloat(target.details[start_line]['yard_actual'])

        const defective_point = (total_point * 3600) / width_actual / yard_actual

        target.details[start_line]['defective_point'] = defective_point.toFixed(2)

        let ispass = ''
        if (defective_point >= 24) {
          ispass = 'FAIL'
        } else {
          ispass = 'PASS'
        }

        target.details[start_line]['result'] = ispass

        if (ispass === 'PASS' || ispass === 'FAIL') {
          let fail_no = 0
          let inspect_no = 0
          let group_size = Math.floor(target.details.length / 4)
          for (let i = 0; i < group_size; i++) {
            if (target.details[4 * i]['result'] === 'FAIL') {
              fail_no += 1
              inspect_no += 1
            } else if (target.details[4 * i]['result'] === 'PASS') {
              inspect_no += 1
            }
          }
          target.fail_no = fail_no
          target.inspect_no = inspect_no
        }

        this.setState({ data_detail })
      }
    }
  }

  onDeleteRow = e => {
    if (e.target) {
      const values = e.target.value ? e.target.value.split(',') : []
      try {
        if (!_.isEmpty(values)) {
          const index = parseInt(values[0], 10)
          const fourpoint_id = values[1]
          const data_detail = [...this.state.data_detail]
          const row_index = _.findIndex(data_detail, { _id: fourpoint_id })
          if (row_index >= 0) {
            const target = data_detail[row_index]
            if (target.details.length > index) {
              //lay detail_stt
              const t_detail = target.details[index]
              if (t_detail) {
                const t_detail_stt = t_detail.detail_stt
                _.remove(target.details, e => {
                  return e.detail_stt === t_detail_stt
                })
                data_detail[row_index] = target
                //update
                this.setState({ data_detail })
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
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

  render() {
    const columns = [
      { key: 'fabric_type', dataIndex: 'fabric_type', title: 'TYPE', name: 'TYPE' },
      { key: 'fabric_color', dataIndex: 'fabric_color', title: 'COLOR', name: 'COLOR' },
      { key: 'roll', dataIndex: 'roll', title: 'ROLL', name: 'ROLL' },
      { key: 'met', dataIndex: 'met', title: 'MET', name: 'MET' },
      { key: 'orderid', dataIndex: 'orderid', title: 'ORDER #' },
      {
        key: 'inspect_no',
        dataIndex: 'inspect_no',
        title: 'INSPECT #',
        render: (text, record) => <Tag color="blue">{text}</Tag>,
      },
      {
        key: 'fail_no',
        dataIndex: 'fail_no',
        title: 'FAIL #',
        render: (text, record) => <Tag color="blue">{text}</Tag>,
      },
      {
        key: 'color_dif',
        dataIndex: 'color_dif',
        title: 'COLOR DIF',
        render: (text, record) => (
          <EditableInputCell value={text} onChange={this.onCellChange(record._id, 'color_dif')} />
        ),
      },
      {
        key: 'note',
        dataIndex: 'note',
        title: 'NOTE',
        render: (text, record) => (
          <EditableInputCell value={text} onChange={this.onCellChange(record._id, 'note')} />
        ),
      },
      {
        key: 'start_date',
        dataIndex: 'start_date',
        title: 'START DATE',
        name: 'START DATE',
        render: (text, record) => (
          <EditableDateCell value={text} onChange={this.onCellChange(record._id, 'start_date')} />
        ),
      },
      {
        key: 'end_date',
        dataIndex: 'end_date',
        title: 'END DATE',
        name: 'END DATE',
        render: (text, record) => (
          <EditableDateCell value={text} onChange={this.onCellChange(record._id, 'end_date')} />
        ),
      },
    ]
    const expandedRowRender = r => {
      const fabricrelax_id = r._id

      const columns = [
        { title: 'STT', dataIndex: 'detail_stt', key: 'detail_stt' },
        {
          title: 'ROLL',
          width: 80,
          dataIndex: 'no_roll',
          key: 'no_roll',
          render: (text, record, index) => {
            if (index % 4 === 0) {
              return (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('no_roll', index, fabricrelax_id)}
                />
              )
            } else {
              return { text }
            }
          },
        },
        {
          title: 'LENGTH (MET)',
          children: [
            {
              title: 'Sticker',
              dataIndex: 'length_stick',
              key: 'length_stick',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('length_stick', index, fabricrelax_id)}
                    />
                  )
                } else {
                  return { text }
                }
              },
            },
            {
              title: 'Actual',
              dataIndex: 'length_actual',
              key: 'length_actual',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('length_actual', index, fabricrelax_id)}
                    />
                  )
                } else {
                  return { text }
                }
              },
            },
          ],
        },
        {
          title: 'Yard',
          children: [
            {
              title: 'Actual',
              dataIndex: 'yard_actual',
              key: 'yard_actual',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  try {
                    const value = parseFloat(record.yard_actual).toFixed(2)
                    return <Tag color="purple">{value}</Tag>
                  } catch (ex) {
                    return <Tag color="purple">{text}</Tag>
                  }
                } else {
                  return { text }
                }
              },
            },
          ],
        },
        {
          title: 'WIDTH',
          children: [
            {
              title: 'Stiker',
              dataIndex: 'width_stick',
              key: 'width_stick',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('width_stick', index, fabricrelax_id)}
                    />
                  )
                } else {
                  return { text }
                }
              },
            },
            {
              title: 'Actual',
              key: 'width_actual',
              dataIndex: 'width_actual',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('width_actual', index, fabricrelax_id)}
                    />
                  )
                } else {
                  return { text }
                }
              },
            },
          ],
        },

        {
          title: 'DEFECT',
          width: 1000,
          children: [
            {
              title: 'Point',
              width: 100,
              dataIndex: 'points',
              key: 'points',
            },
            {
              title: 'Slub/Nep',
              width: 100,
              dataIndex: 'slub_nep',
              key: 'slub_nep',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('slub_nep', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Fly/Spot',
              width: 100,
              dataIndex: 'fly_spot',
              key: 'fly_spot',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('fly_spot', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Hole/Split',
              width: 100,
              dataIndex: 'hole_spliy',
              key: 'hole_spliy',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('hole_spliy', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Stain/Oil',
              width: 100,
              dataIndex: 'stain_oil',
              key: 'stain_oil',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('stain_oil', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'V.Line',
              dataIndex: 'vline',
              key: 'vline',
              width: 100,
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('vline', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Bare',
              dataIndex: 'bare',
              key: 'bare',
              width: 100,
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('bare', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Crease/Mark',
              dataIndex: 'crease_mark',
              key: 'crease_mark',
              width: 100,
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('crease_mark', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Uneven/Dyed',
              dataIndex: 'uneven_dyed',
              key: 'uneven_dyed',
              width: 100,
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('uneven_dyed', index, fabricrelax_id)}
                />
              ),
            },
          ],
        },
        {
          title: 'TOTAL POINT',
          dataIndex: 'total_point',
          key: 'total_point',
          width: 150,
          render: (text, record, index) => {
            if (index % 4 === 0) {
              return <Tag color="green">{text}</Tag>
            } else {
              return ''
            }
          },
        },
        {
          title: 'DEFECT POINT',
          dataIndex: 'defective_point',
          width: 150,
          key: 'defective_point',
          render: (text, record, index) => {
            if (index % 4 === 0) {
              try {
                const value = parseFloat(text)
                if (value >= 25) {
                  return <Tag color="red">{text}</Tag>
                } else {
                  return <Tag color="green">{text}</Tag>
                }
              } catch (error) {
                return <Tag color="red">{text}</Tag>
              }
            } else {
              return { text }
            }
          },
        },
        {
          title: 'RESULT',
          dataIndex: 'result',
          key: 'result',
          width: 100,
          render: (text, record, index) => {
            if (index % 4 === 0) {
              if (text === 'FAIL') {
                return <Tag color="#f50">{text}</Tag>
              } else {
                return <Tag color="#87d068">{text}</Tag>
              }
            } else {
              return ''
            }
          },
        },
        {
          title: 'NOTE',
          dataIndex: 'detail_note',
          key: 'detail_note',
          width: 250,
          render: (text, record, index) => {
            if (index % 4 === 0) {
              return (
                <EditableInputCell
                  value={text}
                  onChange={this.onCellDetailChange('detail_note', index, fabricrelax_id)}
                />
              )
            } else {
              return { text }
            }
          },
        },
        {
          title: '',
          dataIndex: 'actions',
          key: 'actions',
          render: (text, record, index) => {
            if (index % 4 === 0) {
              return (
                <ButtonGroup>
                  <Button
                    type="danger"
                    size="default"
                    value={[index, fabricrelax_id]}
                    onClick={this.onDeleteRow}
                  >
                    <Icon type="close-circle" />
                  </Button>
                </ButtonGroup>
              )
            } else return null
          },
        },
        /*{
          title: 'PHOTO OF DEFECT',
          dataIndex: 'photo_defect',
          key: 'photo_defect',
          render: (text, record, index) => (
            <EditableInputCell
              value={text}
              onChange={this.onCellDetailChange('photo_defect', index, fabricrelax_id)}
            />
          ),
        },*/
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
          <Row gutter={2}>
            <Col>
              <Table
                size="small"
                bordered
                style={{ marginTop: '5px' }}
                rowKey={'_id'}
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ x: 1300 }}
              />
            </Col>
          </Row>
        </div>
      )
    }
    const { data_detail, data_parent } = this.state
    const multiDataSet = exportDataset(data_detail, data_parent)
    const filename = data_parent.declare_no + '-4foint - ' + moment().format('MMDDYYYYhmmss')
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
          scroll={{ x: 1300 }}
        />
      </Form>
    )
  }
}

export default TestFabricFourPoint
