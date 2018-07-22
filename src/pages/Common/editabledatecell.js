import React, { Component } from 'react'
import { DatePicker, Icon } from 'antd'
import moment from 'moment'
const { formatDate } = require('./formatdate')
class EditableDateCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
      editable: false,
    }
  }
  handleChange = (e) => {
    const value = moment(e).format(formatDate.shortType)
    this.setState({ editable: false, value })
    this.props.onChange(value)
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
            suffix={<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />}
          />
        ) : (
            <div style={{ paddingRight: 0 }}>
              {value || ' '}
              <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
            </div>
          )}
      </div>
    )
  }
}

export default EditableDateCell
