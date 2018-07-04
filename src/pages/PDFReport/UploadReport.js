import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

class UploadPDFPage extends Component {
  static defaultProps = {
    pathName: 'Upload PDF Report',
  }

  render() {
    const props = { ...this.props }
    return (
      <Page {...props}>
        <Helmet title="Upload PDF Report" />
        <section className="card">
          <div className="card-body">Form upload</div>
        </section>
      </Page>
    )
  }
}

export default UploadPDFPage
