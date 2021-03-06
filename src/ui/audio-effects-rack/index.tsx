import { useCallback, memo } from 'react'
import styled from '@emotion/styled'
import type { FunctionComponent } from 'react'

import AnimIn from '~/components/anim-in'
import { nodeType as delayType } from '~/nodes/audio-effects/delay'
import { nodeType as reverbType } from '~/nodes/audio-effects/reverb'
import useAudioNodesMeta from '~/state/hooks/use-audio-nodes-meta'
import useAddNode from '~/state/hooks/use-add-node'
import ButtonSet, { Button } from '~/components/button-set'
import ErrorBoundary from '~/components/error-boundary'
import type { FCWithoutChildren } from '~/types'

import ConnectedDelay from './connected-delay'
import ConnectedReverb from './connected-reverb'

const AudioEffectsRack: FCWithoutChildren = () => (
  <Container>
    <Rack />
    <AddAudioEffectButtons />
  </Container>
)

export default memo(AudioEffectsRack)

const Rack: FCWithoutChildren = () => {
  const { audioEffects } = useAudioNodesMeta()

  return (
    <>
      {audioEffects.map(({ id, type }) => {
        switch (type) {
          case delayType:
            return (
              <RackMount key={id}>
                <ConnectedDelay id={id} />
              </RackMount>
            )
          case reverbType:
            return (
              <RackMount key={id}>
                <ConnectedReverb id={id} />
              </RackMount>
            )
          default:
            return null
        }
      })}
    </>
  )
}

const AddAudioEffectButtons: FCWithoutChildren = () => {
  const { addNode } = useAddNode()
  const addReverb = useCallback(() => addNode(reverbType), [addNode])
  const addDelay = useCallback(() => addNode(delayType), [addNode])

  return (
    <ButtonSet>
      <Button handler={addReverb}>Add Reverb</Button>
      <Button handler={addDelay}>Add Delay</Button>
    </ButtonSet>
  )
}

const RackMount: FunctionComponent = ({ children }) => (
  <AudioEffectContainer>
    <ErrorBoundary>{children}</ErrorBoundary>
  </AudioEffectContainer>
)

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
`

const AudioEffectContainer = styled(AnimIn)`
  flex: 1 0 10em;
  padding: 1em 0;
`
