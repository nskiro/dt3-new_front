import React, { Component } from 'react'

import {
  Select,
  Input,
  Button,
  Form,
  Modal,
  Collapse,
  Table,
  DatePicker,
  Pagination,
  Row,
  Col,
} from 'antd'

import ReactDataGrid from 'react-data-grid'
import update from 'immutability-helper'
import { formItemLayout, tailFormItemLayout } from '../../../../Common/FormStyle'

import PropTypes from 'prop-types'
import moment from 'moment'

//import moment from 'moment';
import axios from '../../../../../axiosInst'
//css
import '../views.css'

const { Editors } = require('react-data-grid-addons')
const { AutoComplete: AutoCompleteEditor } = Editors
const { RangePicker } = DatePicker

const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel
//format

const FORMAT_SHORT_DATE = 'MM/DD/YYYY'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'
const button_size = 'small'
const tab_size = 'small'

const default_cols = [
  { key: 'username', name: 'USERNAME', editable: true, resizable: true, width: 100 },
  { key: 'fullname', name: 'FULLNNAME', editable: true, resizable: true, width: 100 },
  { key: 'last_login', name: 'LAST LOGIN', editable: true, resizable: true, width: 100 },
  { key: 'create_date', name: 'CREATE DATE', editable: true, resizable: true },
  { key: 'update_date', name: 'UPDATE DATE', editable: true, resizable: true },
  { key: 'record_status', name: 'STATUS', editable: true, resizable: true },
]

class WarehouseImportForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      importdate: new Date(),
      provider_selected: 'small',
      rows: !this.props.data.details ? [] : this.props.data.details,
      columns: [],
    }
    console.log('props => ' + JSON.stringify(this.props.data))
  }

  componentWillReceiveProps = nextProps => {
    this.setState({ rows: !nextProps.data.details ? [] : nextProps.data.details })
  }

  createNewRow = () => {
    return { orderid: '', fabric_type: '', fabric_color: '', met: '', roll: '', note: '' }
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

  loadProviders = () => {
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
        this.setState({ data_providers: children })
      })
      .catch(err => {
        this.setState({ data_providers: [] })
        alert('Lấy danh sácch Supplier thất bại.\n-Nguyên nhân do: ' + err)
        console.log(err)
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
          { key: 'orderid', name: 'ORDER #', editable: true, width: 100 },
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
          { key: 'met', name: 'MET', editable: true },
          { key: 'roll', name: 'ROLL', editable: true },
          { key: 'note', name: 'NOTE', editable: true },
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

    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 8 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
    }
    return (
      <Modal
        title={this.props.data.title}
        visible={visible}
        onOk={onCreate}
        maskClosable={false}
        onCancel={onCancel}
        width={900}
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
          <Row gutter={8} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <FormItem {...formItemLayout} label="IM DATE">
                {getFieldDecorator('inputdate_no', {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'Vui lòng chọn thời gian nhập kho !',
                    },
                  ],
                  initialValue: moment(this.props.data.inputdate_no),
                })(<DatePicker style={{ width: '100%' }} format={FORMAT_SHORT_DATE} disabled />)}
              </FormItem>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <FormItem {...formItemLayout} label="SUPPLIER">
                {getFieldDecorator('provider_name', {
                  rules: [{ required: true, message: 'Vui lòng chọn nhà cung cấp!' }],
                  initialValue: this.props.data.provider_name,
                })(
                  <Select style={{ width: '100%' }} size={'default'} placeholder="nhà cung cấp.">
                    {this.state.data_providers}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={8} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <FormItem {...formItemLayout} label="STK">
                {getFieldDecorator(
                  'declare_no',
                  { initialValue: this.props.data.declare_no },
                  { rules: [{ required: true, message: 'Vui lòng nhập số tờ khai.' }] },
                )(<Input style={{ width: '100%' }} placeholder="số tờ khai" />)}
              </FormItem>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <FormItem {...formItemLayout} label="STK DATE">
                {getFieldDecorator(
                  'declare_date',
                  { initialValue: moment(this.props.data.declare_date) },
                  { rules: [{ required: true, message: 'Vui lòng nhập ngày tờ khai!' }] },
                )(<DatePicker style={{ width: '100%' }} format={FORMAT_SHORT_DATE} />)}
              </FormItem>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <FormItem {...formItemLayout} label="INVOICE #">
                {getFieldDecorator(
                  'invoice_no',
                  { initialValue: this.props.data.invoice_no },
                  { rules: [{ required: true, message: 'Vui lòng nhập số invoice!' }] },
                )(<Input style={{ width: '100%' }} placeholder="số invoice" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col>
              <FormItem {...formItemLayout}>
                <Button icon="plus-circle" size={button_size} onClick={this.addNewRow}>
                  NEW ROW
                </Button>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ReactDataGrid
                enableCellSelect={true}
                resizable={true}
                columns={this.state.columns ? this.state.columns : []}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows ? this.state.rows.length : 0}
                minHeight={200}
                onGridRowsUpdated={this.handleGridRowsUpdated}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

WarehouseImportForm.propTypes = {
  data: PropTypes.object,
}
WarehouseImportForm.defaultProps = {}

const WrappedWarehouseImportForm = Form.create()(WarehouseImportForm)

class WarehouseImport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      current_date: new Date(),
      warehouse_import_rowcout: 0,
      warehouse_import_data: [],
      modalvisible: false,

      data_providers: [],
      data_providers_size: 'small',
      selected_warehouse_import: {},
      mod: 'view',
    }
  }

  createNewRow = () => {
    return { orderid: '', fabric_type: '', fabric_color: '', met: '', roll: '', note: '' }
  }
  createRows = numberOfRows => {
    let rows = []
    for (let i = 1; i < numberOfRows; i++) {
      rows.push(this.createNewRow())
    }
    return rows
  }
  selectedWarehouseImportDefault = () => {
    return {
      title: 'IMPORT',
      provider_name: undefined,
      invoice_no: undefined,
      declare_no: undefined,
      declare_date: new Date(),
      details: this.createRows(5),
    }
  }

  handleSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      // console.log('Received values of form: ', values);
      if (values) {
        if (values.declare_dates && values.declare_dates.length === 2) {
          let fromdate = values.declare_dates[0]
          let todate = moment(values.declare_dates[1].format('YYYY-MM-DD'), 'YYYY-MM-DD')
          let nexttodate = todate.add(1, 'days')
          values.declare_dates = [fromdate.format('YYYY-MM-DD'), nexttodate.format('YYYY-MM-DD')]
        }
      }

      this.loadFabricWarehouses(values)
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
    this.setState({ warehouse_import_data: [] })
    // this.loadFabricWarehouses({});
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
          selected_warehouse_import: this.selectedWarehouseImportDefault(),
          modalvisible: true,
          mod: mod,
        })
      } else if (mod === 'edit') {
        let seleted = this.state.selected_warehouse_import
        seleted.title = 'EDIT'
        if (seleted._id) {
          this.setState({
            modalvisible: true,
            mod: mod,
            selected_warehouse_import: seleted,
          })
        }
      } else if (mod === 'view') {
        let seleted = this.state.selected_warehouse_import
        seleted.title = 'VIEW DETAIL'
        if (seleted._id) {
          this.setState({
            modalvisible: true,
            mod: mod,
            selected_warehouse_import: seleted,
          })
        }
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
    let check_keys = ['fabric_color', 'orderid', 'met', 'roll', 'fabric_type']
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

  loadSearchProviders = () => {
    axios
      .get('api/fabric/provider/get', { params: {} })
      .then(res => {
        let data = res.data
        let children = []
        let children_uni = []
        children.push(<Option key="A">{'ALL'}</Option>)

        for (let i = 0; i < data.length; i++) {
          if (children_uni.indexOf(data[i].provider_code) === -1) {
            children.push(<Option key={data[i].provider_code}>{data[i].provider_code}</Option>)
            children_uni.push(data[i].provider_code)
          }
        }
        this.setState({
          data_providers: children,
          provider_size: children.length,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_providers: [] })
      })
  }

  loadFabricWarehouses = v => {
    axios
      .get('api/fabric/import/get', { params: v })
      .then(res => {
        let data = res.data
        // update data
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
      // console.log(values);
      if (this.state.mod === 'view') {
        form.resetFields()
        this.setState({ modalvisible: false })
        return
      }

      if (err) {
        return
      }
      let data_collect = this.collectDataGrid(this.formRef.state.rows)
      if (!data_collect.isvalid) {
        alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.')
        return
      }
      let data = {
        // _id: values.id,
        inputdate_no: values.inputdate_no,
        provider_name: values.provider_name,
        declare_no: values.declare_no,
        declare_date: values.declare_date,
        invoice_no: values.invoice_no,
      }

      if (values.id) {
        axios
          .post(`api/fabric/import/update/${values.id}`, { data: data, detail: data_collect.data })
          .then(res => {
            //console.log(res.data);
            if (!res.data.valid) {
              alert('error' + JSON.stringify(res.data.error))
              return
            }
            this.loadFabricWarehouses({})
            form.resetFields()
            this.setState({ modalvisible: false })
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        console.log('call add')
        axios
          .post('api/fabric/import/add', { data: data, detail: data_collect.data })
          .then(res => {
            //console.log(res.data);
            if (!res.data.valid) {
              alert('error' + JSON.stringify(res.data.error))
              return
            }
            this.loadFabricWarehouses({})
            form.resetFields()
            this.setState({ modalvisible: false })
          })
          .catch(err => {
            console.log(err)
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

  componentDidMount = () => {
    this.loadSearchProviders()
  }

  onRowWarehouseImportClick = e => {
    let index = e
    if (index >= 0 && index < this.state.warehouse_import_data.length) {
      let row = this.state.warehouse_import_data[index]
      this.setState({ selected_warehouse_import: row })
    }
  }

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { warehouse_import_data } = this.state
    const columns = [
      {
        key: 'inputdate_no',
        dataIndex: 'inputdate_no',
        title: 'DATE',
        name: 'DATE',
        render: (text, record) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_LONG_DATE)}</span>
        ),
      },
      { key: 'provider_name', dataIndex: 'provider_name', title: 'SUPPLIER', name: 'SUPPLIER' },
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
      { key: 'invoice_no', dataIndex: 'invoice_no', title: 'INVOICE #', name: 'INVOICE #' },
    ]

    const pagination = (
      <Pagination
        showSizeChanger
        onShowSizeChange={this.onShowSizeChange}
        defaultCurrent={1}
        total={warehouse_import_data.length}
      />
    )

    return (
      <div>
        <Collapse className="ant-advanced-search-panel-collapse">
          <Panel header="SEARCH" key="1" size="small">
            <Form onSubmit={this.handleSearch}>
              <Row gutter={8}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...formItemLayout} label={'ORDER #'}>
                    {getFieldDecorator('orderid', {})(<Input placeholder="Nhập mã order #" />)}
                  </FormItem>
                </Col>

                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...formItemLayout} label={'STK'}>
                    {getFieldDecorator('declare_no', {})(<Input placeholder="Nhập số tờ khai" />)}
                  </FormItem>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...formItemLayout} label={'STK DATE'}>
                    {getFieldDecorator('declare_dates', {})(
                      <RangePicker
                        style={{ width: '100%' }}
                        placeholder="Nhập ngày tờ khai"
                        format={FORMAT_SHORT_DATE}
                      />,
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
                  <FormItem {...formItemLayout} label={'INVOICE #'}>
                    {getFieldDecorator('invoice_no', {})(
                      <Input style={{ width: '100%' }} placeholder="Nhập mã số invoice" />,
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
                  <FormItem {...formItemLayout} label={'SUPPLIER'}>
                    {getFieldDecorator('provider_name', {})(
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn nhà cung cấp"
                        size={this.state.data_providers_size}
                      >
                        {this.state.data_providers}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
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

        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
            xl={{ span: 8 }}
          >
            <FormItem {...formItemLayout}>
              <Button
                type="primary"
                size={button_size}
                icon="plus-circle"
                value="new"
                onClick={this.showModal}
              >
                NEW
              </Button>
              <Button
                type="primary"
                size={button_size}
                icon="info-circle"
                value="view"
                style={{ marginLeft: 8 }}
                onClick={this.showModal}
              >
                DETAIL
              </Button>
            </FormItem>
          </Col>
        </Row>
        <WrappedWarehouseImportForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalvisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={this.state.selected_warehouse_import}
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
                this.setState({ selected_warehouse_import: record })
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
export default WarehouseImport
