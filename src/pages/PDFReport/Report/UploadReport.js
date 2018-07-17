import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import _ from 'lodash'
import CustomCard from 'components/LayoutComponents/CustomCard'
import { Row, Col, Button, Upload, TreeSelect, message, Table, Select, Popconfirm } from 'antd'
import { connect } from 'react-redux'

import axios from 'axiosInst'
import config from 'CommonConfig'

const Option = Select.Option

const mapStateToProps = ({ app }, props) => {
  const { userState } = app
  return {
    user: userState,
  }
}

const columns = [
  {
    title: 'File Name',
    dataIndex: 'reportName',
    key: 'reportName',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (text, record) => {
      return <p>{text.categoryName}</p>
    },
  },
]

@connect(mapStateToProps)
class UploadPDFPage extends Component {
  static defaultProps = {
    pathName: 'Upload PDF Report',
  }

  state = {
    loading: false,
    reportCategories: [],
    selectedCategory: undefined,
    selectedDept: undefined,
    reportList: [],
    selectedRowKeys: [],
  }

  componentDidMount() {
    this.setState({ loading: true })
    /*axios
      .get(`api/pdf/category/${this.props.user.dept._id}`)
      .then(res => {
        this.setState({ loading: false, reportCategories: res.data })
      })
      .catch(err => {
        alert(err)
      })*/

    axios
      .get(`api/pdf/report/`, { params: { user: this.props.user._id } })
      .then(res => {
        this.setState({ reportList: res.data })
      })
      .catch(err => {
        alert(err)
      })
  }

  loadCategory = value => {
    this.setState({ loading: true, selectedDept: value })
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

  handleSelectCategory = (value, node, extra) => {
    console.log(value)
    this.setState({ selectedCategory: value })
  }

  handleDeleteReport = () => {
    axios
      .delete('api/pdf/report/delete', { data: { reportIds: this.state.selectedRowKeys } })
      .then(res => {
        let temp = [...this.state.reportList]
        temp = temp.filter(obj => !_.includes(res.data, obj._id))
        this.setState({ reportList: temp, selectedRowKeys: [] })
      })
      .catch(err => {
        console.log(err)
      })
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRowKeys })
    },
  }

  render() {
    const { user } = this.props
    const { reportCategories, loading, selectedCategory, reportList, selectedRowKeys, selectedDept } = this.state
    return (
      <Row type="flex" justify="start">
        <Col span={5}>
          <Select style={{ width: '90%', marginBottom: '5px' }} onSelect={this.loadCategory} placeholder="Select department">
            {
              user.dept.length > 0 ? user.dept.map(o => {
                return <Option key={o._id} value={o._id}>{o.name}</Option>
              }) : null
            }
          </Select>
          <TreeSelect
            allowClear={true}
            placeholder="Select report category"
            style={{ width: '90%', marginBottom: '5px' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={reportCategories}
            treeDefaultExpandAll
            disabled={loading}
            onChange={this.handleSelectCategory}
          />,
          <Upload
            disabled={selectedCategory === undefined ? true : false}
            name="reportFile"
            action={`${config.baseURL}api/pdf/report/add`}
            multiple={true}
            data={{
              category: selectedCategory,
              user: user._id,
              dept: selectedDept
            }}
            onChange={info => {
              const res = info.file.response
              const status = info.file.status
              if (status === 'done') {
                let temp = [...reportList]
                temp.push(res)
                this.setState({ reportList: [...temp] })
              } else if (status === 'error') {
                console.log(res)
              }
            }}
          >
            <Button>Choose file(s) to upload</Button>
          </Upload>
        </Col>
        <Col span={19}>
          <Popconfirm
            title="Are you sure delete?"
            onConfirm={this.handleDeleteReport}
            okText="Yes"
            cancelText="No">
              <Button
                type="danger"
                size="small"
                disabled={selectedRowKeys.length === 0 ? true : false}>
                Delete
              </Button>
          </Popconfirm>
          <Table
            style={{ marginTop: '5px' }}
            columns={columns}
            dataSource={reportList}
            bordered
            size="small"
            rowKey="_id"
            rowSelection={this.rowSelection}
          />
        </Col>
      </Row>
    )
  }
}

export default UploadPDFPage
