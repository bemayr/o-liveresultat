// @ts-ignore
import HRTheme from './100rabbits/theme.js'
import './100rabbits/theme.css'
import { Signal, effect, signal } from '@preact/signals'

export interface Theme {
  background: string
  f_high: string
  f_med: string
  f_low: string
  f_inv: string
  b_high: string
  b_med: string
  b_low: string
  b_inv: string
}

export const theme: Signal<Theme | undefined> = signal(undefined)
export const initializeTheme = () => {
  const hrTheme = new HRTheme()
  hrTheme.install(document.body)
  hrTheme.onLoad = () => {
    theme.value = JSON.parse(localStorage.theme)
  }
  hrTheme.start()
}
