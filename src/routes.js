import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedSwitch } from 'reactRouterConnected'
import Loadable from 'react-loadable'
import Page from 'components/LayoutComponents/Page'
import NotFoundPage from 'pages/NotFoundPage'
import HomePage from 'pages/Dashboard'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => null,
  })
/*
const loadableRoutes = {
  //Login Page
  '/login': {
    component: loadable(() => import('pages/LoginPage')),
  },
  // Dashboards
  '/dashboard': {
    component: loadable(() => import('pages/Dashboard')),
  },

  '/fabric': {
    component: loadable(() => import('pages/PreProduction/Fabric/Warehouse')),
  },
}
*/

class Routes extends React.Component {
  timeoutId = null
  state = {
    links: [],
    loadableRoutes: {},
  }

  componentDidMount() {
    let loadableRoutes = {}
    loadableRoutes['/login'] = { component: loadable(() => import('pages/LoginPage')) }
    let data = window.sessionStorage.getItem('app.User')
    if (data) {
      data = JSON.parse(data)
      for (let i = 0; i < data.link.length; i++) {
        let link = data.link[i]
        let c = loadable(() => import(`${link.com_view}`))
        loadableRoutes[`${link.name}`] = { component: c }
      }
    }
    this.setState({ loadableRoutes: loadableRoutes })

    this.timeoutId = setTimeout(
      () => Object.keys(loadableRoutes).forEach(path => loadableRoutes[path].component.preload()),
      5000, // load after 5 sec
    )
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  render() {
    let loadableRoutes = this.state.loadableRoutes
    //console.log('loadableRoutes 1=>' + JSON.stringify(loadableRoutes));

    return (
      <ConnectedSwitch>
        <Route exact path={'/'} component={HomePage} />
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
