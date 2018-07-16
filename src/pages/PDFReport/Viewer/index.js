import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import CustomCard from 'components/LayoutComponents/CustomCard'
import Helmet from 'react-helmet'
import ViewerForm from './ViewerForm'

class PdfViewer extends Component {
  static defaultProps = {
    pathName: 'Report Viewer',
  }

  render() {
    const props = { ...this.props }

    return (
      <Page {...props}>
        <Helmet title="Report Viewer" />
        <CustomCard title="Report Viewer">
          <ViewerForm dept={props.match.params.dept} />
        </CustomCard>
      </Page>
    )
  }
}

export default PdfViewer
