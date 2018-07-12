import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import CustomCard from 'components/LayoutComponents/CustomCard'
import Helmet from 'react-helmet'

class PdfViewer extends Component {
  static defaultProps = {
    pathName: 'Report Viewer',
  }

  componentDidMount() {
    console.log(this.props.location.search)
  }

  render() {
    const props = { ...this.props }

    return (
      <Page {...props}>
        <Helmet title="Report Viewer" />
        <CustomCard title="Report Viewer" />
      </Page>
    )
  }
}

export default PdfViewer
