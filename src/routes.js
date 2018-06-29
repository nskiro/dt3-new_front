import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedSwitch } from 'reactRouterConnected'
import Loadable from 'react-loadable'
import Page from 'components/LayoutComponents/Page'
import NotFoundPage from 'pages/NotFoundPage'
import HomePage from 'pages/Dashboard'
import Login from 'pages/LoginPage'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => null,
  })


class Routes extends React.Component {
  timeoutId = null
  state = {
    links: [],
    loadableRoutes: {},
  }


  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  render() {
    let loadableRoutes = {};//this.state.loadableRoutes
    let data = window.sessionStorage.getItem('app.User')
    if (data) {
      data = JSON.parse(data)
      for (let i = 0; i < data.link.length; i++) {
        let link = data.link[i]

        try {
          if (link.com_view) {
            let c = loadable(() => import(`${link.com_view}`))
            loadableRoutes[`${link.name}`] = { component: c }
          } else {
            console.log('menu name =' + link.name + '==>com_view =' + link.com_view)
          }
        } catch (ex) {
          console.log('can not load component =>' + `${link.com_view}`)
        }
      }
    }

    return (
      <ConnectedSwitch>
        <Route exact path={'/'} component={HomePage} />
        <Route exact path={'/login'} component={Login} />
        {Object.keys(loadableRoutes).map(path => {
          const { exact, component, ...props } = loadableRoutes[path]
          props.exact = exact === void 0 || exact || false // set true as default
          return <Route key={path} path={path} component={component} {...props} />
        })}
        <Route
          render={() => (
            <Page>
              <NotFoundPage />
            </Page>
          )}
        />
      </ConnectedSwitch>
    )
  }
}
//let loadableRoutes = this.state.loadableRoutes;
//export { loadableRoutes }
export default Routes
