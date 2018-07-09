import React, { Component } from 'react'
import { Table } from 'antd'

class TestFabricRelax extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_detail: [],
    }
  }
  componentWillReceiveProps = nextProps => {
    //console.log('TestFabricRelax componentWillReceiveProps =>' + JSON.stringify(nextProps))
    this.setState({ data_detail: nextProps.data })
  }
  render() {
    const columns = [
      { key: 'fabric_type', dataIndex: 'fabric_type', title: 'TYPE', name: 'TYPE' },
      { key: 'fabric_color', dataIndex: 'fabric_color', title: 'COLOR', name: 'COLOR' },
      { key: 'roll', dataIndex: 'roll', title: 'ROLL', name: 'ROLL' },
      { key: 'met', dataIndex: 'met', title: 'MET', name: 'MET' },
      { key: 'relax', dataIndex: 'relax', title: 'RELAX', name: 'RELAX' },
      {
        key: 'condition_hours',
        dataIndex: 'condition_hours',
        title: 'CONDITIONS(H)',
        name: 'CONDITIONS(H)',
      },
      { key: 'note', dataIndex: 'note', title: 'NOTE', name: 'NOTE' },
      { key: 'start_date', dataIndex: 'start_date', title: 'START DATE', name: 'START DATE' },
      { key: 'end_date', dataIndex: 'end_date', title: 'END DATE', name: 'END DATE' },
    ]
    return (
      <Table
        rowKey={'_id'}
        size="small"
        bordered
        style={{ marginTop: '5px' }}
        columns={columns}
        pagination={false}
        dataSource={this.state.data_detail}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? 'even-row' : 'old-row'
        }}
      />
    )
  }
}

export default TestFabricRelax
