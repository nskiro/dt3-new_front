import React, { Component } from 'react'
import { InputNumber, Icon } from 'antd'

class EditableNumberCell extends Component {
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
    this.setState({ editable: false })
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }

  numberInputKeyDown = e => {
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
          <InputNumber
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.check}
            onKeyDown={this.numberInputKeyDown}
            onBlur={this.check}
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

export default EditableNumberCell
