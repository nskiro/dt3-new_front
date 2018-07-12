import React, { Component } from 'react'
import { Table, Form, Button, Icon, Row, Col } from 'antd'
import EditableInputCell from '../../../Common/editableinputcell'
import EditableNumberCell from '../../../Common/editablenumbercell'
import EditableDateCell from '../../../Common/editabledatecell'
import { formItemLayout, tailFormItemLayout } from '../../../Common/FormStyle'

import axios from '../../../../axiosInst' //'../../../../../axiosInst'
import _ from 'lodash'

class TestFabricSkewShrinlege extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data_detail: [],
      data_detail_id: [],
      data_relax: [],
    }
  }

  render() {
    return (
      <Form>
        <div>TestFabricSkewShrinlege</div>
      </Form>
    )
  }
}

export default TestFabricSkewShrinlege
