import React, { Component } from 'react'
import { Table, Button, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formItemLayout, tailFormItemLayout } from '../../../Common/FormStyle'

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

      loadtestfabricrelax_done: false,
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
    let { data_received, data_detail_id } = this.state
    console.log(this.state)
    this.loadtestfabricrelax(data_received, data_detail_id)
  }

  componentWillUnmount = () => {
    this.setState({ loadtestfabricrelax_done: true })
  }

  loadtestfabricrelax = (data_received, data_detail_id) => {
    axios
      .get(test_fabric_relax_get_link, { params: { detail_ids: data_detail_id } })
      .then(res => {
        let data = res.data
        let new_data_detail = [...data_received]
        let isUpdate = false
        if (_.isEmpty(data.data)) {
          for (let i = 0; i < new_data_detail.length; i++) {
            let r = new_data_detail[i]
            r.relax = 0
            r.condition_hours = 0
            r.start_date = moment(new Date()).format('MM/DD/YYYY')
            r.end_date = moment(new Date()).format('MM/DD/YYYY')
            let details = []
            for (let j = 0; j < 5; j++) {
              details.push({
                _id: uuidv1(),
                detail_stt: j + 1,
                no_roll: 0,
                no_met: 0,
                note: '',
                fabricrelax_id: r._id,
              })
            }
            r.fabric_relax_detail_id = details
            new_data_detail[i] = r
          }
        } else {
          for (let i = 0; i < new_data_detail.length; i++) {
            let r = new_data_detail[i]
            let find_relax = _.find(data.data, { fabricimportdetail_id: r._id })
            //console.log('find_relax  result =' + JSON.stringify(find_relax))
            if (find_relax) {
              r.relax = find_relax.relax
              r.condition_hours = find_relax.condition_hours
              r.note = find_relax.note
              r.end_date = moment(find_relax.end_date).format('MM/DD/YYYY')
              r.start_date = moment(find_relax.start_date).format('MM/DD/YYYY')
            }
            r.fabric_relax_detail_id = find_relax.fabric_relax_detail_id
            new_data_detail[i] = r
          }
          isUpdate = true
        }
        this.setState({ data_detail: new_data_detail, loadtestfabricrelax_done: true, isUpdate })
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_detail: [], loadtestfabricrelax_done: true })
      })
  }

  onCellChange = (key, dataIndex) => {
    console.log('onCellChange call')
    return value => {
      console.log('date value changed =' + value)

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

  onAddNewRowForDetail = index => {
    const { data_relax } = this.state
    if (index <= data_relax.length) {
      let details = data_relax[index].details
      if (details) {
        let detail_size = details.length
        let new_row = {
          stt_detail: detail_size + 1,
          no_roll: 0,
          no_met: 0,
          note: '',
          fabricrelax_id: details._id,
        }
        data_relax[index] = details
        this.setState({ data_relax })
      }
    }
  }

  onPanelChange = (value, mode) => {
    console.log('value =' + value + ',mode =' + mode)
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
      // console.log('fabricrelax_id ='+ JSON.stringify(r))
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

export default TestFabricRelax
