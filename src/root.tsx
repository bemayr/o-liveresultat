import { h } from 'preact'
import { Outlet, Link, ScrollRestoration } from 'react-router-dom'
import { CurrentUrlAsQRCode } from './_components/qr-url'
export default function Root() {
  return (
    <>
      <div id="sidebar">
        <Link to={`/`}>
          <h1>O-Liveresults</h1>
        </Link>
      </div>
      <div id="detail">
        <Outlet />
      </div>

      <div>footer</div>
      {/* <CurrentUrlAsQRCode /> */}
      <ScrollRestoration />
    </>
  )
}
