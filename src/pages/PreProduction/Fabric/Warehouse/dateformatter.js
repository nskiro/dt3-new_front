import React, { Component } from 'react'
import moment from 'moment'

//import PropTypes from 'prop-types'

const formatDate_Longtype = 'MM/DD/YYYY HH:mm:ss'
const formatDate_Shorttype = 'MM/DD/YYYY'

class DateLongFormatter extends Component {
  render() {
    if (!this.props.value) {
      return <div />
    }
    const dateformat = moment(this.props.value).format(formatDate_Longtype)
    return (
      <div style={{ marginTop: '0px' }}>
        <div>{dateformat}</div>
      </div>
    )
  }
}

/*
DateLongFormatter.propTypes = {
  // setDataForm: PropTypes.func,
  value: PropTypes.date,
}
DateLongFormatter.defaultProps = {
  value: null,
}
*/

class DateShortFormatter extends Component {
  render() {
    if (!this.props.value) {
      return <div />
    }
    const dateformat = moment(this.props.value).format(formatDate_Shorttype) // + '%';
    return (
      <div style={{ marginTop: '0px' }}>
        <div>{dateformat}</div>
      </div>
    )
  }
}

/*
DateShortFormatter.propTypes = {
  // setDataForm: PropTypes.func,
  value: PropTypes.date,
}
DateShortFormatter.defaultProps = {
  value: null,
}
*/

export default { DateLongFormatter, DateShortFormatter }
