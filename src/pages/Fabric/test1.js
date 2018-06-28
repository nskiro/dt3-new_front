import React from 'react'
import Page from 'components/LayoutComponents/Page'

class FabricPage extends React.Component {
  static defaultProps = {
    roles: ['Kho Vải'],
  }

  render() {
    const props = this.props
    return (
      //<Page {...props}>
      <h1>test1</h1>
      //</Page>
    )
  }
}

export default FabricPage
