import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import CustomCard from 'components/LayoutComponents/CustomCard'
import Helmet from 'react-helmet'
import ReportUploadForm from './UploadReport'

class PdfReport extends Component {
  static defaultProps = {
    pathName: 'Manage PDF Report',
  }

  render() {
    const props = { ...this.props }

    return (
      <Page {...props}>
        <Helmet title="Manage PDF Report" />
        <CustomCard title="Manage PDF Report">
          <ReportUploadForm />
        </CustomCard>
      </Page>
    )
  }
}

export default PdfReport
