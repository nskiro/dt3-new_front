import React from 'react'
import Page from 'components/LayoutComponents/Page'

class HomePage extends React.Component {
  static defaultProps = {
    roles: ['init'],
  }

  render() {
    const props = this.props
    return (
      <Page {...props}>
        <h1>abc</h1>
      </Page>
    )
  }
}

export default HomePage
