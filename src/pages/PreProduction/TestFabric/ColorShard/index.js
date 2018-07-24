import React, { Component } from 'react'
import { Table, Button, Form, Icon, Row, Col } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import axios from '../../../../axiosInst'

import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formatDate } from '../../../Common/formatdate'

const uuidv1 = require('uuid/v1')

const test_fabric_colorshard_get = '/api/testfabric/colorshard/get'

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
            r.met_no = 0
            r.roll_no = 0
            r.shard_no = 0
            r.group_no = ''
            r.note = ''
            r.end_date = moment(new Date()).format(formatDate.shortType)
            r.start_date = moment(new Date()).format(formatDate.shortType)
            let details = []
            for (let j = 0; j < 5; j++) {
              details.push(this.createDataNewRow(j))
            }
            r.details = details
            new_data_detail[i] = r
          }
          this.setState({ data_detail: new_data_detail, isUpdate: false })
        } else {
          console.log('co data')
          for (let i = 0; i < new_data_detail.length; i++) {
            const find_shard = _.find(data.data, { _id: new_data_detail[i]._id })
            new_data_detail[i].test_no = find_shard.test_no
            new_data_detail[i].fail_no = find_shard.fail_no
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
  render() {
    const columns = [
      {
        title: 'TYPE',
        dataIndex: 'fabric_type',
        key: 'fabric_type',
      },
      {
        title: 'COLOR',
        dataIndex: 'fabric_color',
        key: 'fabric_color',
      },
      {
        title: 'ROLL #',
        dataIndex: 'roll_no',
        key: 'roll_no',
        render: (text, record, index) => (
          <EditableNumberCell value={text} onChange={this.onCellChange(record.key, 'test_no')} />
        ),
      },
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
    const { data_detail } = this.state

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
              <Button icon="plus" type="primary" size="small">
                NEW ROW
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
        <Table
          rowKey={'_id'}
          size="small"
          bordered
          style={{ marginTop: '5px' }}
          columns={columns}
          pagination={false}
          dataSource={data_detail}
          expandedRowRender={expandedRowRender}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? 'even-row' : 'old-row'
          }}
        />
      </Form>
    )
  }
}

export default TestFabricColorShard
