import React, { FunctionComponent, memo } from 'react'
import { css, Global } from '@emotion/core'
import { Provider } from 'react-redux'

import { ApplicationStore } from '~/state/configureStore'
import theme from '~/style/theme'
import ErrorBoundary from '~/components/ErrorBoundary'
import AudioEngine from '~/containers/AudioEngine'
import UI from '~/containers/UI'

const globalStyles = css({
  html: {
    boxSizing: 'border-box',
    userSelect: 'none',
    cursor: 'default',
    fontSize: '14px',
  },

  '*, *::before, *::after': {
    boxSizing: 'inherit',
    userSelect: 'inherit',
    cursor: 'inherit',
  },

  '*:focus, *:active': {
    outline: 'none',
  },

  'a, button': {
    cursor: 'initial',
  },

  'html, body': {
    width: '100%',
    padding: '0',
    margin: '0',
    backgroundColor: theme.colorPage,
  },
})

//

const Main: FunctionComponent<{ store: ApplicationStore }> = ({ store }) => (
  <Provider store={store}>
    <>
      <Global styles={globalStyles} />
      <ErrorBoundary>
        <AudioEngine />
      </ErrorBoundary>
      <ErrorBoundary>
        <UI />
      </ErrorBoundary>
    </>
  </Provider>
)

export default memo(Main)
