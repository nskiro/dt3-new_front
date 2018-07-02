import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import ProfileForm from './ProfileForm'

class ProfilePage extends Component {
  static defaultProps = {
    pathName: 'Your Profile',
  }

  render() {
    const props = { ...this.props }
    return (
      <Page {...props}>
        <Helmet title="Your Profile" />
        <section className="card">
          <div className="card-body">
            <ProfileForm />
          </div>
        </section>
      </Page>
    )
  }
}

export default ProfilePage
