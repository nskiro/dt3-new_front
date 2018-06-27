import React from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import EBImage from '../../images/OMNI.jpg'

class DashboardAlphaPage extends React.Component {
  static defaultProps = {
    pathName: 'Dashboard Alpha',
    roles: JSON.parse(window.sessionStorage.getItem('app.Roles')),
  }
  render() {
    //console.log('roles =>' + JSON.stringify(this.defaultProps))
    const props = this.props
    console.log(props);
    return (
      <Page {...props}>
        <Helmet title="Dashboard Alpha" />
        <img src={EBImage} style={{ maxWidth: '100%' }} alt="" />
      </Page>
    )
  }
}

export default DashboardAlphaPage
