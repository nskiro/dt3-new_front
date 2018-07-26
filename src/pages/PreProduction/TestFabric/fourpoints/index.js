import React, { Component } from 'react'
import { Table, Form, Row, Col, Button } from 'antd'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
//import EditableDateCell from '../../../Common/editabledatecell'
import _ from 'lodash'
import moment from 'moment'

import { formatDate } from '../../../Common/formatdate'
const uuidv1 = require('uuid/v1')

const test_fabric_fourpoint = '/api/testfabric/fourpoint/get'

class TestFabricFourPoint extends Component {
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
      return nextState
    }
    return null
  }

  componentDidMount = () => {
    let { data_received, data_detail_id } = this.state
    this.loadtestfabricfourpoint(data_received, data_detail_id)
  }

  loadtestfabricfourpoint = (data_received, data_detail_id) => {
    axios
      .get(test_fabric_fourpoint, { params: { _ids: data_detail_id } })
      .then(res => {
        let data = res.data
        let new_data_detail = [...data_received]
        if (_.isEmpty(data.data)) {
          console.log('four point khong co data')

          for (let i = 0; i < new_data_detail.length; i++) {
            let r = new_data_detail[i]
            r.test_no = 0
            r.fail_no = 0
            r.note = ''
            r.color_dif = '0/0'
            r.end_date = moment().format(formatDate.shortType)
            r.start_date = moment().format(formatDate.shortType)
            let details = []
            for (let j = 0; j < 2; j++) {
              details = details.concat(this.createDataNewRow(j))
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
            new_data_detail[i].color_dif = find_weight.color_dif
            new_data_detail[i].note = find_weight.note

            let details = [...find_weight.details]
            let current_stt = 0
            for (let j = 0; j < details.length; j++) {
              if (j % 4 === 0) {
                current_stt += 1
              }
              details[j].detail_stt = current_stt
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
    let rows = []

    for (let j = 0; j < 4; j++) {
      let r = {
        detail_stt: i + 1,
        _id: uuidv1(),
        no_roll: 0,
        length_stick: 0,
        length_actual: 0,

        yard_actual: 0,
        width_stick: 0,
        width_actual: 0,
        slub_nep: 0,
        fly_spot: 0,
        hole_spliy: 0,
        stain_oil: 0,
        vline: 0,
        bare: 0,
        crease_mark: 0,
        uneven_dyed: 0,
        total_point: 0,
        defective_point: 0,
        result: '',
        detail_note: '',
        photo_defect: '',
      }

      switch (j) {
        case 0:
          r.points = '1 (defect 0-3")'
          break

        case 1:
          r.points = '2 (defect 3-6")'
          break

        case 2:
          r.points = '3 (defect 6-9")'
          break

        case 3:
          r.points = '4 (defect >9")'
          break
        default:
      }

      rows.push(r)
    }
    return rows
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

  render() {
    const columns = [
      { key: 'fabric_type', dataIndex: 'fabric_type', title: 'TYPE', name: 'TYPE' },
      { key: 'fabric_color', dataIndex: 'fabric_color', title: 'COLOR', name: 'COLOR' },
      { key: 'roll', dataIndex: 'roll', title: 'ROLL', name: 'ROLL' },
      { key: 'met', dataIndex: 'met', title: 'MET', name: 'MET' },
      {
        key: 'inspect_no',
        dataIndex: 'inspect_no',
        title: 'INSPECT #',
        render: (text, record) => (
          <EditableNumberCell value={text} onChange={this.onCellChange(record.key, 'test_no')} />
        ),
      },
      {
        key: 'fail_no',
        dataIndex: 'fail_no',
        title: 'FAIL #',
        render: (text, record) => (
          <EditableNumberCell value={text} onChange={this.onCellChange(record.key, 'fail_no')} />
        ),
      },
      {
        key: 'color_dif',
        dataIndex: 'color_dif',
        title: 'COLOR DIF',
        render: (text, record) => (
          <EditableInputCell value={text} onChange={this.onCellChange(record.key, 'color_dif')} />
        ),
      },
      {
        key: 'note',
        dataIndex: 'note',
        title: 'NOTE',
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
          <EditableInputCell value={text} onChange={this.onCellChange(record.key, 'start_date')} />
        ),
      },
      {
        key: 'end_date',
        dataIndex: 'end_date',
        title: 'END DATE',
        name: 'END DATE',
        render: (text, record) => (
          <EditableInputCell value={text} onChange={this.onCellChange(record.key, 'end_date')} />
        ),
      },
    ]
    const expandedRowRender = r => {
      const fabricrelax_id = r._id

      const columns = [
        { title: 'STT', dataIndex: 'detail_stt', key: 'detail_stt' },
        {
          title: 'ROLL',
          dataIndex: 'no_roll',
          key: 'no_roll',
          render: (text, record, index) => {
            if (index % 4 === 0) {
              return (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('no_roll', index, fabricrelax_id)}
                />
              )
            } else {
              return { text }
            }
          },
        },
        {
          title: 'LENGTH (MET)',
          children: [
            {
              title: 'Sticker',
              dataIndex: 'length_stick',
              key: 'length_stick',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('length_stick', index, fabricrelax_id)}
                    />
                  )
                } else {
                  return { text }
                }
              },
            },
            {
              title: 'Actual',
              dataIndex: 'length_actual',
              key: 'length_actual',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('length_actual', index, fabricrelax_id)}
                    />
                  )
                } else {
                  return { text }
                }
              },
            },
          ],
        },
        {
          title: 'Yard',
          children: [
            {
              title: 'Actual',
              dataIndex: 'yard_actual',
              key: 'yard_actual',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('yard_actual', index, fabricrelax_id)}
                    />
                  )
                } else {
                  return { text }
                }
              },
            },
          ],
        },
        {
          title: 'WIDTH',
          children: [
            {
              title: 'Stiker',
              dataIndex: 'width_stick',
              key: 'width_stick',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('width_stick', index, fabricrelax_id)}
                    />
                  )
                } else {
                  return { text }
                }
              },
            },
            {
              title: 'Actual',
              key: 'width_actual',
              dataIndex: 'width_actual',
              render: (text, record, index) => {
                if (index % 4 === 0) {
                  return (
                    <EditableNumberCell
                      value={text}
                      onChange={this.onCellDetailChange('width_actual', index, fabricrelax_id)}
                    />
                  )
                } else {
                  return { text }
                }
              },
            },
          ],
        },

        {
          title: 'DEFECT',
          children: [
            {
              title: 'Point',
              dataIndex: 'points',
              key: 'points',
            },
            {
              title: 'Slub/Nep',
              dataIndex: 'slub_nep',
              key: 'slub_nep',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('slub_nep', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Fly/Spot',
              dataIndex: 'fly_spot',
              key: 'fly_spot',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('fly_spot', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Hole/Split',
              dataIndex: 'hole_spliy',
              key: 'hole_spliy',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('hole_spliy', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Stain/Oil',
              dataIndex: 'stain_oil',
              key: 'stain_oil',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('stain_oil', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'V.Line',
              dataIndex: 'vline',
              key: 'vline',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('vline', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Bare',
              dataIndex: 'bare',
              key: 'bare',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('bare', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Crease/Mark',
              dataIndex: 'crease_mark',
              key: 'crease_mark',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('crease_mark', index, fabricrelax_id)}
                />
              ),
            },
            {
              title: 'Uneven/Dyed',
              dataIndex: 'uneven_dyed',
              key: 'uneven_dyed',
              render: (text, record, index) => (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('uneven_dyed', index, fabricrelax_id)}
                />
              ),
            },
          ],
        },
        {
          title: 'TOTAL POINT',
          dataIndex: 'total_point',
          key: 'total_point',
          render: (text, record, index) => {
            if (index % 4 === 0) {
              return (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('total_point', index, fabricrelax_id)}
                />
              )
            } else {
              return { text }
            }
          },
        },
        {
          title: 'DEFECT POINT',
          dataIndex: 'defective_point',
          key: 'defective_point',
          render: (text, record, index) => {
            if (index % 4 === 0) {
              return (
                <EditableNumberCell
                  value={text}
                  onChange={this.onCellDetailChange('defective_point', index, fabricrelax_id)}
                />
              )
            } else {
              return { text }
            }
          },
        },
        {
          title: 'RESULT',
          dataIndex: 'result',
          key: 'result',
          render: (text, record, index) => {
            if (index % 4 === 0) {
              return (
                <EditableInputCell
                  value={text}
                  onChange={this.onCellDetailChange('result', index, fabricrelax_id)}
                />
              )
            } else {
              return { text }
            }
          },
        },
        {
          title: 'NOTE',
          dataIndex: 'detail_note',
          key: 'detail_note',
          render: (text, record, index) => {
            if (index % 4 === 0) {
              return (
                <EditableInputCell
                  value={text}
                  onChange={this.onCellDetailChange('detail_note', index, fabricrelax_id)}
                />
              )
            } else {
              return { text }
            }
          },
        },
        /*{
          title: 'PHOTO OF DEFECT',
          dataIndex: 'photo_defect',
          key: 'photo_defect',
          render: (text, record, index) => (
            <EditableInputCell
              value={text}
              onChange={this.onCellDetailChange('photo_defect', index, fabricrelax_id)}
            />
          ),
        },*/
      ]
      const data = r.details
      return (
        <div>
          <Row gutter={8}>
            <Col>
              <Button icon="plus" type="primary" size="small">
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

export default TestFabricFourPoint
