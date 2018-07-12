import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import CustomCard from 'components/LayoutComponents/CustomCard'
import Helmet from 'react-helmet'
import CategoryForm from './CategoryForm'
class ReportCategory extends Component {
  static defaultProps = {
    pathName: 'PDF Report Category',
  }

  render() {
    const props = { ...this.props }

    return (
      <Page {...props}>
        <Helmet title="PDF Report Category" />
        <CustomCard title="PDF Report Category">
          <CategoryForm />
        </CustomCard>
      </Page>
    )
  }
}

export default ReportCategory
