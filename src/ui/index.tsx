import React, { memo, useEffect } from 'react'
import Favicon from 'react-favicon'
import styled from '@emotion/styled'
import { ThemeProvider } from 'emotion-theming'

import useUITheme from '~/state/hooks/use-ui-theme'
import useModifierKeys from '~/state/hooks/use-modifier-keys'
import favicon from '~/assets/icons/48x48.png'
import type { ThemeProps } from '~/style/theme'
import type { FunctionComponentWithoutChildren } from '~/types'
import { requireWindowWith } from '~/lib/env'

import GlobalStyles from './global-styles'
import AudioEffectsRack from './audio-effects-rack'
import InstrumentsRack from './instruments-rack'
import PatchBay from './patch-bay'
import Masthead from './masthead'

const UI: FunctionComponentWithoutChildren = () => {
  const [{ theme }] = useUITheme()
  const [, { registerKeyPress, registerKeyRelease }] = useModifierKeys()

  useEffect(() => {
    const WINDOW = requireWindowWith([
      'addEventListener',
      'removeEventListener',
    ])

    if (!WINDOW) return undefined

    WINDOW.addEventListener('keydown', registerKeyPress, true)
    WINDOW.addEventListener('keyup', registerKeyRelease, true)

    return () => {
      WINDOW.removeEventListener('keydown', registerKeyPress, true)
      WINDOW.removeEventListener('keyup', registerKeyRelease, true)
    }
  }, [registerKeyPress, registerKeyRelease])

  return (
    <>
      <Favicon url={favicon} />
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Container>
          <Masthead />
          <Divider />
          <InstrumentsRack />
          <Divider />
          <ModifiersContainer>
            <AudioEffectsRackContainer>
              <AudioEffectsRack />
            </AudioEffectsRackContainer>
            <PatchBayContainer>
              <PatchBay />
            </PatchBayContainer>
          </ModifiersContainer>
        </Container>
      </ThemeProvider>
    </>
  )
}

export default memo(UI)

const Container = styled.div<ThemeProps>`
  max-width: 92em;
  margin: 0 auto;
  padding: 2em;
  color: ${({ theme }) => theme.colors.body};
  font-family: ${({ theme }) => theme.fonts.body};
  background-color: ${({ theme }) => theme.colors.page};
`

const Divider = styled.div<ThemeProps>`
  height: 1px;
  margin: 1em 0;
  background-color: ${({ theme }) => theme.colors.keyline};
`

const ModifiersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const AudioEffectsRackContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
`

const PatchBayContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
`
