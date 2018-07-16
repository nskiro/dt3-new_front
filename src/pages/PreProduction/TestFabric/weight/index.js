import React, { Component } from 'react'
import { Table, Button, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formItemLayout, tailFormItemLayout } from '../../../Common/FormStyle'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import _ from 'lodash'
import moment from 'moment'
import { isBuffer } from 'util';
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
            isUpdate: false
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
            console.log('nextState ==' + JSON.stringify(nextState))
            return nextState
        }
        return null
    }
    /*
        shouldComponentUpdate = (nextProps, nextState) => {
            console.log('nextState.loadtestfabricweight_done =' + nextState.loadtestfabricweight_done)
            if (!this.state.loadtestfabricweight_done) {
                console.log('shouldComponentUpdate  called')
                this.loadtestfabricweight(nextState.data_received, nextState.data_detail_id)
                return true;
            }
            return false
        }
    */
    componentDidMount = () => {
        console.log('weight componentDidMount call')
        let { data_received, data_detail_id } = this.state
        console.log('weight componentDidMount this.state ' + JSON.stringify(this.state))
        this.loadtestfabricweight(data_received,data_detail_id)
    }

    loadtestfabricweight = (data_received, data_detail_id) => {
        axios
            .get(test_fabric_weight_get_link, { params: { detail_ids: data_detail_id } })
            .then(res => {
                let data = res.data
                let new_data_detail = [...data_received]
                if (_.isEmpty(data.data)) {
                    for (let i = 0; i < new_data_detail.length; i++) {
                        let r = new_data_detail[i]
                        r.test_no = 0
                        r.fail_no = 0
                        r.note = ''
                        //r.end_date =new Date()
                        // r.end_date = moment(new Date())
                        let details = []
                        for (let j = 0; j < 5; j++) {
                            details.push(this.createDataNewRow())
                        }
                        r.fabric_relax_detail_id = details
                        new_data_detail[i] = r
                    }
                    this.setState({ data_detail: new_data_detail, loadtestfabricweight_done: true ,isUpdate:false})
                }else{

                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ data_detail: [], loadtestfabricweight_done: true })
            })
    }

    createDataNewRow = () => {
        return {
            _id: uuidv1(),
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
                target.fabric_relax_detail_id[row_index][dataIndex] = value
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

            { key: 'test_no', dataIndex: 'no_test', title: 'TEST #', name: 'TEST #' },
            { key: 'fail_no', dataIndex: 'no_fail', title: 'FAIL #', name: 'FAIL #' },
            { key: 'note', dataIndex: 'note', title: 'NOTE', name: 'NOTE' },
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
                //  { title: 'STT', dataIndex: 'detail_stt', key: 'detail_stt' },
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
                    title: 'WEIGHT',
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

                    ]
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

        const { data_detail } = this.state
        console.log('data_detail =>' + JSON.stringify(data_detail))
        return (
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
        )
    }
}

export default TestFabricWeight
