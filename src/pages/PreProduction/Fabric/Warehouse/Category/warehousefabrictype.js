import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { Input, Button, Form, Modal, Collapse, Table } from 'antd'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
//import update from 'immutability-helper';

import RowRenderer from '../rowrenderer'
import DateFormatter from '../dateformatter'

import moment from 'moment'
import axios from '../../../../../axiosInst'
//css
import '../views.css'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'

const FormItem = Form.Item
const Panel = Collapse.Panel
const { DateLongFormatter } = DateFormatter
const button_size = 'small'
class FabricTypeForm extends Component {
  render() {
    const { visible, onCancel, onCreate, form } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        title="TYPE"
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

              <Col md={12} sm={12} xs={12}>
                <FormItem label={'TYPE'}>
                  {getFieldDecorator('fabrictype_name', {
                    rules: [{ required: true, message: 'Vui lòng nhập loại vải!' }],
                    initialValue: this.props.data.fabrictype_code,
                  })(<Input name="fabrictype_name" placeholder="loại vải" />)}
                </FormItem>
              </Col>
            </Row>
          </Grid>
        </Form>
      </Modal>
    )
  }
}

FabricTypeForm.propTypes = {
  data: PropTypes.object,
}
FabricTypeForm.defaultProps = {}

class WarehouseFabricType extends Component {
  // constructor(props) {
  // super(props)
  state = {
    expand: false,
    modalvisible: false,
    data_fabrictypes: [],
    selected_fabrictype: { fabrictype_code: '', fabrictype_name: '' },
  }
  // }

  handleSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (values.fabrictype_name) {
        this.loadFabricTypes(values)
      } else {
        this.loadFabricTypes({})
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
    this.loadFabricTypes({})
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
          selected_fabrictype: { provider_code: undefined, provider_name: undefined },
        })
      } else if (mod === 'edit') {
        let fabrictype = this.state.selected_fabrictype
        if (fabrictype.fabrictype_code) {
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

  loadFabricTypes = v => {
    axios
      .get('api/fabric/type/get', { params: v })
      .then(res => {
        let data = res.data
        // update data
        this.setState({ data_fabrictypes: data })
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_fabrictypes: [] })
      })
  }

  onRowFabricTypeClick = e => {
    let index = e
    if (index >= 0 && index < this.state.data_fabrictypes.length) {
      let ftype = this.state.data_fabrictypes[index]
      this.setState({ selected_fabrictype: ftype })
    }
  }

  componentDidMount = () => {
    this.loadFabricTypes({})
  }

  handleCreate = e => {
    const form = this.formRef.props.form

    form.validateFields((err, values) => {
      if (err) {
        return
      }
      let data = {
        _id: values.id,
        fabrictype_code: values.fabrictype_name,
        fabrictype_name: values.fabrictype_name,
      }
      if (values.id) {
        console.log('call update')
        axios
          .post(`api/fabric/type/update/${values.id}`, data)
          .then(res => {
            this.loadFabricTypes({})
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        console.log('call add')
        axios
          .post('api/fabric/type/add', data)
          .then(res => {
            this.loadFabricTypes({})
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
    if (i >= 0 && i < this.state.data_fabrictypes.length) {
      return this.state.data_fabrictypes[i]
    }
    return null
  }

  render() {
    const WrappedFabricTypeForm = Form.create()(FabricTypeForm)
    const { getFieldDecorator } = this.props.form
    const columns = [
      // {key: '_id', name: 'id', hidd: false },
      { key: 'fabrictype_name', dataIndex: 'fabrictype_name', title: 'TYPE', name: 'TYPE' },
      {
        key: 'create_date',
        dataIndex: 'create_date',
        title: 'CREATE DATE',
        name: 'CREATE DATE',
        render: (text, record, index) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_LONG_DATE)}</span>
        ),
      },
      {
        key: 'update_date',
        dataIndex: 'update_date',
        title: 'UPDATE DATE',
        name: 'UPDATE DATE',
        render: (text, record) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_LONG_DATE)}</span>
        ),
      },
    ]
    return (
      <div>
        <Collapse className="ant-advanced-search-panel-collapse">
          <Panel header="Tìm kiếm" key="1">
            <Form className="ant-advanced-search-panel " onSubmit={this.handleSearch}>
              <Grid>
                <Row className="show-grid">
                  <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                    <FormItem label={'TYPE'}>
                      {getFieldDecorator('fabrictype_name', {})(
                        <Input placeholder="tên loại vải" />,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                    <Button icon="search" size={button_size} type="primary" htmlType="submit">
                      {' '}
                      SEARCH{' '}
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
        <WrappedFabricTypeForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalvisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={this.state.selected_fabrictype}
        />

        <Table
          style={{ marginTop: '5px' }}
          rowKey={'_id'}
          columns={columns}
          dataSource={this.state.data_fabrictypes}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? 'even-row' : 'old-row'
          }}
          onRow={record => {
            return {
              onClick: () => {
                this.setState({ selected_fabrictype: record })
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

export default WarehouseFabricType
