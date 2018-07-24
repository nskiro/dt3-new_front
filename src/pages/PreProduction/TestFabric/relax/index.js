import React, { Component } from 'react'
import { Table, Button, Icon, Row, Col } from 'antd'
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

      isMouted: false,
      isUpdate: false,
      isNewRow: false,
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

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.state.loadtestfabricrelax_done === false) {
      this.loadtestfabricrelax(nextState.data_received, nextState.data_detail_id)
      return true
    }
    return false
  }

  componentDidMount = () => {
    this.setState({ isMouted: true })
    let { data_received, data_detail_id } = this.state
    this.loadtestfabricrelax(data_received, data_detail_id)
  }

  componentWillUnmount = () => {
    this.setState({ isMouted: false })
  }

  loadtestfabricrelax = (data_received, data_detail_id) => {
    axios
      .get(test_fabric_relax_get_link, { params: { detail_ids: data_detail_id } })
      .then(res => {
        let data = res.data
        let new_data_detail = []
        let isUpdate = false
        if (_.isEmpty(data.data)) {
          for (let i = 0; i < data_received.length; i++) {
            let d = data_received[i]
            let r = {
              _id: d._id,
              orderid: d.orderid,
              fabric_type: d.fabric_type,
              fabric_color: d.fabric_color,
              met: d.met,
              roll: d.roll,
              importid: d.importid,
              fabricimportdetail_id: d._id,
            }
            r.relax = 0
            r.note = ''
            r.condition_hours = 0
            r.start_date = moment(new Date()).format(formatDate.shortType)
            r.end_date = moment(new Date()).format(formatDate.shortType)
            let details = []
            for (let j = 0; j < 5; j++) {
              details.push({
                _id: uuidv1(),
                detail_stt: j + 1,
                no_roll: 0,
                no_met: 0,
                detail_note: '',
                fabricrelax_id: r._id,
              })
            }
            r.fabric_relax_detail_id = details
            new_data_detail.push(r)
          }
        } else {
          for (let i = 0; i < data_received.length; i++) {
            let d = data_received[i]
            let r = {
              orderid: d.orderid,
              fabric_type: d.fabric_type,
              fabric_color: d.fabric_color,
              met: d.met,
              roll: d.roll,
              importid: d.importid,
              fabricimportdetail_id: d._id,
            }
            let find_relax = _.find(data.data, { fabricimportdetail_id: r.fabricimportdetail_id })
            if (find_relax) {
              r._id = find_relax._id
              r.relax = find_relax.relax
              r.condition_hours = find_relax.condition_hours
              r.note = find_relax.note
              try {
                r.end_date = moment(new Date(find_relax.end_date)).format(formatDate.shortType)
                r.start_date = moment(new Date(find_relax.start_date)).format(formatDate.shortType)
              } catch (e) {}

              let details = []
              for (let j = 0; j < find_relax.fabric_relax_detail_id.length; j++) {
                let n_row = { ...find_relax.fabric_relax_detail_id[j] }
                n_row.detail_stt = j + 1
                details.push(n_row)
              }
              r.fabric_relax_detail_id = details
            }
            new_data_detail.push(r)
          }
          isUpdate = true
        }
        if (this.state.isMouted) {
          this.setState({ data_detail: new_data_detail, loadtestfabricrelax_done: true, isUpdate })
        }
      })
      .catch(err => {
        console.log(err)
        if (this.state.isMouted) {
          this.setState({ data_detail: [], loadtestfabricrelax_done: true })
        }
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
        target.fabric_relax_detail_id[row_index][dataIndex] = value
        this.setState({ data_detail })
      }
    }
  }

  onAddNewRowForDetail = e => {
    if (e.target.value) {
      // return () => {
      const data_detail = [...this.state.data_detail]
      const fabricrelax_id = e.target.value
      let index_row_main = _.findIndex(data_detail, { _id: fabricrelax_id })

      if (index_row_main >= 0) {
        let row_main = data_detail[index_row_main]
        let new_row = {
          _id: uuidv1(),
          detail_stt: row_main.fabric_relax_detail_id.length + 1,
          no_roll: 0,
          no_met: 0,
          detail_note: '',
          fabricrelax_id: fabricrelax_id,
        }
        row_main.fabric_relax_detail_id.push(new_row)
        data_detail[index_row_main] = row_main
        this.setState({ data_detail, isNewRow: true })
        // }
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
      const data = r.fabric_relax_detail_id

      this.setState({ isNewRow: false })
      return (
        <div>
          <Row gutter={8}>
            <Col>
              <Button
                icon="plus"
                type="primary"
                size="small"
                onClick={this.onAddNewRowForDetail}
                value={fabricrelax_id}
              >
                NEW ROW
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

export default TestFabricRelax
