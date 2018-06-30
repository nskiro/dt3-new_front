import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import ExcelFileSheet from 'react-data-export'

import { Input, Form, Modal, Button, DatePicker, Select, Icon } from 'antd'
import ReactDataGrid from 'react-data-grid'

import RowRenderer from '../rowrenderer'
import DateFormatter from '../dateformatter'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import axios from '../../../../../axiosInst'
//css
import '../views.css'
const Option = Select.Option

const FormItem = Form.Item

const { Editors } = require('react-data-grid-addons')
const { ExcelFile, ExcelSheet } = ExcelFileSheet
const { DateLongFormatter } = DateFormatter

const dateFormat = 'MM/DD/YYYY'
const button_size = 'small'

const inventory_colums = [
  { key: 'stt', name: 'STT', resizable: true, width: 60 },
  { key: 'fabric_type', resizable: true, name: 'TYPE' },
  { key: 'fabric_color', resizable: true, name: 'COLOR' },
  { key: 'met', resizable: true, name: 'INV MET' },
  { key: 'roll', resizable: true, name: 'INV ROLL' },
]

const inventory_trans_colums = [
  { key: 'stt', name: 'STT', resizable: true, width: 60 },
  { key: 'invoice_no', name: 'STK', resizable: true, width: 120 },
  {
    key: 'im_inputdate_no',
    name: 'IM DATE',
    resizable: true,
    formatter: DateLongFormatter,
    width: 150,
  },
  {
    key: 'ex_inputdate_no',
    name: 'EX DATE',
    resizable: true,
    formatter: DateLongFormatter,
    width: 150,
  },
  { key: 'im_met', name: 'IM MET', resizable: true, width: 100 },
  { key: 'ex_met', name: 'EX MET', resizable: true, width: 100 },
  { key: 'met', name: 'MET', resizable: true, width: 100 },
  { key: 'im_roll', name: 'IM ROLL', resizable: true, width: 100 },
  { key: 'ex_roll', name: 'EX ROLL', resizable: true, width: 100 },
  { key: 'roll', name: 'ROLL', resizable: true, width: 100 },
  { key: 'orderid', name: 'ORDER#', resizable: true, width: 100 },
  { key: 'po_no', name: 'PO#', resizable: true, width: 100 },
  { key: 'line_no', name: 'LINE#', resizable: true, width: 100 },
  { key: 'sku', name: 'SKU', resizable: true, width: 100 },
  { key: 'des', name: 'DESCRIPTION', resizable: true, width: 100 },
  { key: 'qty', name: 'QTY', resizable: true, width: 100 },
  { key: 'yield', name: 'YIELD', resizable: true, width: 100 },
  { key: 'fab_qty', name: 'FAB_QTY', resizable: true, width: 100 },
  { key: 'note', name: 'NOTE', resizable: true, width: 200 },
]

class FormTransDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_trans: [],
      data_search: {},
    }
  }

  rowInventoryTransGetter = i => {
    if (i >= 0 && i < this.state.data_trans.length) {
      return this.state.data_trans[i]
    }
    return null
  }

  onSearchDetailTrans = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      let data_search = {}
      if (values.fromdate) {
        data_search.from_date = values.fromdate.format(dateFormat)
        values.fromdate = values.fromdate.format('YYYY-MM-DD')
      }
      if (values.todate) {
        data_search.to_date = values.todate.format(dateFormat)
        let todate = moment(values.todate).add(1, 'days')
        values.todate = todate.format('YYYY-MM-DD')
      }

      if (values.fabric_color) {
        data_search.fabric_color = values.fabric_color
      }
      if (values.fabric_type) {
        data_search.fabric_type = values.fabric_type
      }

      this.setState({ data_search: data_search })
      axios
        .get('api/fabric/warehouse/getinventorytrans', { params: values })
        .then(res => {
          this.setState({ data_trans: res.data })
        })
        .catch(err => {
          console.log(err)
          this.setState({ data_trans: [] })
        })
    })
  }

  inventoryTransDetailDataset = () => {
    let dataset = []
    dataset.push({
      xSteps: 2,
      ySteps: 0,
      columns: ['BÁO CÁO CHI TIẾT XUẤT -  NHẬP - TỒN'],
      data: [[]],
    })

    let conditions = {
      xSteps: 0,
      ySteps: 0,
      columns: ['', ''],
    }
    let conditions_data = []
    let from_date = ''
    let to_date = ''
    let fabric_color = ''
    let fabric_type = ''

    let data_search = this.state.data_search
    if (!_.isEmpty(data_search)) {
      if (data_search.from_date) {
        from_date = data_search.from_date
      }
      if (data_search.to_date) {
        to_date = data_search.to_date
      }
      if (data_search.fabric_color) {
        fabric_color = data_search.fabric_color
      }
      if (data_search.fabric_type) {
        fabric_type = data_search.fabric_type
      }
    }

    conditions_data.push([{ value: 'FROM DATE', style: { font: { bold: true } } }, from_date])
    conditions_data.push([{ value: 'TO DATE', style: { font: { bold: true } } }, to_date])
    conditions_data.push([{ value: 'TYPE', style: { font: { bold: true } } }, fabric_type])
    conditions_data.push([{ value: 'COLOR', style: { font: { bold: true } } }, fabric_color])

    conditions.data = conditions_data
    dataset.push(conditions)

    let data = {
      xSteps: 0,
      ySteps: 2,
      columns: [
        'STT',
        'STK',
        'IM DATE',
        'EX DATE',
        'CODE',
        'COLOR',
        'IM MET',
        'EX MET',
        'INV MET',
        'IM ROLL',
        'EX ROLL',
        'INV ROLL',
        'ORDER #',
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

    let data_trans = this.state.data_trans
    if (!data_trans) {
      data_trans = []
    }
    for (let i = 0; i < data_trans.length; i++) {
      let row = []

      let r = data_trans[i]
      row.push(r.stt)
      row.push(r.invoice_no)
      if (r.im_inputdate_no) {
        let im_date = moment(r.im_inputdate_no).format(dateFormat)
        row.push(im_date)
      } else {
        row.push('')
      }

      if (r.ex_inputdate_no) {
        let ex_date = moment(r.ex_inputdate_no).format(dateFormat)
        row.push(ex_date)
      } else {
        row.push('')
      }

      row.push(fabric_type)
      row.push(fabric_color)
      row.push(r.im_met)
      row.push(r.ex_met)
      row.push(r.met)
      row.push(r.im_roll)
      row.push(r.ex_roll)

      // row.push({ value: r.roll, style: { fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } } } });
      row.push(r.roll)
      row.push(r.orderid)
      row.push(r.po_no)
      row.push(r.line_no)
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

    return dataset
  }

  render() {
    const { visible, onCancel, onCreate } = this.props
    const { getFieldDecorator } = this.props.form
    let fabric_type = ''
    let fabric_color = ''
    if (this.props.data.data !== undefined) {
      fabric_type = this.props.data.data.fabric_type
      fabric_color = this.props.data.data.fabric_color
    }
    const transDetailDataset = this.inventoryTransDetailDataset()
    return (
      <Modal
        title="VIEW DETAIL"
        visible={visible}
        onOk={onCreate}
        maskClosable={false}
        onCancel={onCancel}
        width={1000}
        style={{ top: 5 }}
      >
        <div>
          <Form className="ant-advanced-search-panel ">
            <Grid>
              <Row className="show-grid">
                <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                  <div>
                    <b> TYPE:</b> {fabric_type}{' '}
                  </div>
                </Col>
                <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                  <div>
                    <b> COLOR:</b> {fabric_color}{' '}
                  </div>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col>
                  <FormItem>
                    {getFieldDecorator('fabric_type', { initialValue: fabric_type })(
                      <Input style={{ display: 'none', visible: false }} />,
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('fabric_color', { initialValue: fabric_color })(
                      <Input style={{ display: 'none', visible: false }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row className="show-grid">
                <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                  <FormItem label="FROM DATE">
                    {getFieldDecorator('fromdate', {})(<DatePicker format={dateFormat} />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                  <FormItem label="TO DATE">
                    {getFieldDecorator('todate', {})(<DatePicker format={dateFormat} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                  <Button
                    icon="search"
                    size={button_size}
                    type="primary"
                    onClick={this.onSearchDetailTrans}
                  >
                    {' '}
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
                </Col>
              </Row>
            </Grid>
          </Form>
          <div className="ant-advanced-toolbar">
            <ExcelFile
              element={
                <Button icon="export" size={button_size} type="primary">
                  {' '}
                  Download Data{' '}
                </Button>
              }
              filename={'InventoryDetail - ' + moment().format('MM/DD/YYYY h:mm:ss')}
            >
              <ExcelSheet dataSet={transDetailDataset} name="Inventory Detail" />
            </ExcelFile>
          </div>
          <ReactDataGrid
            enableCellSelect={true}
            resizable={true}
            columns={inventory_trans_colums}
            rowGetter={this.rowInventoryTransGetter}
            rowsCount={this.state.data_trans.length}
            minHeight={300}
            rowRenderer={RowRenderer}
          />
        </div>
      </Modal>
    )
  }
}
FormTransDetail.propTypes = {
  data: PropTypes.object,
}
FormTransDetail.defaultProps = {}

class WarehouseReportInvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_colors: [],
      data_types: [],
      show_grid_result: false,
      data_inventory: [],
      showdetail: false,
      data_inventory_selected: {},

      s_fabric_type: [],
      s_fabric_color: [],

      fcolor_mouted: false,
      ftype_mouted: false,
    }
  }
  handleSearchInventory = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (values.fabric_color) {
        this.setState({ s_fabric_color: values.fabric_color })
      }

      if (values.fabric_type) {
        this.setState({ s_fabric_type: values.fabric_type })
      }

      axios
        .get('api/fabric/warehouse/getinventorys', { params: values })
        .then(res => {
          // console.log(' res.data ->' + JSON.stringify(res.data))
          this.setState({ data_inventory: res.data })
        })
        .catch(err => {
          console.log(err)
          this.setState({ data_inventory: [] })
        })
      this.setState({ show_grid_result: true })
    })
  }
  handleInventoryReset = () => {
    //console.log('handleInventoryReset -> clicked')
    this.props.form.resetFields()
    this.setState({ show_grid_result: false })
  }
  handleColorChange = value => {
    console.log('selected' + JSON.stringify(value))
  }

  handleTypeChange = value => {
    console.log(`selected ${value}`)
  }

  inventoryDataset = () => {
    let dataset = []
    dataset.push({
      xSteps: 2,
      ySteps: 0,
      columns: ['BÁO CÁO TỒN'],
      data: [[]],
    })

    let conditions = {
      xSteps: 0,
      ySteps: 0,
      columns: ['', ''],
    }
    let conditions_data = []
    let s_fabric_type = ''
    for (let j = 0; j < this.state.s_fabric_type.length; j++) {
      if (j === 0) {
        s_fabric_type = this.state.s_fabric_type[j]
      } else {
        s_fabric_type = s_fabric_type + ',' + this.state.s_fabric_type[j]
      }
    }

    let s_fabric_color = ''
    for (let j = 0; j < this.state.s_fabric_color.length; j++) {
      if (j === 0) {
        s_fabric_color = this.state.s_fabric_color[j]
      } else {
        s_fabric_color = s_fabric_color + ',' + this.state.s_fabric_color[j]
      }
    }

    conditions_data.push(['TYPE', s_fabric_type])
    conditions_data.push(['COLOR', s_fabric_color])

    conditions.data = conditions_data
    dataset.push(conditions)

    let data = {
      xSteps: 0,
      ySteps: 2,
      columns: ['STT', 'TYPE', 'COLOR', 'INV MET', 'INV ROLL'],
    }

    let data_row = []

    for (let i = 0; i < this.state.data_inventory.length; i++) {
      let row = []

      let r = this.state.data_inventory[i]
      row.push(r.stt)
      row.push(r.fabric_type)
      row.push(r.fabric_color)
      row.push(r.met)
      row.push(r.roll)

      data_row.push(row)
    }

    data.data = data_row
    dataset.push(data)

    return dataset
  }

  rowInventoryGetter = i => {
    if (i >= 0 && i < this.state.data_inventory.length) {
      return this.state.data_inventory[i]
    }
    return null
  }

  loadFabricColors = () => {
    if (this.state.fcolor_mouted) {
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
          this.setState({ data_colors: colors_grid })
        })
        .catch(err => {
          this.setState({ data_colors: [] })
        })
    }
  }

  loadFabricTypes = () => {
    if (this.state.ftype_mouted) {
      console.log('loadFabricTypes')
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
          this.setState({ data_types: children })
        })
        .catch(err => {
          console.log(err)
          this.setState({ data_types: [] })
        })
    }
  }

  componentDidMount = () => {
    this.setState({ fcolor_mouted: true, ftype_mouted: true })
    this.loadFabricColors()
    this.loadFabricTypes()
  }

  componentWillUnmount = () => {
    this.setState({ fcolor_mouted: false, ftype_mouted: false })
  }
  onViewDetail = e => {
    if (e) {
      let data_inventory_selected = this.state.data_inventory_selected
      if (!_.isEmpty(data_inventory_selected)) {
        this.setState({ showdetail: true })
      }
    }
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }
  handleCancel = e => {
    this.setState({
      showdetail: false,
    })
  }
  handleCreate = e => {
    // const form = this.formRef.props.form;
    this.setState({
      showdetail: false,
    })
  }

  onRowWarehouseInventClick = e => {
    let index = e
    if (index >= 0 && index < this.state.data_inventory.length) {
      let row = this.state.data_inventory[index]
      this.setState({ data_inventory_selected: { data: row } })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const WapperFormTransDetail = Form.create()(FormTransDetail)
    return (
      <div>
        <WapperFormTransDetail
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.showdetail}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={this.state.data_inventory_selected}
        />
        <Form className="ant-advanced-search-panel " onSubmit={this.handleSearchInventory}>
          <Grid>
            <Row className="show-grid">
              <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                <FormItem label={'TYPE '}>
                  {getFieldDecorator('fabric_type', {})(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      tokenSeparators={[',']}
                      onChange={this.handleTypeChange}
                    >
                      {this.state.data_types}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                <FormItem label={'COLOR '}>
                  {getFieldDecorator('fabric_color', {})(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      tokenSeparators={[',']}
                      onChange={this.handleColorChange}
                    >
                      {this.state.data_colors}
                    </Select>,
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
                  onClick={this.handleInventoryReset}
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
                    {' '}
                    Download Data{' '}
                  </Button>
                }
                filename={'Inventory - ' + moment().format('MM/DD/YYYY h:mm:ss')}
              >
                <ExcelSheet dataSet={this.inventoryDataset()} name="Inventory" />
              </ExcelFile>
              <Button
                icon="info-circle"
                size={button_size}
                style={{ marginLeft: 8 }}
                type="primary"
                value="view"
                className="ant-advanced-toolbar-item"
                onClick={this.onViewDetail}
              >
                DETAIL
              </Button>
            </div>
            <ReactDataGrid
              enableCellSelect={true}
              resizable={true}
              columns={inventory_colums}
              rowGetter={this.rowInventoryGetter}
              rowsCount={this.state.data_inventory.length}
              onRowClick={this.onRowWarehouseInventClick}
              minHeight={290}
              rowRenderer={RowRenderer}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

export default WarehouseReportInvent
