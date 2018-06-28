import React from 'react'
import Page from 'components/LayoutComponents/Page'

class FabricPage extends React.Component {
  static defaultProps = {
    roles: ['Kho Vải', 'Kế Hoạch'],
  }

  render() {
    const props = this.props
    return (
      <Page {...props}>
        <h1>test3</h1>
      </Page>
    )
  }
}

export default FabricPage
