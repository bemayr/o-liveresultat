import { h, render } from 'preact'
import { App } from './app'
import './index.css'
// @ts-ignore
import Theme from './100rabbits/theme.js'
import './100rabbits/theme.css'

const el = document.getElementById('app')
if (el) {
  render(<App />, el)
}

const theme = new Theme()
theme.install(document.body)
theme.start()
