import { h } from 'preact'
import { Logo } from './logo'

export function App() {
  return (
    <>
      <Logo />
      <p
        style="
color: var(--f_high);
"
      >
        Hello Vite + Preact!
      </p>
      <p>
        <a
          class="link"
          href="https://preactjs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Preact
        </a>
      </p>
    </>
  )
}
