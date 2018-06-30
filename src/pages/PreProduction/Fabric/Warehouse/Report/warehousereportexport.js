import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import ExcelFileSheet from 'react-data-export'
import { AutoComplete, InputNumber, Form, Button, Tabs, DatePicker, Select, Icon } from 'antd'
import ReactDataGrid from 'react-data-grid'

import RowRenderer from '../rowrenderer'
import DateFormatter from '../dateformatter'
import moment from 'moment'
import axios from '../../../../../axiosInst'
//css
import '../views.css'
const Option = Select.Option

const FormItem = Form.Item
const { ExcelFile, ExcelSheet } = ExcelFileSheet
const {  DateShortFormatter } = DateFormatter

const dateFormat = 'MM/DD/YYYY'
const button_size = 'small'
const tab_size = 'small'
const export_columns = [
    { key: 'inputdate_no', name: 'DATE', formatter: DateShortFormatter },
    { key: 'fabric_type', name: 'CODE' },
    { key: 'fabric_color', name: 'COLOR' },
    { key: 'met', name: 'MET' },
    { key: 'roll', name: 'ROLL' },
    { key: 'orderid', name: 'ORDER #' },
    { key: 'po_no', name: 'PO#' },
    { key: 'line_no', name: 'LINE#' },
    { key: 'sku', name: 'SKU' },
    { key: 'des', name: 'DESCRIPTION' },
    { key: 'qty', name: 'QTY' },
    { key: 'yield', name: 'YIELD' },
    { key: 'fab_qty', name: 'FAB_QTY' },
    { key: 'note', name: 'NOTE' },
]

class WarehouseReportExport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_types: [],
            data_colors: [],
            data_export: [],
            size: 'default',
            show_grid_result: false,
            se_data: {
                se_from_date: undefined,
                se_to_date: undefined,
                se_from_order: undefined,
                se_to_order: undefined,
                se_suppiler: undefined,
                se_type: undefined,
                se_color: undefined,
            },
        }
    }

    loadFabricTypes = () => {
        axios
            .get('api/fabric/type/get', { params: {} })
            .then(res => {
                let data = res.data
                let children = []
                let data_uni = []
                for (let i = 0; i < data.length; i++) {
                    if (data_uni.indexOf(data[i].fabrictype_name) === -1) {
                        children.push(
                            <Option key={data[i].fabrictype_name}> {data[i].fabrictype_name} </Option>,
                        )
                        data_uni.push(data[i].fabrictype_name)
                    }
                }
                this.setState({ data_types: data_uni })
                this.loadFabricColors(data_uni)
            })
            .catch(err => {
                console.log(err)
                this.setState({ data_types: [] })
            })
    }

    loadProviders = v => {
        axios
            .get('api/fabric/provider/get', { params: {} })
            .then(res => {
                let data = res.data
                let children = []
                let children_uni = []
                for (let i = 0; i < data.length; i++) {
                    if (data[i].provider_code && children_uni.indexOf(data[i].provider_code) === -1) {
                        children.push(<Option key={data[i].provider_code}>{data[i].provider_code}</Option>)
                        children_uni.push(data[i].provider_code)
                    }
                }
                this.setState({
                    data_providers: children_uni,
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({ data_providers: [] })
            })
    }

    loadFabricColors = () => {
        axios
            .get('api/fabric/color/get', { params: {} })
            .then(res => {
                let colors = res.data
                let colors_grid = []
                let data_uni = []
                for (let i = 0; i < colors.length; i++) {
                    if (data_uni.indexOf(colors[i].fabriccolor_name) === -1) {
                        colors_grid.push(
                            <Option key={colors[i].fabriccolor_name}> {colors[i].fabriccolor_name}</Option>,
                        )
                        data_uni.push(colors[i].fabriccolor_name)
                    }
                }
                this.setState({ data_colors: data_uni })
            })
            .catch(err => {
                this.setState({ data_colors: [] })
            })
    }
    componentDidMount = async () => {
        this.loadProviders()
        this.loadFabricTypes()
    }

    handleSearchExport = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            //console.log('Received values of form: ', values)
            let se_from_date = ''
            if (values.from_date) {
                se_from_date = values.from_date.format(dateFormat)
            }

            let se_to_date = ''
            if (values.to_date) {
                se_to_date = values.to_date.format(dateFormat)
            }

            let se_from_order = ''
            if (values.order_from) {
                se_from_order = values.order_from
            }

            let se_to_order = ''
            if (values.order_to) {
                se_to_order = values.order_to
            }

            let se_suppiler = ''
            if (values.provider_name) {
                se_suppiler = values.provider_name
            }

            let se_type = ''
            if (values.fabrictype_name) {
                se_type = values.fabrictype_name
            }

            let se_color = ''
            if (values.fabriccolor_name) {
                se_color = values.fabriccolor_name
            }

            //////update params
            if (values.from_date) {
                values.from_date = values.from_date.format('YYYY-MM-DD')
            }

            if (values.to_date) {
                values.to_date = values.to_date.add(1, 'days').format('YYYY-MM-DD')
            }

            axios
                .get('api/fabric/warehouse/getexports', { params: values })
                .then(res => {
                    this.setState({
                        se_data: {
                            se_from_date,
                            se_to_date,
                            se_from_order,
                            se_to_order,
                            se_suppiler,
                            se_type,
                            se_color,
                        },
                    })
                    let data = []
                    for (let i = 0; i < res.data.length; i++) {
                        let row = res.data[i]
                        for (let j = 0; j < row.details.length; j++) {
                            let detail = row.details[j]
                            data.push({
                                inputdate_no: row.inputdate_no,
                                orderid: detail.orderid,
                                fabric_type: detail.fabric_type,
                                fabric_color: detail.fabric_color,
                                po_no: detail.po_no,
                                met: detail.met,
                                roll: detail.roll,
                                line_no: detail.line_no,
                                sku: detail.sku,
                                des: detail.des,
                                qty: detail.qty,
                                yield: detail.yield,
                                fab_qty: detail.fab_qty,
                                note: detail.note,
                            })
                        }
                    }
                    this.setState({ data_export: data, show_grid_result: true })
                })
                .catch(err => {
                    console.log(err)
                    this.setState({ data_export: [] })
                })
        })
    }

    handleExportReset = () => {
        this.props.form.resetFields()
        this.setState({ data_export: [], show_grid_result: false })
    }
    rowExportGetter = i => {
        if (i >= 0 && i < this.state.data_export.length) {
            return this.state.data_export[i]
        }
        return null
    }

    exportDataset = () => {
        let dataset = []
        dataset.push({
            xSteps: 2,
            ySteps: 0,
            columns: ['BÁO CÁO XUẤT VẢI'],
            data: [[]],
        })

        let conditions = {
            xSteps: 0,
            ySteps: 0,
            columns: ['', '', '', '', ''],
        }

        let se_data = this.state.se_data

        let conditions_data = []
        conditions_data.push(['FROM DATE', se_data.se_from_date, '', 'TO DATE', se_data.se_to_date])
        conditions_data.push([
            'FROM ORDER #',
            se_data.se_from_order,
            '',
            'TO ORDER #',
            se_data.se_to_order,
        ])
        conditions_data.push(['SUPPILER', se_data.se_suppiler, '', 'CODE', se_data.se_type])
        conditions_data.push(['COLOR', se_data.se_color, '', '', ''])

        conditions.data = conditions_data
        dataset.push(conditions)

        let data = {
            xSteps: 0,
            ySteps: 2,
            columns: [
                'DATE',
                'ORDER #',
                'CODE',
                'COLOR',
                'MET',
                'ROLL',
                'PO',
                'LINE',
                'SKU',
                'DESCRIPTION',
                'QTY',
                'YIELD',
                'FAB_QTY',
                'NOTE',
            ],
        }

        let data_row = []

        for (let i = 0; i < this.state.data_export.length; i++) {
            let row = []
            let r = this.state.data_export[i]
            let d = moment(r.inputdate_no)
            row.push(d.format('MM/DD/YYYY'))
            row.push(r.orderid)
            row.push(r.fabric_type)
            row.push(r.fabric_color)
            row.push(r.met)
            row.push(r.roll)
            row.push(r.po_no)
            row.push(r.line_o)
            row.push(r.sku)
            row.push(r.des)
            row.push(r.qty)
            row.push(r.yield)
            row.push(r.fab_qty)
            row.push(r.note)

            data_row.push(row)
        }
        data.data = data_row
        dataset.push(data)
        //console.log(dataset)
        return dataset
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { size } = 'default'

        return (
            <div>
                <Form className="ant-advanced-search-panel " onSubmit={this.handleSearchExport}>
                    <Grid>
                        <Row className="show-grid">
                            <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                                <FormItem label={'FROM ORDER #'}>
                                    {getFieldDecorator('order_from', {})(
                                        <InputNumber name="order_from" placeholder="from order no" />,
                                    )}
                                </FormItem>
                                <FormItem label={'TO ORDER #'}>
                                    {getFieldDecorator('order_to', {})(
                                        <InputNumber name="order_to" placeholder="to oder no" />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                                <FormItem label={'FROM DATE'}>
                                    {getFieldDecorator('from_date', {})(
                                        <DatePicker size={size} format={dateFormat} />,
                                    )}
                                </FormItem>
                                <FormItem label={'TO DATE'}>
                                    {getFieldDecorator('to_date', {})(<DatePicker size={size} format={dateFormat} />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                                <FormItem label={'SUPPILERS'}>
                                    {getFieldDecorator('provider_name', {})(
                                        <AutoComplete
                                            placeholder="nhà cung cấp"
                                            dataSource={this.state.data_providers}
                                            filterOption={(inputValue, option) =>
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />,
                                    )}
                                </FormItem>
                                <FormItem label={'TYPE '}>
                                    {getFieldDecorator('fabric_type', {})(
                                        <AutoComplete
                                            placeholder="loại vải"
                                            dataSource={this.state.data_types}
                                            filterOption={(inputValue, option) =>
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                                <FormItem label={'COLOR '}>
                                    {getFieldDecorator('fabric_color', {})(
                                        <AutoComplete
                                            placeholder="màu vải"
                                            dataSource={this.state.data_colors}
                                            filterOption={(inputValue, option) =>
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                                <Button icon="search" size={button_size} type="primary" htmlType="submit">
                                    SEARCH
                  </Button>
                                <Button
                                    icon="sync"
                                    size={button_size}
                                    style={{ marginLeft: 8 }}
                                    onClick={this.handleExportReset}
                                >
                                    CLEAR
                  </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
                {this.state.show_grid_result === true ? (
                    <div>
                        <div className="ant-advanced-toolbar">
                            <ExcelFile
                                element={
                                    <Button icon="export" size={button_size} type="primary">
                                        Download Data
                    </Button>
                                }
                                filename={'Export - ' + moment().format('MM/DD/YYYY h:mm:ss')}
                            >
                                <ExcelSheet dataSet={this.exportDataset()} name="Export" />
                            </ExcelFile>
                        </div>
                        <ReactDataGrid
                            enableCellSelect={true}
                            resizable={true}
                            columns={export_columns}
                            rowGetter={this.rowExportGetter}
                            rowsCount={this.state.data_export.length}
                            minHeight={290}
                            rowRenderer={RowRenderer}
                        />
                    </div>
                ) : null}
            </div>
        )
    }
}

export default WarehouseReportExport