import React, { Component } from 'react'
import { DatePicker, Icon } from 'antd'

class EditableDateCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
  }

  handleChange = e => {
    console.log(e)
    const value = e
    this.setState({ value })
  }

  check = () => {
    console.log('editabledatecell call check')
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
      <div className="editable-cell">
        {editable ? (
          <DatePicker
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.check}
            onKeyDown={this.dateInputKeyDown}
            suffix={<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />}
          />
        ) : (
          <div style={{ paddingRight: 24 }}>
            {value || ' '}
            <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
          </div>
        )}
      </div>
    )
  }
}

export default EditableDateCell
