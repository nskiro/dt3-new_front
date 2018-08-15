import React, { Component } from 'react'
import {
  Calendar,
  Row,
  Col,
  Card,
  Alert,
  Divider,
  Tag,
  Select,
  Spin,
  message,
  Checkbox,
  Collapse
} from 'antd'
import _ from 'lodash'
import axios from 'axiosInst'
import DataGrid from 'react-data-grid'
import { Toolbar, Data, Filters } from 'react-data-grid-addons'
import { Element, scroller } from 'react-scroll'

const { Meta } = Card
const { Option } = Select
const { Selectors } = Data
const { Panel } = Collapse
const removeCheckItem = /__EMPTY|Kh Cắt|Ngày Cắt Vải|Ngày Cắt Lưới|Định Mức|Số Lượng|SL Thực Phát|Ngày Phát|Thông Tin|SL Vải|ĐM|SL|TT|KH CẮT|NGÀY CẮT VẢI|NGÀY CẮT LƯỚI|ĐỊNH MỨC|SỐ LƯỢNG|SL THỰC PHÁT|NGÀY PHÁT|THÔNG TIN/g

class ExcelViewer extends Component {
  state = {
    selectedDept: null,
    loadingReport: false,
    loadingCategory: false,
    reportCategories: [],
    reportList: [],
    rows: [],
    filters: {},
    columns: [],
    checkboxColumns: [],
    checkboxGroup: []
  }

  componentDidMount() {
    this.setState({ loadingCategory: true })
    axios.get('api/admin/dept', { params: { id: this.props.dept } }).then(res => {
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

  onSelectReport = value => {
    this.setState({ loadingReport: true })
    axios
      .get(`api/pdf/report/readexcel/${value}`)
      .then(res => {
        this.setState({
          loadingReport: false,
          rows: res.data.data,
          columns: res.data.columns,
          checkboxColumns: _.filter(res.data.columns, o => {
            return !o.visible && !o.name.match(removeCheckItem)
          }),
          checkboxGroup: res.data.group
        })
        scroller.scrollTo('viewer', {
          duration: 800,
          delay: 0,
          smooth: 'easeInOutQuart',
        })
      })
      .catch(err => {
        alert(err)
      })
  }

  rowGetter = index => {
    return Selectors.getRows(this.state)[index]
  }

  rowsCount = () => {
    return Selectors.getRows(this.state).length
  }

  handleFilterChange = filter => {
    let newFilters = Object.assign({}, this.state.filters)
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter
    } else {
      delete newFilters[filter.column.key]
    }
    this.setState({ filters: newFilters })
  }

  getValidFilterValues = columnId => {
    let values = this.state.rows.map(r => r[columnId])
    return values.filter((item, i, a) => {
      return i === a.indexOf(item)
    })
  }

  handleOnClearFilters = () => {
    this.setState({ filters: {} })
  }

  onCheckedChange = e => {
    const value = e.target.value
    let temp = [...this.state.columns]
    _.forEach(temp, obj => {
      if (_.lowerCase(obj.key).includes(_.lowerCase(value))) obj.visible = e.target.checked
    })
    this.setState({ columns: temp })
  }

  render() {
    const { selectedDept, loadingReport, reportList, columns, checkboxColumns, checkboxGroup } = this.state
    const visibleColumns = _.filter(columns, o => {
      return o.visible
    })
    let checkboxsComp = null
    if (checkboxGroup.length > 0) {
      checkboxsComp = (
        <Collapse defaultActiveKey={['General']} accordion>
          {
            checkboxGroup.map(group => {
              let arrCols = group.group_columns.split(',')
              return (
                <Panel header={group.group_name} key={group.group_name}>
                  <Row>
                    {
                      checkboxColumns.map(value => {
                        if (_.findIndex(arrCols, o => o === value.name) > -1) {
                          return (
                            <Col xs={6} sm={3} key={value.key}>
                              <Checkbox value={value.key} onChange={this.onCheckedChange}>
                                {value.name}
                              </Checkbox>
                            </Col>
                          )
                        }
                        return null
                      })
                    }
                  </Row>
                </Panel>
              )
            })
          }
        </Collapse>
      )
    }
    else {
      checkboxsComp = (
        checkboxColumns.map(value => {
            return (
              <Col xs={6} sm={3} key={value.key}>
                <Checkbox value={value.key} onChange={this.onCheckedChange}>
                  {value.name}
                </Checkbox>
              </Col>
            )
        })
      )
    }

    return (
      <span>
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
        <Row style={{ marginTop: '5px' }}>
          {checkboxsComp}
        </Row>
        <Row style={{ marginTop: '5px' }}>
          <Col xs={24} md={24}>
            <Element name="viewer" className="element">
              <DataGrid
                columns={visibleColumns}
                rowGetter={this.rowGetter}
                enableCellSelect={true}
                rowsCount={this.rowsCount()}
                minHeight={600}
                rowHeight={50}
                toolbar={<Toolbar enableFilter={true} />}
                onAddFilter={this.handleFilterChange}
                getValidFilterValues={this.getValidFilterValues}
                onClearFilters={this.handleOnClearFilters}
                resizeable
                onColumnResize={(colIdx, newWidth) => {
                  console.log(colIdx, newWidth)
                }}
              />
            </Element>
          </Col>
        </Row>
      </span>
    )
  }
}

export default ExcelViewer
