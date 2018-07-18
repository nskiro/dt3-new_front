import React, { Component } from 'react'
import { Table, Button, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formItemLayout, tailFormItemLayout } from '../../../Common/FormStyle'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import _ from 'lodash'
import moment from 'moment'
const uuidv1 = require('uuid/v1')

class TestFabricSkewShrinlege extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_detail: [],
      data_detail_id: [],
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
