import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import CustomCard from 'components/LayoutComponents/CustomCard'
import Helmet from 'react-helmet'
import ViewerForm from './ViewerForm'
import ExcelViewer from './ExcelViewer'

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
          {props.match.params.dept === '5b4db4f5fd54131cdcf90c85' ? (
            <ExcelViewer dept={props.match.params.dept} />
          ) : (
            <ViewerForm dept={props.match.params.dept} key={props.match.params.dept} />
          )}
        </CustomCard>
      </Page>
    )
  }
}

export default PdfViewer
