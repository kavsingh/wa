import React, { FunctionComponent } from 'react'
import { GoMarkGithub } from 'react-icons/go'
import { css } from '@emotion/core'
import { withTheme } from 'emotion-theming'

import useGlobalPlayback from '~/state/hooks/useGlobalPlayback'
import useUITheme from '~/state/hooks/useUITheme'
import { UITheme } from '~/style/theme'
import PlayPauseButton from '~/components/PlayPauseButton'
import { take } from 'ramda'

const mastheadStyle = css({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
})

const spectrographStyle = css({
  flex: 1,
  alignItems: 'center',
})

const metaControlStyle = (theme: UITheme) =>
  css({
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    alignSelf: 'stretch',

    '& a, & button': {
      display: 'block',
      appearance: 'none',
      color: theme.colorBody,
      opacity: 0.4,
      transition: 'opacity 0.2s ease-out',
      cursor: 'pointer',
    },

    '& a:hover, & button:hover': {
      opacity: 1,
    },

    '& button': {
      backgroundColor: 'transparent',
      fontFamily: theme.fontBody,
      fontSize: '0.8em',
      margin: '0 1em 0 0',
      padding: 0,
      border: 'none',
    },
  })

const Masthead: FunctionComponent = () => {
  const {
    isPlaying,
    togglePlayback,
    mainOutFrequencyData,
  } = useGlobalPlayback()
  const { toggleTheme } = useUITheme()

  return (
    <div css={mastheadStyle}>
      <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayback} />
      <div css={spectrographStyle}>
        {take(10, mainOutFrequencyData || []).join(' ')}
      </div>
      <div css={metaControlStyle}>
        <button onClick={toggleTheme}>L/D</button>
        <a
          href="https://www.github.com/kavsingh/gleetchy"
          target="_blank"
          rel="noopener noreferrer"
          title="view on github"
        >
          <GoMarkGithub />
        </a>
      </div>
    </div>
  )
}

export default withTheme(Masthead)
