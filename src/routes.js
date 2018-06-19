import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedSwitch } from 'reactRouterConnected'
import Loadable from 'react-loadable'
import Page from 'components/LayoutComponents/Page'
import NotFoundPage from 'pages/DefaultPages/NotFoundPage'
import HomePage from 'pages/DefaultPages/HomePage'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => null,
  })

const loadableRoutes = {
  // Default Pages
  '/documentation': {
    component: loadable(() => import('pages/DefaultPages/DocumentationPage')),
  },
  '/login': {
    component: loadable(() => import('pages/DefaultPages/LoginPage')),
  },
  '/pages/login-alpha': {
    component: loadable(() => import('pages/DefaultPages/LoginAlphaPage')),
  },
  '/pages/login-beta': {
    component: loadable(() => import('pages/DefaultPages/LoginBetaPage')),
  },
  '/pages/register': {
    component: loadable(() => import('pages/DefaultPages/RegisterPage')),
  },
  '/pages/lockscreen': {
    component: loadable(() => import('pages/DefaultPages/LockscreenPage')),
  },
  '/pages/pricing-table': {
    component: loadable(() => import('pages/DefaultPages/PricingTablePage')),
  },
  '/pages/invoice': {
    component: loadable(() => import('pages/DefaultPages/InvoicePage')),
  },

  // Dashboards
  '/dashboard/alpha': {
    component: loadable(() => import('pages/Dashboard/DashboardAlphaPage')),
  },
  '/dashboard/beta': {
    component: loadable(() => import('pages/Dashboard/DashboardBetaPage')),
  },
  '/dashboard/crypto': {
    component: loadable(() => import('pages/Dashboard/DashboardCryptoPage')),
  },

  // Apps
  '/apps/messaging': {
    component: loadable(() => import('pages/Apps/Messaging/MessagingChatPage')),
  },
  '/apps/mail': {
    component: loadable(() => import('pages/Apps/Mail/MailListPage')),
  },
  '/apps/profile': {
    component: loadable(() => import('pages/Apps/Profile/ProfilePage')),
  },
  '/apps/gallery': {
    component: loadable(() => import('pages/Apps/Gallery/GalleryListPage')),
  },

  // Ecommerce
  '/ecommerce/dashboard': {
    component: loadable(() => import('pages/Apps/Ecommerce/DashboardPage')),
  },
  '/ecommerce/products-catalog': {
    component: loadable(() => import('pages/Apps/Ecommerce/ProductsCatalogPage')),
  },
  '/ecommerce/product-details': {
    component: loadable(() => import('pages/Apps/Ecommerce/ProductDetailsPage')),
  },
  '/ecommerce/product-edit': {
    component: loadable(() => import('pages/Apps/Ecommerce/ProductEditPage')),
  },
  '/ecommerce/products-list': {
    component: loadable(() => import('pages/Apps/Ecommerce/ProductsListPage')),
  },
  '/ecommerce/orders': {
    component: loadable(() => import('pages/Apps/Ecommerce/OrdersPage')),
  },
  '/ecommerce/cart': {
    component: loadable(() => import('pages/Apps/Ecommerce/CartPage')),
  },

  // Icons
  '/icons/fontawesome': {
    component: loadable(() => import('pages/Icons/FontAwesomeIconsPage')),
  },
  '/icons/linear': {
    component: loadable(() => import('pages/Icons/LinearIconsPage')),
  },
  '/icons/icomoon': {
    component: loadable(() => import('pages/Icons/IcomoonIconsPage')),
  },

  // Layout
  '/layout/bootstrap': {
    component: loadable(() => import('pages/Layout/GridBootstrapPage')),
  },
  '/layout/card': {
    component: loadable(() => import('pages/Layout/GridCardPage')),
  },
  '/layout/utilities': {
    component: loadable(() => import('pages/Layout/UtilitiesPage')),
  },
  '/layout/typography': {
    component: loadable(() => import('pages/Layout/TypographyPage')),
  },
  '/layout/mail-templates': {
    component: loadable(() => import('pages/Layout/MailTemplatesPage')),
  },

  // Charts
  '/charts/chartist': {
    component: loadable(() => import('pages/Charts/ChartistPage')),
  },
  '/charts/chart': {
    component: loadable(() => import('pages/Charts/ChartPage')),
  },
  '/charts/peity': {
    component: loadable(() => import('pages/Charts/PeityPage')),
  },
  '/charts/c3': {
    component: loadable(() => import('pages/Charts/C3Page')),
  },

  // Blog
  '/blog/feed': {
    component: loadable(() => import('pages/Apps/Blog/BlogFeedPage')),
  },
  '/blog/post': {
    component: loadable(() => import('pages/Apps/Blog/BlogPostPage')),
  },
  '/blog/add-blog-post': {
    component: loadable(() => import('pages/Apps/Blog/BlogAddPostPage')),
  },

  //YouTube
  '/youtube/feed': {
    component: loadable(() => import('pages/Apps/YouTube/YouTubeFeedPage')),
  },
  '/youtube/view': {
    component: loadable(() => import('pages/Apps/YouTube/YouTubeViewPage')),
  },

  //GitHub
  '/github/explore': {
    component: loadable(() => import('pages/Apps/GitHub/GitHubExplorePage')),
  },
  '/github/discuss': {
    component: loadable(() => import('pages/Apps/GitHub/GitHubDiscussPage')),
  },
}

class Routes extends React.Component {
  timeoutId = null

  componentDidMount() {
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
    return (
      <ConnectedSwitch>
        <Route exact path="/" component={HomePage} />
        {Object.keys(loadableRoutes).map(path => {
          const { exact, ...props } = loadableRoutes[path]
          props.exact = exact === void 0 || exact || false // set true as default
          return <Route key={path} path={path} {...props} />
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

export { loadableRoutes }
export default Routes
