import React, { Component } from 'react'
import { DatePicker, Icon } from 'antd'
import moment from 'moment'
class EditableDateCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
  }

  handleChange = e => {
    console.log(e)
    try {
      const value = moment(e)
      this.setState({ value, editable: false })
    } catch (err) {
      const value = e
      this.setState({ value: '' })
    }


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
      <div className="editable-cell" style={{ paddingRight: 0 }}>
        {editable ? (
          <DatePicker
            value={value}
            onChange={this.handleChange}
            format={'MM/DD/YYYY'}
            onPressEnter={this.check}
            onKeyDown={this.dateInputKeyDown}
            suffix={<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />}
          />
        ) : (
            <div style={{ paddingRight: 0 }}>
              {value ? (moment(value).format('MM/DD/YYYY')) : ' '}
              <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
            </div>
          )}
      </div>
    )
  }
}

export default EditableDateCell
