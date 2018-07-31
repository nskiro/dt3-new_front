import React, { Component } from 'react'
import {
  Row,
  Col,
  Card,
  Icon,
  Tree,
  Spin,
  Select,
  message,
  Calendar,
  Alert,
  Tag,
  Divider,
} from 'antd'
import axios from 'axiosInst'
import _ from 'lodash'
import config from 'CommonConfig'
import { Element, scroller } from 'react-scroll'

const TreeNode = Tree.TreeNode
const Option = Select.Option
const { Meta } = Card
class ViewerForm extends Component {
  state = {
    reportCategories: [],
    loadingCategory: false,
    loadingReport: false,
    reportList: [],
    selectedFile: '',
    selectedDept: null,
  }

  componentDidMount() {
    this.setState({ loadingCategory: true })
    axios.get('/api/admin/dept', { params: { id: this.props.dept } }).then(res => {
      this.setState({ selectedDept: res.data[0] })
    })
    axios
      .get(`api/pdf/category/${this.props.dept}`)
      .then(res => {
        this.setState({ loadingCategory: false, reportCategories: res.data })
        if (res.data.length === 1) {
          axios
            .get(`api/pdf/report/`, {
              params: { dept: this.props.dept, category: res.data[0]._id },
            })
            .then(res => {
              if (res.data.length > 0) {
                message.success('Reports have been loaded')
              } else {
                message.error('No report was found')
              }
              this.setState({ loadingCategory: false, loadingReport: false, reportList: res.data })
            })
            .catch(err => {
              alert(err)
            })
        }
      })
      .catch(err => {
        alert(err)
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

  onCategorySelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      this.setState({ loadingReport: true })
      axios
        .get(`api/pdf/report/`, { params: { dept: this.props.dept, category: selectedKeys } })
        .then(res => {
          if (res.data.length > 0) {
            message.success('Reports have been loaded')
          } else {
            message.error('No report was found')
          }
          this.setState({ loadingReport: false, reportList: res.data })
        })
        .catch(err => {
          alert(err)
        })
    }
  }

  onSelectReport = value => {
    this.setState({ selectedFile: value })
    scroller.scrollTo('viewer', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    })
  }

  render() {
    const {
      reportCategories,
      loadingCategory,
      loadingReport,
      reportList,
      selectedFile,
      selectedDept,
    } = this.state
    return (
      <div>
        <Row>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: '90%', display: 'block', margin: 'auto' }}
              cover={
                selectedDept ? (
                  <img
                    alt="Avatar"
                    src={`data:${selectedDept.avatar.mimetype};base64,${selectedDept.avatar.data}`}
                  />
                ) : null
              }
            >
              <Meta title={selectedDept ? <Tag color="#108ee9"> {selectedDept.name}</Tag> : ''} />
            </Card>
          </Col>
          <Col span={12}>
            {selectedDept && selectedDept.note ? (
              <span>
                <Alert
                  message="Note"
                  description={selectedDept.note.replace('\\n', '<br>')}
                  type="info"
                  showIcon
                />
                <Divider />
              </span>
            ) : null}
            <Row type="flex" justify="start">
              <Col span={10}>
                <label>Select report category:</label>
                {!loadingCategory ? (
                  <Tree defaultExpandAll showIcon={true} onSelect={this.onCategorySelect}>
                    {reportCategories ? this.renderTreeNodes(reportCategories) : null}
                  </Tree>
                ) : (
                  <Spin />
                )}
              </Col>
              <Col span={10}>
                <Spin spinning={loadingReport}>
                  <label>Select report file:</label>
                  <Select style={{ width: '90%' }} onSelect={this.onSelectReport}>
                    {reportList.map(o => {
                      return (
                        <Option key={o._id} value={o._id}>
                          {o.reportName}
                        </Option>
                      )
                    })}
                  </Select>
                </Spin>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Calendar fullscreen={false} style={{ width: '95%' }} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Element name="viewer" className="element">
              {selectedFile !== '' ? (
                <iframe
                  title="PDF Viewer"
                  src={`${config.baseURL}pdf/viewer.html?file=${
                    config.baseURL
                  }api/pdf/report/read/${selectedFile}`}
                  width="100%"
                  height="600px"
                />
              ) : null}
            </Element>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ViewerForm
