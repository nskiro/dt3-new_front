import React, { Component } from 'react'
import { Table, Button, Form, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formItemLayout, tailFormItemLayout } from '../../../Common/FormStyle'
import { formatDate } from '../../../Common/formatdate'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import _ from 'lodash'
import moment from 'moment'
import { isBuffer } from 'util'

const uuidv1 = require('uuid/v1')
const test_fabric_weight_get_link = '/api/testfabric/weight/get'

class TestFabricWeight extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_received: [],
      data_detail: [],
      data_detail_id: [],
      loadtestfabricweight_done: false,
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
      nextState.data_detail_id = data_detail_id
      nextState.loadtestfabricweight_done = false
      //console.log('nextState ==' + JSON.stringify(nextState))
      return nextState
    }
    return null
  }

  /*
    shouldComponentUpdate = (nextProps, nextState) => {
      //  console.log('nextState.loadtestfabricweight_done =' + nextState.loadtestfabricweight_done)
      // if (this.state.loadtestfabricweight_done) {
      console.log('nextProps =>' + JSON.stringify(nextProps))
      console.log('data_detail current=>' + JSON.stringify(this.state.data_detail))
      console.log('data_detail nextState=>' + JSON.stringify(nextState.data_detail))
      //   return true;
      // }
      if (this.state.data_detail !== nextState.data_detail) { return true }
      return false
    }
  */

  componentDidMount = () => {
    let { data_received, data_detail_id } = this.state
    this.loadtestfabricweight(data_received, data_detail_id)
  }

  loadtestfabricweight = (data_received, data_detail_id) => {
    axios
      .get(test_fabric_weight_get_link, { params: { _ids: data_detail_id } })
      .then(res => {
        let data = res.data
        let new_data_detail = [...data_received]
        if (_.isEmpty(data.data)) {
          for (let i = 0; i < new_data_detail.length; i++) {
            let r = new_data_detail[i]
            r.test_no = 0
            r.fail_no = 0
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
            if (find_weight.end_date) {
              new_data_detail[i].end_date = moment(new Date(find_weight.end_date)).format(
                formatDate.shortType,
              )
            }
            if (find_weight.start_date) {
              new_data_detail[i].start_date = moment(new Date(find_weight.start_date)).format(
                formatDate.shortType,
              )
            }
            let details = [...find_weight.details]
            for (let j = 0; j < details.length; j++) {
              details[j].detail_stt = j + 1
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

  createDataNewRow = i => {
    return {
      detail_stt: i + 1,
      _id: uuidv1(),
      no_roll: 0,
      weight: 0,
      weight_start: 0,
      weight_mid: 0,
      weight_end: 0,
      weight_note: '',
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

  onNewRow = (e) => {
    if (e.target) {
      let fabricweight_id = e.target.value
      if (fabricweight_id) {
        const data_detail = [...this.state.data_detail]
        const row_index = _.findIndex(data_detail, { _id: fabricweight_id })
        if (row_index >= 0) {
          const target = data_detail[row_index]
          if (target) {
            let new_item = this.createDataNewRow(target.details.length)
            target.details.push(new_item)
            data_detail[row_index]=target
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
          title: 'WEIGHT (KG)',
          dataIndex: 'weight',
          key: 'weight',
          render: (text, record, index) => (
            <EditableNumberCell
              value={text}
              onChange={this.onCellDetailChange('weight', index, fabricrelax_id)}
            />
          ),
        },

        {
          title: 'WEIGHT',
          children: [
            {
              title: 'START',
              dataIndex: 'weight_start',
              key: 'weight_start',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('weight_start', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'MID',
              dataIndex: 'weight_mid',
              key: 'weight_mid',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('weight_mid', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'END',
              dataIndex: 'weight_end',
              key: 'weight_end',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('weight_end', index, fabricrelax_id)}
                />
              ),
            },
          ],
        },

        {
          title: 'NOTES',
          dataIndex: 'weight_note',
          key: 'weight_note',
          render: (text, record, index) => (
            <EditableInputCell
              value={text}
              onChange={this.onCellDetailChange('weight_note', index, fabricrelax_id)}
            />
          ),
        },
      ]
      const data = r.details
      return (
        <div>
          <Row gutter={8}>
            <Col>
              <Button icon="plus" value={fabricrelax_id} type="primary" size="small" onClick={this.onNewRow}>
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
    const { data_detail } = this.state
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

export default TestFabricWeight
