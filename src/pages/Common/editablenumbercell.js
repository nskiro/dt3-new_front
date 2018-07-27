import React, { Component } from 'react'
import { InputNumber, Icon, Tag } from 'antd'

class EditableNumberCell extends Component {
  state = {
    value: this.props.value,
    prefix: this.props.prefix,
    suffix: this.props.suffix,
    editable: false,
  }

  handleChange = e => {
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
    const { value, editable, prefix, suffix } = this.state
    const prefix_render = prefix ? prefix + ':' : ''
    const suffix_render = suffix ? suffix : ''
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
              {value ? <Tag color='#2db7f5'>{prefix_render}{value}{suffix_render}</Tag> : '0'}
              <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
            </div>
          )
        }
      </div>
    )
  }
}

export default EditableNumberCell
