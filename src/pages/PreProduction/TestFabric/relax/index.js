import React, { Component } from 'react'
import { Table, Form, Button, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formItemLayout, tailFormItemLayout } from '../../../Common/FormStyle'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import _ from 'lodash'

const test_fabric_relax_get_link = '/api/testfabric/relax/get'

class TestFabricRelax extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_detail: [],
      data_detail_id: [],
      data_relax: []
    }
  }
  componentWillReceiveProps = nextProps => {
    console.log('TestFabricRelax componentWillReceiveProps =>' + JSON.stringify(nextProps))

    let arr_id = []
    _.forEach(nextProps.data, (r) => {
      arr_id.push(r._id)
      // console.log(r._id);
    })
    this.setState({ data_detail: nextProps.data, data_detail_id: arr_id })

    console.log('arr_id =>' + JSON.stringify(arr_id))
  }

  loadtestfabricrelax = (arr_id) => {
    // load du lieu cua xa vai
    const { data_detail_id } = this.state
    console.log(' componentDidMount data_detail_id =>' + JSON.stringify(data_detail_id))
    axios
      .get(test_fabric_relax_get_link, { params: { data_detail_id } })
      .then(res => {
        let data = res.data
        console.log(data);
        //this.setState({ fabrictype_data: data_uni })
      })
      .catch(err => {
        console.log(err)
        this.setState({ fabrictype_data: [] })
      })
  }


  componentDidMount = () => {
    const { data_detail_id } = this.state
    this.loadtestfabricrelax(data_detail_id);
  }

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const data_detail = [...this.state.data_detail];
      const target = data_detail.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ data_detail });
      }
    };
  }

  onAddNewRowForDetail = (index) => {
    const { data_relax } = this.state
    if (index <= data_relax.length) {
      let details = data_relax[index].details
      if (details) {
        let detail_size = details.length
        let new_row = { stt_detail: (detail_size + 1), no_roll: 0, no_met: 0, note: '', _id: details._id }
        data_relax[index] = details
        this.setState({ data_relax })
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
        key: 'relax', dataIndex: 'relax', title: 'RELAX', name: 'RELAX', render: (text, record) => (
          <EditableNumberCell
            value={text}
            onChange={this.onCellChange(record.key, 'relax')}
          />
        )
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
        )
      },
      {
        key: 'note', dataIndex: 'note', title: 'NOTE', name: 'NOTE', render: (text, record) => (
          <EditableInputCell
            value={text}
            onChange={this.onCellChange(record.key, 'note')}
          />
        )
      },
      {
        key: 'start_date', dataIndex: 'start_date', title: 'START DATE', name: 'START DATE', render: (text, record) => (
          <EditableDateCell
            value={text}
            onChange={this.onCellChange(record.key, 'start_date')}
          />
        )
      },
      { key: 'end_date', dataIndex: 'end_date', title: 'END DATE', name: 'END DATE' },
    ]


    const expandedRowRender = (r) => {
      console.log(r)
      const columns = [
        {
          title: 'NO.ROLL', dataIndex: 'no_roll', key: 'no_roll', render: (text, record) => (
            <EditableNumberCell
              value={text}
              onChange={this.onCellChange(record.key, 'no_roll')}
            />
          )
        },
        {
          title: 'MET', dataIndex: 'no_met', key: 'no_met', render: (text, record) => (
            <EditableNumberCell
              value={text}
              onChange={this.onCellChange(record.key, 'no_met')}
            />
          )
        },
        {
          title: 'NOTE', dataIndex: 'detail_note', key: 'detail_note', render: (text, record) => (
            <EditableInputCell
              value={text}
              onChange={this.onCellChange(record.key, 'detail_note')}
            />
          )
        },

      ]
      const data = []
      return (
        <div>
          <Row gutter={8}>
            <Col>
              <Button type='primary' size='small'>NEW ROW</Button>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col xs={{ span: 12 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
              xl={{ span: 6 }}>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      );
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
          dataSource={this.state.data_detail}
          expandedRowRender={expandedRowRender}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? 'even-row' : 'old-row'
          }}
        />
      </Form>
    )
  }
}

export default TestFabricRelax
