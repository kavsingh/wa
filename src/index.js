import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { injectGlobal } from 'emotion'

import { COLOR_PAGE } from '~/constants/style'
import { configureStore } from '~/state/configureStore'
import AudioEngine from '~/containers/AudioEngine'
import UI from '~/containers/UI'
import ErrorBoundary from '~/components/ErrorBoundary'
import offlineInstall from '~/util/offlineInstall'

const container = document.createElement('div')
document.body.appendChild(container)

const store = configureStore()

const App = () => (
  <div>
    <ErrorBoundary>
      <AudioEngine />
    </ErrorBoundary>
    <ErrorBoundary>
      <UI />
    </ErrorBoundary>
  </div>
)

const applyGlobalStyles = () => injectGlobal`
  html {
    box-sizing: border-box;
    user-select: none;
    cursor: default;
    font-size: 14px;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    user-select: inherit;
    cursor: inherit;
  }

  *:focus,
  *:active {
    outline: none;
  }

  a,
  button {
    cursor: initial;
  }

  html,
  body {
    width: 100%;
    padding: 0;
    margin: 0;
  }

  body {
    background-color: ${COLOR_PAGE};
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`

//

applyGlobalStyles()

offlineInstall('gleetchy-sw.js', '')

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
)
