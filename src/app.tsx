import { h } from 'preact'
import { useLayoutEffect } from 'preact/hooks'
import { initializeTheme } from './theme'
import { Competitions, loader as competitionsLoader } from './competitions'
import { Competition, loader as competitionLoader } from './competition'
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from 'react-router-dom'
import Root from './root'
import ErrorPage from './error-page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Class, loader as classresultsLoader } from './class'

function useAsyncEffect(effect: (signal: AbortSignal) => Promise<any>) {
  const controller = new AbortController()
  effect(controller.signal)
  return controller.abort
}

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Competitions />,
        loader: competitionsLoader(queryClient),
      },
      {
        path: 'events/:eventId',
        element: <Competition />,
        loader: competitionLoader(queryClient),
      },
      {
        path: 'events/:eventId/classes/:className',
        element: <Class />,
        loader: classresultsLoader(queryClient),
      },
    ],
  },
])

// https://reactrouter.com/en/main/start/overview#skeleton-ui-with-suspense

export function App() {
  useLayoutEffect(initializeTheme)

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
