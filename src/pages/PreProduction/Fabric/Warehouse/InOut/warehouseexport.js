import React, { Component } from 'react'

import {
  Select,
  Input,
  InputNumber,
  Button,
  Form,
  Modal,
  Collapse,
  Table,
  DatePicker,
  Row,
  Col,
} from 'antd'

import ReactDataGrid from 'react-data-grid'
import update from 'immutability-helper'
import { formItemLayout, tailFormItemLayout } from '../../../../Common/FormStyle'

import PropTypes from 'prop-types'
import moment from 'moment'

//import moment from 'moment';
import axios from '../../../../../axiosInst' //'../../../../../axiosInst'
//css
import '../views.css' //'./views.css'

const { Editors } = require('react-data-grid-addons')
const { AutoComplete: AutoCompleteEditor } = Editors
//const { WeekPicker } = DatePicker;

const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel
//format
const FORMAT_SHORT_DATE = 'MM/DD/YYYY'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'
const button_size = 'small'

const default_cols = [
  { key: 'orderid', name: 'ORDER #', resizable: true, editable: true, width: 100 },
  { key: 'fabric_type', name: 'TYPE', resizable: true, editable: true },
  { key: 'fabric_color', name: 'COLOR', resizable: true, editable: true },
  { key: 'met', name: 'MET', resizable: true, editable: true },
  { key: 'roll', name: 'ROLL', resizable: true, editable: true },
  { key: 'po_no', name: 'PO', resizable: true, editable: true },
  { key: 'line_no', name: 'LINE', resizable: true, editable: true },
  { key: 'sku', name: 'SKU', resizable: true, editable: true },
  { key: 'des', name: 'DESCRIPTION', resizable: true, editable: true },
  { key: 'qty', name: 'QTY', resizable: true, editable: true },
  { key: 'yield', name: 'YIELD', resizable: true, editable: true },
  { key: 'fab_qty', name: 'FAB_QTY', resizable: true, editable: true },
  { key: 'note', name: 'NOTE', resizable: true, editable: true },
]

class WarehouseExportForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      exportdate: new Date(),
      provider_selected: 'small',
      rows: !this.props.data.details ? [] : this.props.data.details,
      columns: [],
    }
  }

  componentWillReceiveProps = nextProps => {
    this.setState({ rows: !nextProps.data.details ? [] : nextProps.data.details })
  }

  createNewRow = () => {
    return {
      orderid: '',
      fabric_type: '',
      fabric_color: '',
      met: '',
      roll: '',
      po_no: '',
      line_no: '',
      sku: '',
      des: '',
      qty: '',
      yield: '',
      fab_qty: '',
      note: '',
    }
  }

  addNewRow = () => {
    let rows = this.state.rows
    rows.push(this.createNewRow())
    this.setState({ rows: rows })
  }
  rowGetter = i => {
    if (i >= 0 && i < this.state.rows.length) {
      return this.state.rows[i]
    }
    return null
  }

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice()

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i]
      let updatedRow = update(rowToUpdate, { $merge: updated })
      rows[i] = updatedRow
    }
    this.setState({ rows })
  }

  loadProviders = v => {
    axios
      .get('api/fabric/provider/get', { params: {} })
      .then(res => {
        let data = res.data
        let children = []
        let children_uni = []
        for (let i = 0; i < data.length; i++) {
          if (children_uni.indexOf(data[i].provider_name) === -1) {
            children.push(<Option key={data[i].provider_name}>{data[i].provider_name}</Option>)
            children_uni.push(data[i].provider_name)
          }
        }
        this.setState({
          data_providers: children,
          provider_size: children.length,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_providers: [], provider_size: 0 })
      })
  }

  loadFabricTypes = () => {
    axios
      .get('api/fabric/type/get', { params: {} })
      .then(res => {
        let data = res.data
        let children_grid = []
        let data_uni = []
        for (let i = 0; i < data.length; i++) {
          if (data_uni.indexOf(data[i].fabrictype_name) === -1) {
            children_grid.push({ id: data[i].fabrictype_name, title: data[i].fabrictype_name })
            data_uni.push(data[i].fabrictype_name)
          }
        }
        this.loadFabricColors(children_grid)
      })
      .catch(err => {
        console.log(err)
        this.setState({ columns: default_cols })
      })
  }

  loadFabricColors = ftypes => {
    axios
      .get('api/fabric/color/get', { params: {} })
      .then(res => {
        let colors = res.data
        let colors_grid = []
        let data_uni = []
        for (let i = 0; i < colors.length; i++) {
          if (data_uni.indexOf(colors[i].fabriccolor_name) === -1) {
            colors_grid.push({ id: colors[i].fabriccolor_name, title: colors[i].fabriccolor_name })
            data_uni.push(colors[i].fabriccolor_name)
          }
        }
        let cols = [
          { key: 'orderid', name: 'ORDER #', resizable: true, editable: true, width: 100 },
          {
            key: 'fabric_type',
            name: 'TYPE',
            editable: true,
            resizable: true,
            editor: <AutoCompleteEditor options={ftypes} />,
          },
          {
            key: 'fabric_color',
            name: 'COLOR',
            editable: true,
            resizable: true,
            editor: <AutoCompleteEditor options={colors_grid} />,
          },
          { key: 'met', name: 'MET', resizable: true, editable: true },
          { key: 'roll', name: 'ROLL', resizable: true, editable: true },
          { key: 'po_no', name: 'PO', resizable: true, editable: true },
          { key: 'line_no', name: 'LINE', resizable: true, editable: true },
          { key: 'sku', name: 'SKU', resizable: true, editable: true },
          { key: 'des', name: 'DESCRIPTION', resizable: true, editable: true },
          { key: 'qty', name: 'QTY', resizable: true, editable: true },
          { key: 'yield', name: 'YIELD', resizable: true, editable: true },
          { key: 'fab_qty', name: 'FAB_QTY', resizable: true, editable: true },
          { key: 'note', name: 'NOTE', resizable: true, editable: true },
        ]
        this.setState({ columns: cols })
      })
      .catch(err => {
        this.setState({ columns: default_cols })
      })
  }
  componentDidMount = () => {
    this.loadProviders()
    this.loadFabricTypes()
  }

  render() {
    const { visible, onCancel, onCreate } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Modal
        title={this.props.data.title}
        visible={visible}
        onOk={onCreate}
        maskClosable={false}
        onCancel={onCancel}
        width={1200}
        style={{ top: 5 }}
      >
        <Form className="ant-advanced-search-panel">
          <Row>
            <Col>
              <FormItem>
                {getFieldDecorator('id', { initialValue: this.props.data._id })(
                  <Input name="id" style={{ display: 'none', visible: false }} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <FormItem
                {...formItemLayout}
                style={{ paddingLeft: '8px', width: '100%' }}
                label="EX DATE"
              >
                {getFieldDecorator(
                  'inputdate_no',
                  { initialValue: moment(this.props.data.inputdate_no) },
                  {
                    rules: [
                      {
                        type: 'object',
                        required: true,
                        message: 'Vui lòng chọn thời gian xuất kho !',
                      },
                    ],
                  },
                )(<DatePicker format={FORMAT_SHORT_DATE} disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col>
              <FormItem {...formItemLayout} style={{ paddingLeft: '8px', width: '100%' }}>
                <Button
                  icon="plus"
                  style={{ marginLeft: 8 }}
                  type="primary"
                  size={button_size}
                  onClick={this.addNewRow}
                >
                  New row
                </Button>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={2}>
            <Col span={24}>
              <ReactDataGrid
                enableCellSelect={true}
                resizable={true}
                columns={this.state.columns}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.length}
                minHeight={300}
                onGridRowsUpdated={this.handleGridRowsUpdated}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

WarehouseExportForm.propTypes = {
  data: PropTypes.object,
}
WarehouseExportForm.defaultProps = {}

const WrappedWarehouseExportForm = Form.create()(WarehouseExportForm)

class WarehouseExport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      warehouse_import_rowcout: 0,
      warehouse_import_data: [],
      data_export_selected: {
        inputdate_no: new Date(),
        details: [],
        title: '',
      },
      modalvisible: false,
    }
  }
  handleSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (values.from_date) {
        values.from_date = values.from_date.format('YYYY-MM-DD')
      }

      if (values.to_date) {
        let todate = moment(values.to_date).add(1, 'days')
        values.to_date = todate.format('YYYY-MM-DD')
      }
      this.loadFabricWarehouses(values)
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  onRefeshGrid = () => {
    this.handleReset()
  }

  toggle = () => {
    const { expand } = this.state
    this.setState({ expand: !expand })
  }

  //Modal
  showModal = e => {
    if (e) {
      let mod = e.target.value

      if (mod === 'new') {
        this.setState({
          modalvisible: true,
          data_export_selected: { inputdate_no: new Date(), details: [], title: 'NEW' },
        })
      } else if (mod === 'detail') {
        let selected = this.state.data_export_selected
        selected['title'] = 'DETAIL'
        this.setState({
          modalvisible: true,
          data_export_selected: selected,
        })
      }
    }
  }
  handleCancel = e => {
    this.setState({
      modalvisible: false,
    })
  }

  isDataRowValid = row => {
    let c_size = 0
    let check_keys = [
      'fabric_color',
      'fabric_type',
      'orderid',
      'met',
      'roll',
      'po_no',
      'line_no',
      'sku',
      'des',
      'qty',
      'yield',
      'fab_qty',
    ]
    for (let i = 0; i < check_keys.length; i++) {
      if (row[check_keys[i]]) {
        c_size++
      }
    }
    if (c_size === check_keys.length || c_size === 0) {
      return { valid: true, size: c_size }
    }
    return { valid: false }
  }

  collectDataGrid = rows => {
    let data = []
    for (let i = 0; i < rows.length; i++) {
      let valid_row = this.isDataRowValid(rows[i])
      if (valid_row.valid) {
        if (valid_row.size > 0) {
          data.push(rows[i])
        }
      } else {
        return { isvalid: false }
      }
    }

    if (data.length === 0) {
      return { isvalid: false }
    }
    return { isvalid: true, data: data }
  }

  loadFabricWarehouses = v => {
    axios
      .get('api/fabric/export/get', { params: v })
      .then(res => {
        let data = res.data
        this.setState({ warehouse_import_data: data })
      })
      .catch(err => {
        console.log(err)
        this.setState({ warehouse_import_data: [] })
      })
  }

  handleCreate = e => {
    const form = this.formRef.props.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }

      if (this.state.mod === 'detail') {
        return
      }

      let data_collect = this.collectDataGrid(this.formRef.state.rows)
      if (!data_collect.isvalid) {
        alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.')
        return
      }
      let data = {
        // _id: values.id,
        inputdate_no: values.inputdate_no.format('YYYY-MM-DD'),
      }

      if (values.id) {
        console.log('call update')
        axios
          .post(`api/fabric/export/update/${values.id}`, { data: data, detail: data_collect.data })
          .then(res => {
            //console.log(res.data);
            form.resetFields()
            this.setState({ modalvisible: false })
          })
          .catch(err => {
            console.log(err)
            alert(err.error)
          })
      } else {
        console.log('call add')
        axios
          .post('api/fabric/export/add', { data: data, detail: data_collect.data })
          .then(res => {
            form.resetFields()
            this.setState({ modalvisible: false })
          })
          .catch(err => {
            console.log(err)
            if (err.response.data) {
              let dt_error = err.response.data
              let msg = dt_error.error + '\n\n'
              for (let k = 0; k < dt_error.data.length; k++) {
                let r = dt_error.data[k]
                // msg += ' - ' + r.fabric_type + ' - ' + r.fabric_color + ': met = ' + r.met + ', roll = ' + r.roll + '\n'
                msg +=
                  ' - ' +
                  r.fabric_type +
                  ' - ' +
                  r.fabric_color +
                  ': met/inventory = ' +
                  r.met +
                  '/' +
                  r.met_inventory +
                  ', roll/inventory = ' +
                  r.roll +
                  '/' +
                  r.roll_inventory +
                  '\n'
              }
              alert(msg)
            }
          })
      }
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }
  //end modal

  rowGetter = i => {
    if (i >= 0 && i < this.state.warehouse_import_data.length) {
      return this.state.warehouse_import_data[i]
    }
    return null
  }

  onRowWarehouseImportClick = e => {
    let index = e
    if (index >= 0 && index < this.state.warehouse_import_data.length) {
      let row_selected = this.state.warehouse_import_data[index]
      this.setState({ data_export_selected: row_selected })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        key: 'inputdate_no',
        dataIndex: 'inputdate_no',
        title: 'EX DATE',
        name: 'EX DATE',
        render: (text, record) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_SHORT_DATE)}</span>
        ),
      },
      {
        key: 'create_date',
        dataIndex: 'create_date',
        title: 'CREATE DATE',
        name: 'CREATE DATE',
        render: (text, record) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_LONG_DATE)}</span>
        ),
      },
    ]
    return (
      <div>
        <Collapse className="ant-advanced-search-panel-collapse">
          <Panel header="SEARCH" key="1">
            <Form onSubmit={this.handleSearch}>
              <Row gutter={8}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...formItemLayout} label="FROM EX DATE ">
                    {getFieldDecorator('from_date', {}, {})(
                      <DatePicker style={{ width: '100%' }} format={FORMAT_SHORT_DATE} />,
                    )}
                  </FormItem>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...formItemLayout} label="TO EX DATE ">
                    {getFieldDecorator('to_date', {}, {})(
                      <DatePicker style={{ width: '100%' }} format={FORMAT_SHORT_DATE} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...formItemLayout} label="FROM ORDER # ">
                    {getFieldDecorator('from_orderid', {})(
                      <InputNumber style={{ width: '100%' }} placeholder="from order #" />,
                    )}
                  </FormItem>
                </Col>

                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...formItemLayout} label="TO ORDER # ">
                    {getFieldDecorator('to_orderid', {})(
                      <InputNumber style={{ width: '100%' }} placeholder="to order #" />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...tailFormItemLayout}>
                    <Button icon="search" size={button_size} type="primary" htmlType="submit">
                      SEARCH
                    </Button>
                    <Button
                      icon="sync"
                      size={button_size}
                      style={{ marginLeft: 8 }}
                      onClick={this.handleReset}
                    >
                      CLEAR
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Panel>
        </Collapse>

        <Row gutter={8}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
            xl={{ span: 8 }}
          >
            <FormItem {...formItemLayout}>
              <Button
                icon="plus"
                size={button_size}
                type="primary"
                value="new"
                onClick={this.showModal}
              >
                NEW
              </Button>
              <Button
                icon="edit"
                size={button_size}
                style={{ marginLeft: 8 }}
                type="primary"
                value="detail"
                onClick={this.showModal}
              >
                DETAIL
              </Button>
            </FormItem>
          </Col>
        </Row>

        <WrappedWarehouseExportForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalvisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={this.state.data_export_selected}
        />
        <Table
          style={{ marginTop: '5px' }}
          rowKey={'_id'}
          columns={columns}
          dataSource={this.state.warehouse_import_data}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? 'even-row' : 'old-row'
          }}
          onRow={record => {
            return {
              onClick: () => {
                this.setState({ data_export_selected: record })
              },
              onMouseEnter: () => {},
            }
          }}
          size="small"
          bordered
        />
      </div>
    )
  }
}

export default WarehouseExport
