import React, { Component } from 'react'
import { Row, Col, Card, Icon, Tree, Spin, Modal, Select } from 'antd'
import axios from 'axiosInst'
import _ from 'lodash'

const TreeNode = Tree.TreeNode
const Option = Select.Option
class ViewerForm extends Component {

    state = {
        reportCategories: [],
        loading: false,
        visible: false,
        reportList: [],
        selectedFile: ''
    }

    componentDidMount() {
        this.setState({ loading: true })
        axios.get(`api/pdf/category/${this.props.dept}`)
            .then(res => {
                this.setState({ loading: false, reportCategories: res.data, visible: true })
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
        this.setState({ loading: true })
        axios.get(`api/pdf/report/`, { params: { dept: this.props.dept, category: selectedKeys } })
            .then(res => {
                this.setState({ loading: false, reportList: res.data })
            })
            .catch(err => {
                alert(err)
            })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const { reportCategories, loading, visible, reportList } = this.state
        return (
            <Modal
                title="Select report"
                visible={visible}
                onCancel={this.handleCancel}
            >
                <Row type="flex" justify="start">
                    <Col span={10}>
                        <Card title="Category List">
                            {
                                visible ? (
                                <Tree autoExpandParent={true} showIcon={true} onSelect={this.onCategorySelect}>
                                    {reportCategories ? this.renderTreeNodes(reportCategories) : null}
                                </Tree>
                                ) : null
                            }   
                        </Card>
                    </Col>
                    <Col span={14}>
                        <Spin spinning={loading}>
                            <Select style={{ width: '100%' }} >
                            {
                                reportList.map( o => {
                                    return <Option value={o._id}>{o.reportName}</Option>
                                })
                            }
                            </Select>
                        </Spin>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default ViewerForm