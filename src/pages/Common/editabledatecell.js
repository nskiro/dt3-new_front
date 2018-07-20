import React, { Component } from 'react'
import { DatePicker, Icon } from 'antd'
import moment from 'moment'
const { formatDate } = require('./formatdate')
class EditableDateCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
  }

  handleChange = e => {
    if (e.length <= 10) {
      const value = moment(e, formatDate.shortType)
      this.setState({ value, editable: false })
    } else {
      const value = moment(new Date(e)).format(formatDate.shortType)
      this.setState({ value, editable: false })
    }
  }

  check = () => {
    this.setState({ editable: false })
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }

  dateInputKeyDown = e => {
    if (e.keyCode === 13) {
      this.check()
    }
  }

  edit = () => {
    this.setState({ editable: true })
  }

  render() {
    const { value, editable } = this.state
    return (
      <div className="editable-cell" style={{ paddingRight: 0 }}>
        {editable ? (
          <DatePicker
            value={moment(value, formatDate.shortType)}
            onChange={this.handleChange}
            format={formatDate.shortType}
            onPressEnter={this.check}
            onKeyDown={this.dateInputKeyDown}
            suffix={<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />}
          />
        ) : (
          <div style={{ paddingRight: 0 }}>
            {value ? moment(value).format(formatDate.shortType) : ' '}
            <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
          </div>
        )}
      </div>
    )
  }
}

export default EditableDateCell