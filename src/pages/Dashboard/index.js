import React from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import EBImage from '../../images/OMNI.jpg'

class DashboardAlphaPage extends React.Component {
  static defaultProps = {
    pathName: 'Dashboard Alpha',
   // roles: ['agent', 'administrator'],
  }

  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Dashboard Alpha" />
        <img src={EBImage} style={{ maxWidth: '100%' }} alt="" />
      </Page>
    )
  }
}

export default DashboardAlphaPage
