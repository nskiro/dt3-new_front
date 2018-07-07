import React, { Component } from 'react'
import { Row, Col, Input } from 'antd'
import {
  InputNumber,
  Form,
  Collapse,
  Icon,
  Steps,
  Button,
  DatePicker,
  Select,
  Table,
  message,
} from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

import axios from '../../../axiosInst' //'../../../../../axiosInst'

import { formItemLayout, tailFormItemLayout } from "../../Common/FormStyle";

import TestFabricRelax from './relax'
import { combineAll } from 'rxjs/operator/combineAll'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel

const FORMAT_SHORT_DATE = 'MM/DD/YYYY'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'
const button_size = 'small'

const Step = Steps.Step



class TestFabricProcessView extends Component {
    constructor(props) {
      super(props)
      this.state = {
        current: 0,

        data: {}
      }
    }

    componentWillReceiveProps =(nextprops)=>{
        console.log('TestFabricProcessView  recive props '+ JSON.stringify(nextprops))
    }

    componentDidMount =()=>{
        //load detail of stk 

        // and send it to component of step
    }

    next = () => {
      const current = this.state.current + 1
      this.setState({ current })
    }
  
    prev = () => {
      const current = this.state.current - 1
      this.setState({ current })
    }

    render() {
      const { current } = this.state

      const steps = [
        { title: 'Xả Vải', content: <TestFabricRelax /> },
        { title: 'Kiểm Tra Độ Co Rút', content: 'Second-content' },
        { title: 'Kiểm Tra Trọng Lượng', content: 'Second-content' },
        { title: 'Kiểm Tra Hệ Thống 4 Điểm', content: 'Last-content' },
        { title: 'Phân Tách Nhóm Màu', content: 'Last-content' },
        { title: 'Tổng Kết', content: 'Last-content' },
      ]
      return (
        <div>
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => this.next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                Previous
              </Button>
            )}
          </div>
        </div>
      )
    }
  }

  export default TestFabricProcessView