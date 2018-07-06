import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import { Table } from 'antd'

const masterColumns = [
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
    dataIndex: 'roll',
    key: 'roll',
  },
]

const detailColumns = [
  {
    title: 'SHARD #',
    dataIndex: 'shard',
    key: 'shard',
  },
  {
    title: 'GROUP #',
    dataIndex: 'group',
    key: 'group',
  },
  {
    title: 'NOTE',
    dataIndex: 'note',
    key: 'note',
  },
  {
    title: 'BEGIN TIME',
    dataIndex: 'begin',
    key: 'begin',
  },
  {
    title: 'END TIME',
    dataIndex: 'end',
    key: 'begin',
  },
]

const masterData = [
  {
    _id: '5b36ee02aadeea3bd87576f8',
    note: '11',
    create_date: '2018-06-30T08:57:05.226+07:00',
    update_date: null,
    record_status: 'O',
    orderid: 11,
    fabric_type: 'TYPE 1',
    fabric_color: 'CO2',
    met: 11,
    roll: '11',
    importid: '5b36ee02aadeea3bd87576f6',
    __v: 0,
  },
  {
    _id: '5b3738af055dbf3958965adb',
    note: '1',
    create_date: '2018-06-30T10:12:15.761+07:00',
    update_date: null,
    record_status: 'O',
    orderid: 1,
    fabric_type: 'TYPE 1',
    fabric_color: 'CO1',
    met: 1,
    roll: '1',
    importid: '5b3738af055dbf3958965ad9',
    __v: 0,
  },
  {
    _id: '5b3d95f9adbd573ad054c0d9',
    note: '',
    create_date: '2018-07-05T10:45:36.763+07:00',
    update_date: null,
    record_status: 'O',
    orderid: 1,
    fabric_type: 'TYPE 1',
    fabric_color: 'CO1',
    met: 10000,
    roll: '200',
    importid: '5b3d95f9adbd573ad054c0d7',
    __v: 0,
  },
]

class ColorShard extends Component {
  static defaultProps = {
    pathName: 'Color Shard',
  }

  render() {
    const props = { ...this.props }

    return (
      <Page {...props}>
        <Helmet title="Color Shard" />
        <section className="card">
          <div className="card-body">
            <Table columns={masterColumns} dataSource={masterData} size="small" />
          </div>
        </section>
      </Page>
    )
  }
}

export default ColorShard
