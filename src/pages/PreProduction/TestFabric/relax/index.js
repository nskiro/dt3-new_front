import React, { Component } from 'react'
import { Tabs, Form, Icon } from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

import RelaxForm from './relaxform'


const RelaxFormWapper = Form.create()(RelaxForm)

class TestFabricRelax extends Component {

    render() {
        return (<RelaxFormWapper />)
    }
}

export default TestFabricRelax