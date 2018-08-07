import React, { Component } from 'react'
import { Table, Button, Form, Icon, Row, Col } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import axios from '../../../../axiosInst'

import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formatDate } from '../../../Common/formatdate'
import ExportToExcel from '../../../Common/exportToExcel'

const uuidv1 = require('uuid/v1')

const test_fabric_colorshard_get = '/api/testfabric/colorshard/get'

const BORDER_STYLE = 'thin'
const COLOR_SPEC = 'FF000000'

const exportDataset = (data_detail, data_parent) => {
  let dataset = []
  dataset.push({
    xSteps: 2,
    ySteps: 0,
    columns: ['PHÂN TÁCH NHÓM MÀU 100%'],
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
      'SHADING #',
      'GROUP#',
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
    row.push(r.shard_no === 0 ? '' : r.shard_no)
    row.push(r.group_no === 0 ? '' : r.group_no)
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
    columns: ['PHÂN TÁCH NHÓM MÀU 100%'],
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
        'SHADING #',
        'GROUP#',
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
    row.push(r.shard_no === 0 ? '' : r.shard_no)
    row.push(r.group_no === 0 ? '' : r.group_no)
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

    let details = {
      xSteps: 0,
      ySteps: 1,
      columns: ['STT', 'SỐ ROLL', 'SỐ MÉT', 'NHÓM', 'GHI CHÚ'],
    }
    let details_data = []
    for (let j = 0; j < r.details.length; j++) {
      const d = r.details[j]
      const row = []
      row.push(d.detail_stt)
      row.push(d.roll_no)
      row.push(d.met_no === 0 ? '' : d.met_no)
      row.push(d.group_no_detail === 0 ? '' : d.group_no_detail)
      row.push(d.detail_note)
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

class TestFabricColorShard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_received: [],
      data_detail: [],
      data_detail_id: [],
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
    const { data_received, data_detail_id } = this.state
    this.loadtestfabricscolorshard(data_received, data_detail_id)
  }

  loadtestfabricscolorshard = (data_received, data_detail_id) => {
    axios
      .get(test_fabric_colorshard_get, { params: { _ids: data_detail_id } })
      .then(res => {
        let data = res.data
        let new_data_detail = [...data_received]
        if (_.isEmpty(data.data)) {
          for (let i = 0; i < new_data_detail.length; i++) {
            let r = new_data_detail[i]
            r.shard_no = 0
            r.group_no = 0
            r.note = ''
            r.end_date = moment(new Date()).format(formatDate.shortType)
            r.start_date = moment(new Date()).format(formatDate.shortType)
            let details = []
            for (let j = 0; j < 3; j++) {
              details.push(this.createDataNewRow(j))
            }
            r.details = details
            new_data_detail[i] = r
          }
          this.setState({ data_detail: new_data_detail, isUpdate: false })
        } else {
          for (let i = 0; i < new_data_detail.length; i++) {
            const find_shard = _.find(data.data, { _id: new_data_detail[i]._id })
            if (find_shard) {
              new_data_detail[i].shard_no = find_shard.shard_no
              new_data_detail[i].group_no = find_shard.group_no
              new_data_detail[i].note = find_shard.note

              if (find_shard.start_date) {
                const start_date = moment(new Date(find_shard.start_date)).format(
                  formatDate.shortType,
                )
                new_data_detail[i].start_date = start_date
              }
              if (find_shard.end_date) {
                const end_date = moment(new Date(find_shard.end_date)).format(formatDate.shortType)
                new_data_detail[i].end_date = end_date
              }

              let details = [...find_shard.details]
              for (let j = 0; j < details.length; j++) {
                details[j].detail_stt = j + 1
              }
              new_data_detail[i].details = details
            }
            this.setState({ data_detail: new_data_detail, isUpdate: true })
          }
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_detail: [] })
      })
  }

  createDataNewRow = i => {
    return {
      detail_stt: i + 1,
      _id: uuidv1(),
      roll_no: 0,
      met_no: 0,
      group_no_detail: 0,
      detail_note: '',
    }
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

  onCellDetailChange = (dataIndex, row_index, fabricshard_id) => {
    return value => {
      const data_detail = [...this.state.data_detail]
      const target = data_detail.find(item => item._id === fabricshard_id)
      if (target) {
        target.details[row_index][dataIndex] = value
        this.setState({ data_detail })
      }
    }
  }

  onNewRow = e => {
    if (e.target) {
      let fabricshard_id = e.target.value
      if (fabricshard_id) {
        const data_detail = [...this.state.data_detail]
        const row_index = _.findIndex(data_detail, { _id: fabricshard_id })
        if (row_index >= 0) {
          const target = data_detail[row_index]
          if (target) {
            let new_item = this.createDataNewRow(target.details.length)
            target.details.push(new_item)
            data_detail[row_index] = target
            this.setState({ data_detail })
          }
        }
      }
    }
  }

  render() {
    const columns = [
      { title: 'TYPE', dataIndex: 'fabric_type', key: 'fabric_type' },
      { title: 'COLOR', dataIndex: 'fabric_color', key: 'fabric_color' },
      { title: 'ROLL #', dataIndex: 'roll', key: 'roll' },
      { title: 'MET #', dataIndex: 'met', key: 'met' },
      { title: 'ORDER #', dataIndex: 'orderid', key: 'orderid' },
      {
        title: 'SHARDING #',
        dataIndex: 'shard_no',
        key: 'shard_no',
        render: (text, record, index) => (
          <EditableNumberCell value={text} onChange={this.onCellChange(record.key, 'shard_no')} />
        ),
      },
      {
        title: 'GROUP #',
        dataIndex: 'group_no',
        key: 'group_no',
        render: (text, record, index) => (
          <EditableNumberCell value={text} onChange={this.onCellChange(record.key, 'group_no')} />
        ),
      },
      {
        title: 'NOTE',
        dataIndex: 'note',
        key: 'note',
        render: (text, record, index) => (
          <EditableInputCell value={text} onChange={this.onCellChange(record.key, 'note')} />
        ),
      },
      {
        title: 'START TIME',
        dataIndex: 'start_date',
        key: 'start_date',
        render: (text, record, index) => (
          <EditableDateCell value={text} onChange={this.onCellChange(record.key, 'start_date')} />
        ),
      },
      {
        title: 'END TIME',
        dataIndex: 'end_date',
        key: 'end_date',
        render: (text, record, index) => (
          <EditableDateCell value={text} onChange={this.onCellChange(record.key, 'end_date')} />
        ),
      },
    ]
    const { data_detail, data_parent } = this.state
    const multiDataSet = exportDataset(data_detail, data_parent)
    const filename = data_parent.declare_no + '-colorshard-' + moment().format('MMDDYYYYhhmmss')
    const expandedRowRender = r => {
      const fabricshard_id = r._id
      const columns = [
        { title: 'STT', dataIndex: 'detail_stt', key: 'detail_stt' },
        {
          title: 'ROLL #',
          dataIndex: 'roll_no',
          key: 'roll_no',
          render: (text, record, index) => (
            <EditableNumberCell
              value={text}
              onChange={this.onCellDetailChange('roll_no', index, fabricshard_id)}
            />
          ),
        },
        {
          title: 'MET #',
          dataIndex: 'met_no',
          key: 'met_no',
          render: (text, record, index) => (
            <EditableNumberCell
              value={text}
              onChange={this.onCellDetailChange('met_no', index, fabricshard_id)}
            />
          ),
        },
        {
          title: 'GROUP #',
          dataIndex: 'group_no_detail',
          key: 'group_no_detail',
          render: (text, record, index) => (
            <EditableNumberCell
              value={text}
              onChange={this.onCellDetailChange('group_no_detail', index, fabricshard_id)}
            />
          ),
        },
        {
          title: 'NOTE',
          dataIndex: 'detail_note',
          key: 'detail_note',
          render: (text, record, index) => (
            <EditableInputCell
              value={text}
              onChange={this.onCellDetailChange('detail_note', index, fabricshard_id)}
            />
          ),
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
                value={fabricshard_id}
                onClick={this.onNewRow}
              >
                New row
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
          // rowClassName={(record, index) => {
          //   return index % 2 === 0 ? 'even-row' : 'old-row'
          // }}
        />
      </Form>
    )
  }
}

export default TestFabricColorShard
