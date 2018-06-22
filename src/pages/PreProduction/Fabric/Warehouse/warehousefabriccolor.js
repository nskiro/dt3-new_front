import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { Input, Button, Form, Modal, Collapse } from 'antd'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
//import update from 'immutability-helper';

import RowRenderer from './rowrenderer'
import DateFormatter from './dateformatter'

//import moment from 'moment';
import axios from '../../../../axiosInst'
//css
import './views.css'

const FormItem = Form.Item
const Panel = Collapse.Panel
const { DateLongFormatter } = DateFormatter
const button_size = 'small'

class FabricColorForm extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { visible, onCancel, onCreate, form } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        title="COLOR"
        visible={visible}
        onOk={onCreate}
        maskClosable={false}
        onCancel={onCancel}
      >
        <Form>
          <Grid>
            <Row className="show-grid">
              <Col>
                <FormItem>
                  {getFieldDecorator('id', { initialValue: this.props.data._id })(
                    <Input name="id" style={{ display: 'none', visible: false }} />,
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={8} xs={5}>
                <FormItem label={'COLOR'}>
                  {getFieldDecorator('fabriccolor_code', {
                    rules: [{ required: true, message: 'Vui lòng nhập tên màu vải!' }],
                    initialValue: this.props.data.fabriccolor_code,
                  })(<Input name="fabriccolor_code" placeholder="tên màu vải" />)}
                </FormItem>
              </Col>
            </Row>
          </Grid>
        </Form>
      </Modal>
    )
  }
}

FabricColorForm.propTypes = {
  data: PropTypes.object,
}
FabricColorForm.defaultProps = {}

class WarehouseFabricColor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      modalvisible: false,
      data_fabriccolors: [],
      selected_fabriccolor: { fabriccolor_code: '', fabriccolor_name: '' },
    }
  }

  handleSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      // console.log('Received values of form: ', values);
      if (values.fabriccolor_name) {
        this.loadFabricColors(values)
      } else {
        this.loadFabricColors({})
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
    this.loadFabricColors({})
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
      // console.log(e.target.value);
      let mod = e.target.value
      if (mod === 'new') {
        this.setState({
          modalvisible: true,
          selected_fabriccolor: { fabriccolor_code: undefined, fabriccolor_name: undefined },
        })
      } else if (mod === 'edit') {
        let fcolor = this.state.selected_fabriccolor
        if (fcolor.fabriccolor_name) {
          this.setState({
            modalvisible: true,
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

  loadFabricColors = v => {
    axios
      .get('api/fabric/color/get', { params: v })
      .then(res => {
        let data = res.data
        // update data
        this.setState({ data_fabriccolors: data })
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_fabriccolors: [] })
      })
  }

  onRowFabricColorClick = e => {
    let index = e
    if (index >= 0 && index < this.state.data_fabriccolors.length) {
      let ftype = this.state.data_fabriccolors[index]
      this.setState({ selected_fabriccolor: ftype })
    }
  }

  componentDidMount = () => {
    this.loadFabricColors({})
  }

  handleCreate = e => {
    const form = this.formRef.props.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      if (!values.fabriccolor_code) {
        return
      }

      let data = {
        _id: values.id,
        fabriccolor_code: values.fabriccolor_code,
        fabriccolor_name: values.fabriccolor_code,
      }
      // console.log(data);
      if (values.id) {
        console.log('call update')
        axios
          .post(`api/fabric/color/update/${values.id}`, data)
          .then(res => {
            //console.log(res.data);
            this.loadFabricColors({})
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        console.log('call add')
        axios
          .post('api/fabric/color/add', data)
          .then(res => {
            // console.log(res.data);
            this.loadFabricColors({})
          })
          .catch(err => {
            console.log(err)
          })
      }
      form.resetFields()
      this.setState({ modalvisible: false })
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }
  //end modal

  rowGetter = i => {
    if (i >= 0 && i < this.state.data_fabriccolors.length) {
      return this.state.data_fabriccolors[i]
    }
    return null
  }

  render() {
    const WrappedFabricColorForm = Form.create()(FabricColorForm)
    const { getFieldDecorator } = this.props.form
    const columns = [
      // {key: '_id', name: 'id', hidd: false },
      { key: 'fabriccolor_code', name: 'COLOR' },
      { key: 'create_date', name: 'CREATE DATE', formatter: DateLongFormatter },
      { key: 'update_date', name: 'UPDATE DATE', formatter: DateLongFormatter },
    ]
    return (
      <div>
        <Collapse className="ant-advanced-search-panel-collapse">
          <Panel header="SEARCH" key="1">
            <Form className="ant-advanced-search-panel " onSubmit={this.handleSearch}>
              <Grid>
                <Row className="show-grid">
                  <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                    <FormItem label={'COLOR'}>
                      {getFieldDecorator('fabriccolor_name', {})(
                        <Input placeholder="tên màu vải" />,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
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
                  </Col>
                </Row>
              </Grid>
            </Form>
          </Panel>
        </Collapse>

        <div className="ant-advanced-toolbar">
          <Button
            icon="plus"
            size={button_size}
            type="primary"
            value="new"
            className="ant-advanced-toolbar-item"
            onClick={this.showModal}
          >
            NEW
          </Button>
          <Button
            icon="edit"
            size={button_size}
            type="primary"
            value="edit"
            className="ant-advanced-toolbar-item"
            onClick={this.showModal}
          >
            EDIT
          </Button>
          <Button
            icon="sync"
            size={button_size}
            type="primary"
            className="ant-advanced-toolbar-item"
            onClick={this.onRefeshGrid}
          >
            REFESH
          </Button>
        </div>
        <WrappedFabricColorForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalvisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={this.state.selected_fabriccolor}
        />
        <ReactDataGrid
          enableCellSelect={true}
          resizable={true}
          columns={columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.data_fabriccolors.length}
          minHeight={390}
          onRowClick={this.onRowFabricColorClick}
          rowRenderer={RowRenderer}
        />
      </div>
    )
  }
}

export default WarehouseFabricColor
