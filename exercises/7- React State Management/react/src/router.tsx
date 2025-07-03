import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { App } from './App'
import { Index } from './pages/index'
import { Settings } from './pages/settings'
import { NotFoundPage } from './pages/not-found'
// import { AboutPage } from './pages/About'

// Definir la ruta raíz (layout principal)
const rootRoute = createRootRoute({
  component: App,
})

// Definir rutas hijo
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  // Redirect to the default board with ID 1
  beforeLoad: async ({ navigate }) => {
    navigate({ to: '/boards/$boardId', params: { boardId: '1' } })
    return
  }
})

const boardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/boards/$boardId',
  component: Index,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
})

// Not found (catch-all) route
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
})

// Crear el árbol de rutas
const routeTree = rootRoute.addChildren([
  indexRoute,
  boardsRoute,
  settingsRoute,
  notFoundRoute,
])

// Crear el enrutador
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Declara el tipado para que TypeScript lo detecte
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// export const router = createRouter({ routeTree });