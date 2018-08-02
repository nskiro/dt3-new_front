import React, { Component } from 'react'
import { Input, Button, Form, Modal, Collapse, Table, Row, Col } from 'antd'
import PropTypes from 'prop-types'

//import ReactDataGrid from 'react-data-grid'
//import update from 'immutability-helper';

import { formItemLayout, tailFormItemLayout } from '../../../../Common/FormStyle'
import DateFormatter from '../dateformatter'

import moment from 'moment'
import axios from '../../../../../axiosInst'

const FormItem = Form.Item
const Panel = Collapse.Panel
const { DateLongFormatter, DateShortFormatter } = DateFormatter
const button_size = 'small'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'

class ProviderForm extends Component {
  render() {
    const { visible, onCancel, onCreate, form } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        title="SUPPILER"
        visible={visible}
        onOk={onCreate}
        maskClosable={false}
        onCancel={onCancel}
      >
        <Form>
          <Row gutter={2}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <FormItem {...formItemLayout}>
                {getFieldDecorator('id', { initialValue: this.props.data._id })(
                  <Input name="id" style={{ display: 'none', visible: false }} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={2}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
              xl={{ span: 24 }}
            >
              <FormItem {...formItemLayout} style={{ paddingLeft: '5px' }} label={'SUPPLIER'}>
                {getFieldDecorator('provider_code', {
                  rules: [{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }],
                  initialValue: this.props.data.provider_code,
                })(<Input placeholder="nhà cung cấp" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
ProviderForm.propTypes = {
  // setDataForm: PropTypes.func,
  data: PropTypes.object,
}
ProviderForm.defaultProps = {}

class WarehouseFabricProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      modalvisible: false,
      provider_code: '',
      provider_name: '',
      data_providers: [],

      selected_provider: { provider_code: undefined, provider_name: undefined },
    }
  }

  handleSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (values.provider_code) {
        this.loadSearchProviders(values)
      } else {
        this.loadSearchProviders({})
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
    this.loadSearchProviders({})
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
          selected_provider: { provider_code: undefined, provider_name: undefined },
        })
      } else if (mod === 'edit') {
        let provider = this.state.selected_provider
        if (provider.provider_code) {
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

  handleCreate = e => {
    const form = this.formRef.props.form

    form.validateFields((err, values) => {
      if (err) {
        return
      }
      if (!values.provider_code) {
        return
      }
      let data = {
        _id: values.id,
        provider_code: values.provider_code,
        provider_name: values.provider_name,
      }

      if (!data.provider_name) {
        data.provider_name = data.provider_code
      }
      if (values.id) {
        console.log('call update')
        axios
          .post(`api/fabric/provider/update/${values.id}`, data)
          .then(res => {
            this.loadSearchProviders({})
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        console.log('call add')
        axios
          .post('api/fabric/provider/add', data)
          .then(res => {
            this.loadSearchProviders({})
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
    return this.state.data_providers[i]
  }

  loadSearchProviders = v => {
    axios
      .get('api/fabric/provider/get', { params: v })
      .then(res => {
        let data = res.data
        // update data
        this.setState({ data_providers: data })
      })
      .catch(err => {
        console.log(err)
        this.setState({ data_providers: [] })
      })
  }

  componentDidMount = () => {
    this.loadSearchProviders({})
  }

  onRowProviderClick = e => {
    let index = e
    if (index >= 0 && index < this.state.data_providers.length) {
      let provider = this.state.data_providers[index]
      this.setState({ selected_provider: provider })
    }
  }
  render() {
    const WrappedProviderForm = Form.create()(ProviderForm)
    const { getFieldDecorator } = this.props.form
    const columns = [
      // {key: '_id', name: 'id', hidd: false },
      { key: 'provider_code', dataIndex: 'provider_code', title: 'SUPPLIER', name: 'SUPPLIER' },
      {
        key: 'create_date',
        dataIndex: 'create_date',
        title: 'CREATE DATE',
        name: 'CREATE DATE',
        render: (text, record) => (
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
                  <FormItem {...formItemLayout} label={'SUPPLIER'}>
                    {getFieldDecorator('provider_code', {})(<Input placeholder="nhà cung cấp" />)}
                  </FormItem>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                >
                  <FormItem {...formItemLayout}>
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
                      {' '}
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
                value="edit"
                onClick={this.showModal}
              >
                EDIT
              </Button>
              <Button
                icon="sync"
                size={button_size}
                style={{ marginLeft: 8 }}
                type="primary"
                onClick={this.onRefeshGrid}
              >
                {' '}
                REFESH{' '}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <WrappedProviderForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalvisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={this.state.selected_provider}
        />
        <Table
          style={{ marginTop: '5px' }}
          rowKey={'_id'}
          columns={columns}
          dataSource={this.state.data_providers}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? 'even-row' : 'old-row'
          }}
          onRow={record => {
            return {
              onClick: () => {
                this.setState({ selected_provider: record })
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

export default WarehouseFabricProvider
