import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import CustomCard from 'components/LayoutComponents/CustomCard'
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  TreeSelect,
  Tree,
  Icon,
  Spin,
  Divider,
  Card,
  Popconfirm,
  Alert,
  Select,
} from 'antd'
import { connect } from 'react-redux'

import axios from 'axiosInst'

const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const Option = Select.Option

const mapStateToProps = ({ app }, props) => {
  const { userState } = app
  return {
    user: userState,
  }
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

@connect(mapStateToProps)
@Form.create()
class PDFCategoryPage extends Component {
  state = {
    loading: false,
    reportCategories: [],
    selectedNode: null,
  }
  static defaultProps = {
    pathName: 'PDF Report Category',
  }

  componentDidMount() {}

  loadCategory = value => {
    this.setState({ loading: true })
    axios
      .get(`api/pdf/category/${value}`)
      .then(res => {
        res.data = res.data === '' ? [] : res.data
        this.setState({ loading: false, reportCategories: res.data })
      })
      .catch(err => {
        alert(err)
      })
  }

  addCategory = e => {
    e.preventDefault()
    this.props.form.validateFields((err, value) => {
      if (!err) {
        this.setState({ loading: true })
        axios
          .post('/api/pdf/category/add', value)
          .then(res => {
            this.setState({ loading: false, reportCategories: res.data })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  updateCategory = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        this.setState({ loading: true })
        axios
          .put('/api/pdf/category/update', value)
          .then(res => {
            this.setState({ loading: false, reportCategories: res.data })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  deleteCategory = () => {
    console.log(this.state.selectedNode)
    if (this.state.selectedNode) {
      axios
        .delete('/api/pdf/category/delete', { data: { categoryId: this.state.selectedNode._id } })
        .then(res => {
          let temp = [...this.state.reportCategories]
          this.updateCategoryNode(temp, res.data._id)
          this.setState({ reportCategories: temp })
        })
        .catch(err => {})
    }
  }

  onCategorySelect = (selectedKeys, info) => {
    this.setState({
      selectedNode: info.node.props.dataRef ? info.node.props.dataRef : info.node.props,
    })
  }

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} icon={<Icon type="folder" />}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} icon={<Icon type="folder" />} />
    })
  }

  updateCategoryNode = (array, id) => {
    for (var i = 0; i < array.length; ++i) {
      var obj = array[i]
      if (obj._id === id) {
        // splice out 1 element starting at position i
        array.splice(i, 1)
        return true
      }
      if (obj.children) {
        if (this.updateCategoryNode(obj.children, id)) {
          if (obj.children.length === 0) {
            // delete children property when empty
            delete obj.children

            // or, to delete this parent altogether
            // as a result of it having no more children
            // do this instead
            //array.splice(i, 1);
          }
          return true
        }
      }
    }
  }

  render() {
    const props = { ...this.props }
    const { user } = this.props
    const { getFieldDecorator } = this.props.form
    const { loading, reportCategories, selectedNode } = this.state
    return (
      <Row type="flex" justify="start">
        <Col span={5}>
          <Card title="Category List" style={{ width: '90%' }}>
            {!loading ? (
              <span>
                <Select
                  style={{ width: '100%' }}
                  onSelect={this.loadCategory}
                  placeholder="Select dept"
                >
                  {user.dept.length > 0
                    ? user.dept.map(o => {
                        return (
                          <Option key={o._id} value={o._id}>
                            {o.name}
                          </Option>
                        )
                      })
                    : null}
                </Select>
                <Tree autoExpandParent={true} showIcon={true} onSelect={this.onCategorySelect}>
                  {reportCategories ? this.renderTreeNodes(reportCategories) : null}
                </Tree>
              </span>
            ) : (
              <Spin />
            )}
          </Card>
        </Col>
        <Col span={10}>
          <Form layout="horizontal" onSubmit={this.addCategory}>
            <FormItem label="">
              {getFieldDecorator('categoryId', {
                initialValue: selectedNode ? selectedNode._id : '',
              })(<Input type="hidden" />)}
            </FormItem>
            <FormItem label="Department" {...formItemLayout}>
              {getFieldDecorator('dept', {
                rules: [{ required: true, message: 'Please select department to report!' }],
                initialValue: selectedNode ? selectedNode.dept._id : '',
              })(
                <Select style={{ width: '100%' }}>
                  {user.dept.length > 0
                    ? user.dept.map(o => {
                        return (
                          <Option key={o._id} value={o._id}>
                            {o.name}
                          </Option>
                        )
                      })
                    : null}
                </Select>,
              )}
            </FormItem>
            <FormItem label="Category Name" {...formItemLayout}>
              {getFieldDecorator('categoryName', {
                rules: [{ required: true, message: 'Please input report category name!' }],
                initialValue: selectedNode ? selectedNode.title : '',
              })(<Input />)}
            </FormItem>
            <FormItem label="Parent Category" {...formItemLayout}>
              {getFieldDecorator('parentId', {
                initialValue: selectedNode ? selectedNode.parentId : '',
              })(
                <TreeSelect
                  allowClear={true}
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={reportCategories}
                  treeDefaultExpandAll
                />,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add
              </Button>
              <Divider type="vertical" />
              <Button
                type="success"
                loading={loading}
                disabled={selectedNode ? false : true}
                onClick={this.updateCategory}
              >
                Update
              </Button>
              <Divider type="vertical" />
              <Popconfirm
                title="Are you sure delete?"
                onConfirm={this.deleteCategory}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger" loading={loading} disabled={selectedNode ? false : true}>
                  Delete
                </Button>
              </Popconfirm>
            </FormItem>
          </Form>
          <Alert
            message="Warning"
            description="If deleting a category, all reports in category will be deleted too."
            type="warning"
            showIcon
          />
        </Col>
      </Row>
    )
  }
}

export default PDFCategoryPage
