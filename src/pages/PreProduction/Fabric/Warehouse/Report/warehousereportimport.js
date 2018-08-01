import React, { Component } from 'react'
import ReactExport from 'react-data-export'
import { AutoComplete, InputNumber, Form, Button, DatePicker, Select, Table, Row, Col } from 'antd'
import moment from 'moment'
import axios from '../../../../../axiosInst'
import { formItemLayout, tailFormItemLayout } from '../../../../Common/FormStyle'

//css
import '../views.css'

const Option = Select.Option
const FormItem = Form.Item
const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
//const { ExcelFile, ExcelSheet } = ExcelFileSheet

const FORMAT_SHORT_DATE = 'MM/DD/YYYY'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'
const button_size = 'small'

class WarehouseReportImport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_import: [],
      data_providers: [],
      data_types: [],
      show_grid_result: false,
      si_data: {
        si_from_date: undefined,
        si_to_date: undefined,
        si_from_order: undefined,
        si_to_order: undefined,
        si_suppiler: undefined,
        si_type: undefined,
        si_color: undefined,
      },
    }
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
          if (colors[i].fabriccolor_name) {
            if (data_uni.indexOf(colors[i].fabriccolor_name) === -1) {
              colors_grid.push(
                <Option key={colors[i].fabriccolor_name}> {colors[i].fabriccolor_name}</Option>,
              )
              data_uni.push(colors[i].fabriccolor_name)
            }
          }
        }
        this.setState({ data_colors: data_uni })
      })
      .catch(err => {
        this.setState({ data_colors: [] })
      })
  }

  loadFabricTypes = () => {
    axios
      .get('api/fabric/type/get', { params: {} })
      .then(res => {
        let data = res.data
        let children = []
        let data_uni = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].fabrictype_name) {
            if (data_uni.indexOf(data[i].fabrictype_name) === -1) {
              children.push(
                <Option key={data[i].fabrictype_name}> {data[i].fabrictype_name} </Option>,
              )
              data_uni.push(data[i].fabrictype_name)
            }
          }
        }
        this.setState({ data_types: data_uni })
        //console.log('data_types =>'+ JSON.stringify(data_uni));
        this.loadFabricColors(data_uni)
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_types: [] })
      })
  }

  handleImportReset = () => {
    this.props.form.resetFields()
    this.setState({ data_import: [], show_grid_result: false })
  }
  rowImportGetter = i => {
    if (i >= 0 && i < this.state.data_import.length) {
      return this.state.data_import[i]
    }
    return null
  }
  handleSearchImport = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      //console.log('Received values of form: ', values)
      let si_from_date = ''
      if (values.from_date) {
        si_from_date = values.from_date.format(FORMAT_SHORT_DATE)
      }

      let si_to_date = ''
      if (values.to_date) {
        si_to_date = values.to_date.format(FORMAT_SHORT_DATE)
      }

      let si_from_order = ''
      if (values.order_from) {
        si_from_order = values.order_from
      }

      let si_to_order = ''
      if (values.order_to) {
        si_to_order = values.order_to
      }

      let si_suppiler = ''
      if (values.provider_name) {
        si_suppiler = values.provider_name
      }

      let si_type = ''
      if (values.fabrictype_name) {
        si_type = values.fabrictype_name
      }

      let si_color = ''
      if (values.fabriccolor_name) {
        si_color = values.fabriccolor_name
      }

      //////update params
      if (values.from_date) {
        values.from_date = values.from_date.format('YYYY-MM-DD')
      }

      if (values.to_date) {
        values.to_date = values.to_date.add(1, 'days').format('YYYY-MM-DD')
      }

      axios
        .get('api/fabric/warehouse/getimports', { params: values })
        .then(res => {
          this.setState({
            si_data: {
              si_from_date,
              si_to_date,
              si_from_order,
              si_to_order,
              si_suppiler,
              si_type,
              si_color,
            },
          })
          let data = []
          for (let i = 0; i < res.data.length; i++) {
            let row = res.data[i]
            for (let j = 0; j < row.details.length; j++) {
              let detail = row.details[j]
              data.push({
                _id: detail._id,
                inputdate_no: row.inputdate_no,
                invoice_no: row.invoice_no,
                provider_name: row.provider_name,
                declare_no: row.declare_no,
                declare_date: row.declare_date,

                orderid: detail.orderid,
                fabric_type: detail.fabric_type,
                fabric_color: detail.fabric_color,
                met: detail.met,
                roll: detail.roll,
              })
            }
          }
          this.setState({ data_import: data, show_grid_result: true })
        })
        .catch(err => {
          console.log(err)
          this.setState({ data_import: [] })
        })
    })
  }

  importDataset = () => {
    let dataset = []
    dataset.push({
      xSteps: 2,
      ySteps: 0,
      columns: ['BÁO CÁO NHẬP VẢI'],
      data: [[]],
    })

    let conditions = {
      xSteps: 0,
      ySteps: 0,
      columns: ['', '', '', '', ''],
    }

    let si_data = this.state.si_data

    let conditions_data = []
    conditions_data.push(['FROM DATE', si_data.si_from_date, '', 'TO DATE', si_data.si_to_date])
    conditions_data.push([
      'FROM ORDER #',
      si_data.si_from_order,
      '',
      'TO ORDER #',
      si_data.si_to_order,
    ])
    conditions_data.push(['SUPPILER', si_data.si_suppiler, '', 'CODE', si_data.si_type])
    conditions_data.push(['COLOR', si_data.si_color, '', '', ''])

    conditions.data = conditions_data
    dataset.push(conditions)

    let data = {
      xSteps: 0,
      ySteps: 2,
      columns: [
        'DATE',
        'ORDER #',
        'INVOICE #',
        'SUPPLIER',
        'CODE',
        'COLOR',
        'MET',
        'ROLL',
        'STK',
        'NOTE',
      ],
    }

    let data_row = []
    for (let i = 0; i < this.state.data_import.length; i++) {
      let row = []
      let r = this.state.data_import[i]
      let d = moment(r.inputdate_no)
      row.push(d.format('MM/DD/YYYY'))
      row.push(r.orderid)
      row.push(r.invoice_no)
      row.push(r.provider_name)
      row.push(r.fabric_type)
      row.push(r.fabric_color)
      row.push(r.met)
      row.push(r.roll)
      row.push(r.declare_no)
      row.push(r.note)

      data_row.push(row)
    }
    data.data = data_row
    dataset.push(data)
    return dataset
  }

  componentDidMount = () => {
    this.loadProviders({})
    this.loadFabricColors({})
    this.loadFabricTypes({})
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const dataset = this.importDataset()
    const { size } = 'small'

    const { data_import, data_types, data_providers } = this.state
    const import_columns = [
      {
        key: 'inputdate_no',
        dataIndex: 'inputdate_no',
        title: 'DATE',
        name: 'DATE',
        render: (text, record) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_LONG_DATE)}</span>
        ),
      },
      { key: 'invoice_no', dataIndex: 'invoice_no', title: 'INVOICE #', name: 'INVOICE #' },
      { key: 'orderid', dataIndex: 'orderid', title: 'ORDER #', name: 'ORDER #' },
      { key: 'provider_name', dataIndex: 'provider_name', title: 'SUPPLIER', name: 'SUPPLIER' },
      { key: 'fabric_type', dataIndex: 'fabric_type', title: 'CODE', name: 'CODE' },
      { key: 'fabric_color', dataIndex: 'fabric_color', title: 'COLOR', name: 'COLOR' },
      { key: 'met', dataIndex: 'met', title: 'MET', name: 'MET' },
      { key: 'roll', dataIndex: 'roll', title: 'ROLL', name: 'ROLL' },
      { key: 'declare_no', dataIndex: 'declare_no', title: 'STK', name: 'STK' },
      {
        key: 'declare_date',
        dataIndex: 'declare_date',
        title: 'STK DATE',
        name: 'STK DATE',
        render: (text, record) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_SHORT_DATE)}</span>
        ),
      },
    ]

    return (
      <div>
        <Form className="ant-advanced-search-panel " onSubmit={this.handleSearchImport}>
          <div>
            <Row gutter={2}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 8 }}
                lg={{ span: 8 }}
                xl={{ span: 8 }}
              >
                <Row>
                  <FormItem {...formItemLayout} label={'FROM ORDER #'}>
                    {getFieldDecorator('order_from', {})(
                      <InputNumber
                        style={{ width: '100%' }}
                        name="order_from"
                        placeholder="from order no"
                      />,
                    )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem {...formItemLayout} label={'TO ORDER #'}>
                    {getFieldDecorator('order_to', {})(
                      <InputNumber
                        style={{ width: '100%' }}
                        name="order_to"
                        placeholder="to oder no"
                      />,
                    )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem {...formItemLayout} label={'SUPPILERS'}>
                    {getFieldDecorator('provider_name', {})(
                      <AutoComplete
                        style={{ width: '100%' }}
                        placeholder="nhà cung cấp"
                        dataSource={this.state.data_providers}
                        filterOption={(inputValue, option) =>
                          option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                          -1
                        }
                      />,
                    )}
                  </FormItem>
                </Row>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 8 }}
                lg={{ span: 8 }}
                xl={{ span: 8 }}
              >
                <Row>
                  <FormItem {...formItemLayout} label={'FROM DATE'}>
                    {getFieldDecorator('from_date', {})(
                      <DatePicker
                        style={{ width: '100%' }}
                        size={size}
                        format={FORMAT_SHORT_DATE}
                      />,
                    )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem {...formItemLayout} label={'TO DATE'}>
                    {getFieldDecorator('to_date', {})(
                      <DatePicker
                        style={{ width: '100%' }}
                        size={size}
                        format={FORMAT_SHORT_DATE}
                      />,
                    )}
                  </FormItem>
                </Row>
              </Col>

              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 8 }}
                lg={{ span: 8 }}
                xl={{ span: 8 }}
              >
                <Row>
                  <FormItem {...formItemLayout} label={'TYPE '}>
                    {getFieldDecorator('fabric_type', {})(
                      <AutoComplete
                        style={{ width: '100%' }}
                        placeholder="loại vải"
                        dataSource={this.state.data_types}
                        filterOption={(inputValue, option) =>
                          option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                          -1
                        }
                      />,
                    )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem {...formItemLayout} label={'COLOR '}>
                    {getFieldDecorator('fabric_color', {})(
                      <AutoComplete
                        style={{ width: '100%' }}
                        placeholder="màu vải"
                        dataSource={this.state.data_colors}
                        filterOption={(inputValue, option) =>
                          option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                          -1
                        }
                      />,
                    )}
                  </FormItem>
                </Row>
              </Col>
            </Row>

            <Row gutter={2}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 8 }}
                lg={{ span: 8 }}
                xl={{ span: 8 }}
              >
                <FormItem {...tailFormItemLayout}>
                  <Button icon="search" size={button_size} type="primary" htmlType="submit">
                    {' '}
                    SEARCH{' '}
                  </Button>
                  <Button
                    icon="sync"
                    size={button_size}
                    style={{ marginLeft: 8 }}
                    onClick={this.handleImportReset}
                  >
                    CLEAR
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </div>
        </Form>
        {this.state.show_grid_result === true ? (
          <div>
            <div className="ant-advanced-toolbar">
              <ExcelFile
                element={
                  <Button icon="export" size={button_size} type="primary">
                    {' '}
                    Export to Excel{' '}
                  </Button>
                }
                filename={'Import - ' + moment().format('MM/DD/YYYY h:mm:ss')}
              >
                <ExcelSheet
                  dataSet={dataset}
                  name="Imports"
                  key={moment().format('MM/DD/YYYY h:mm:ss')}
                />
              </ExcelFile>
            </div>
            <Table
              style={{ marginTop: '5px' }}
              rowKey={'_id'}
              columns={import_columns}
              dataSource={data_import}
              rowClassName={(record, index) => {
                return index % 2 === 0 ? 'even-row' : 'old-row'
              }}
              onRow={record => {
                return {
                  onClick: () => {
                    //this.setState({ selected_fabrictype: record })
                  },
                  onMouseEnter: () => {},
                }
              }}
              size="small"
              bordered
            />
          </div>
        ) : null}
      </div>
    )
  }
}

export default WarehouseReportImport
