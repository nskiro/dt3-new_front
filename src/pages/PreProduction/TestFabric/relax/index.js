import React, { Component } from 'react'
import { Table, Button, Form, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'

import { formatDate } from '../../../Common/formatdate'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import _ from 'lodash'
import moment from 'moment'
import { isBuffer } from 'util'

const uuidv1 = require('uuid/v1')
const test_fabric_relax_get_link = '/api/testfabric/relax/get'

class TestFabricRelax extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_received: [],
      data_detail_id: [],
      data_detail: [],
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
      nextState.loadtestfabricrelax_done = false
      return nextState
    }
    return null
  }

  componentDidMount = () => {
    let { data_received, data_detail_id } = this.state
    this.loadtestfabricrelax(data_received, data_detail_id)
  }

  loadtestfabricrelax = (data_received, data_detail_id) => {
    axios
      .get(test_fabric_relax_get_link, { params: { detail_ids: data_detail_id } })
      .then(res => {
        let data = res.data
        let new_data_detail = [...data_received]
        if (_.isEmpty(data.data)) {
          for (let i = 0; i < data_received.length; i++) {
            let r = data_received[i]
            r.relax = 0
            r.note = ''
            r.condition_hours = 0
            r.start_date = moment(new Date()).format(formatDate.shortType)
            r.end_date = moment(new Date()).format(formatDate.shortType)
            let details = []
            for (let j = 0; j < 3; j++) {
              details.push(this.createDataNewRow(j))
            }
            r.details = details
            new_data_detail[i] = r
          }
        } else {
          for (let i = 0; i < new_data_detail.length; i++) {
            let find_relax = _.find(data.data, { _id: new_data_detail[i]._id })
            if (find_relax) {
              new_data_detail[i].relax = find_relax.relax
              new_data_detail[i].condition_hours = find_relax.condition_hours
              new_data_detail[i].note = find_relax.note
              if (find_relax.end_date) {
                new_data_detail[i].end_date = moment(new Date(find_relax.end_date)).format(
                  formatDate.shortType,
                )
              }

              if (find_relax.start_date) {
                new_data_detail[i].start_date = moment(new Date(find_relax.start_date)).format(
                  formatDate.shortType,
                )
              }

              let details = [...find_relax.details]
              for (let j = 0; j < details.length; j++) {
                details[j].detail_stt = j + 1
              }
              new_data_detail[i].details = details
            }
          }
        }

        this.setState({ data_detail: new_data_detail, loadtestfabricrelax_done: true })
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_detail: [], loadtestfabricrelax_done: true })
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

  createDataNewRow = i => {
    return {
      _id: uuidv1(),
      detail_stt: i + 1,
      no_roll: 0,
      no_met: 0,
      detail_note: '',
    }
  }

  onNewRow = e => {
    if (e.target) {
      let fabricrelax_id = e.target.value
      if (fabricrelax_id) {
        const data_detail = [...this.state.data_detail]
        const row_index = _.findIndex(data_detail, { _id: fabricrelax_id })
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
      { key: 'fabric_type', dataIndex: 'fabric_type', title: 'TYPE', name: 'TYPE' },
      { key: 'fabric_color', dataIndex: 'fabric_color', title: 'COLOR', name: 'COLOR' },
      { key: 'roll', dataIndex: 'roll', title: 'ROLL', name: 'ROLL' },
      { key: 'met', dataIndex: 'met', title: 'MET', name: 'MET' },
      {
        key: 'relax',
        dataIndex: 'relax',
        title: 'RELAX',
        name: 'RELAX',
        render: (text, record) => (
          <EditableNumberCell value={text} onChange={this.onCellChange(record.key, 'relax')} />
        ),
      },
      {
        key: 'condition_hours',
        dataIndex: 'condition_hours',
        title: 'CONDITIONS(H)',
        name: 'CONDITIONS(H)',
        render: (text, record) => (
          <EditableNumberCell
            value={text}
            onChange={this.onCellChange(record.key, 'condition_hours')}
          />
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
    const { data_detail } = this.state

    const expandedRowRender = r => {
      const fabricrelax_id = r._id
      const columns = [
        { title: 'STT', dataIndex: 'detail_stt', key: 'detail_stt' },
        {
          title: 'NO.ROLL',
          dataIndex: 'no_roll',
          key: 'no_roll',
          render: (text, record, index) => (
            <EditableNumberCell
              value={text}
              onChange={this.onCellDetailChange('no_roll', index, fabricrelax_id)}
            />
          ),
        },
        {
          title: 'MET',
          dataIndex: 'no_met',
          key: 'no_met',
          render: (text, record, index) => (
            <EditableNumberCell
              value={text}
              onChange={this.onCellDetailChange('no_met', index, fabricrelax_id)}
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
              onChange={this.onCellDetailChange('detail_note', index, fabricrelax_id)}
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
                value={fabricrelax_id}
                onClick={this.onNewRow}
              >
                New row
              </Button>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Table
                rowKey={'_id'}
                size="small"
                bordered
                style={{ marginTop: '5px' }}
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
          ////   return index % 2 === 0 ? 'even-row' : 'old-row'
          // }}
        />
      </Form>
    )
  }
}

export default TestFabricRelax
