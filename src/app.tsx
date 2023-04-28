import { h } from 'preact'
import { useLayoutEffect, useEffect } from 'preact/hooks'
import Router from 'preact-router'
import { currentUrl } from './url'
import { initializeTheme } from './theme'
import { Competitions } from './competitions'
import { CurrentUrlAsQRCode } from './_components/qr-url'
import { loadCompetitions } from './api'
import { Competition } from './competition'

function useAsyncEffect(effect: (signal: AbortSignal) => Promise<any>) {
  const controller = new AbortController()
  effect(controller.signal)
  return controller.abort
}

export function App() {
  useLayoutEffect(initializeTheme)

  return (
    <div>
      <Router onChange={() => (currentUrl.value = window.location.href)}>
        <Competitions path="/" />
        <Competition path="/event/:eventId" />
        <Competition path="/event/:eventId/class/:className" />
      </Router>
      <div>footer</div>
      <CurrentUrlAsQRCode />
    </div>
  )
}
