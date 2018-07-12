import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import _ from 'lodash'
import CustomCard from 'components/LayoutComponents/CustomCard'
import {
   Row,
   Col,
   Button,
   Upload,
   TreeSelect,
   message,
   Table
} from 'antd'
import { connect } from 'react-redux'

import axios from 'axiosInst'
import config from 'CommonConfig'

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
   }, {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text, record) => {
         return (
            <p>{text.categoryName}</p>
         )
      }
   }
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
      reportList: [],
      selectedRowKeys: []
   }

   componentDidMount() {
      this.setState({ loading: true })
      axios.get(`api/pdf/category/${this.props.user.dept._id}`)
         .then(res => {
            this.setState({ loading: false, reportCategories: res.data })
         })
         .catch(err => {
            alert(err);
         })

      axios.get(`api/pdf/report/`, { params: { user: this.props.user._id } })
         .then(res => {
            this.setState({ reportList: res.data })
         })
         .catch(err => {
            alert(err);
         })
   }

   handleSelectCategory = (value, node, extra) => {
      console.log(value)
      this.setState({ selectedCategory: value })
   }

   handleDeleteReport = () => {
      axios.delete('api/pdf/report/delete', { data: { reportIds: this.state.selectedRowKeys } })
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
      const { reportCategories, loading, selectedCategory, reportList, selectedRowKeys } = this.state
      return (
         <Row type="flex" justify="start">
            <Col span={5}>
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
                     dept: user.dept._id
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
                  <Button>
                     Choose file(s) to upload
                  </Button>
               </Upload>
            </Col>
            <Col span={19}>
               {
                  //this.state.fileReview !== '' ? <iframe title="pdf_viewer" src={`${config.baseURL}pdf/viewer.html?file=${config.baseURL}api/pdf/report/read/${fileReview}`} width="100%" height="600px" /> : null
               }
               <Button type="danger" size="small" onClick={this.handleDeleteReport} disabled={selectedRowKeys.length === 0 ? true : false}>Delete</Button>
               <Table
               style={{marginTop: '5px'}}
                  columns={columns}
                  dataSource={reportList}
                  bordered
                  size="small"
                  rowKey="_id"
                  rowSelection={this.rowSelection} />
            </Col>
         </Row>
      )
   }
}

export default UploadPDFPage
