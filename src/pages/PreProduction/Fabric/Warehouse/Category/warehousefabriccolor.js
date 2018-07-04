import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { Input, Button, Form, Modal, Collapse, Table } from 'antd'
import moment from 'moment'

import ReactDataGrid from 'react-data-grid'
//import update from 'immutability-helper';

import RowRenderer from '../rowrenderer'
import DateFormatter from '../dateformatter'

//import moment from 'moment';
import axios from '../../../../../axiosInst' //'../../../../../axiosInst'
//css
import '../views.css' //'./views.css'
import { MergeMapOperator } from '../../../../../../node_modules/rxjs/operators/mergeMap'

const FormItem = Form.Item
const Panel = Collapse.Panel
const { DateLongFormatter } = DateFormatter
const button_size = 'small'

const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'
class FabricColorForm extends Component {
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
              <Col md={12} sm={12} xs={12}>
                <FormItem label={'COLOR'}>
                  {getFieldDecorator('fabriccolor_code', {
                    rules: [{ required: true, message: 'Vui lòng nhập tên màu vải!' }],
                    initialValue: this.props.data.fabriccolor_code,
                  })(<Input placeholder="tên màu vải" />)}
                </FormItem>
              </Col>
            </Row>
          </Grid>
        </Form>
      </Modal>
    )
  }
}

const WrappedFabricColorForm = Form.create()(FabricColorForm)

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
    const { getFieldDecorator } = this.props.form
    const columns = [
      // {key: '_id', name: 'id', hidd: false },
      { key: 'fabriccolor_code', dataIndex: 'fabriccolor_code', title: 'COLOR', name: 'COLOR' },
      {
        key: 'create_date',
        dataIndex: 'create_date',
        title: 'CREATE DATE',
        name: 'CREATE DATE',
        formatter: DateLongFormatter,
        render: (text, record) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_LONG_DATE)}</span>
        ),
      },
      {
        key: 'update_date',
        dataIndex: 'update_date',
        title: 'UPDATE DATE',
        name: 'UPDATE DATE',
        formatter: DateLongFormatter,
        render: (text, record) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_LONG_DATE)}</span>
        ),
      },
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
        <WrappedFabricColorForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalvisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={this.state.selected_fabriccolor}
        />
        <Table
          style={{ marginTop: '5px' }}
          rowKey={'_id'}
          columns={columns}
          dataSource={this.state.data_fabriccolors}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? 'even-row' : 'old-row'
          }}
          onRow={record => {
            return {
              onClick: () => {
                this.setState({ selected_fabriccolor: record })
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

export default WarehouseFabricColor
