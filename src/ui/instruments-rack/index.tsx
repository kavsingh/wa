import { useCallback, memo } from 'react'
import styled from '@emotion/styled'
import type { FunctionComponent } from 'react'

import useAudioNodesMeta from '~/state/hooks/use-audio-nodes-meta'
import useAddNode from '~/state/hooks/use-add-node'
import { nodeType as loopType } from '~/nodes/instruments/loop'
import AnimIn from '~/components/anim-in'
import ErrorBoundary from '~/components/error-boundary'
import ButtonSet, { Button } from '~/components/button-set'
import type { FCWithoutChildren } from '~/types'

import ConnectedLoop from './connected-loop'

const InstrumentsRack: FCWithoutChildren = () => (
  <Container>
    <Rack />
    <AddInstrumentButtons />
  </Container>
)

export default memo(InstrumentsRack)

const Rack: FCWithoutChildren = () => {
  const { instruments } = useAudioNodesMeta()

  return (
    <>
      {instruments.map(({ id, type }) => {
        switch (type) {
          case loopType:
            return (
              <RackMount key={id}>
                <ConnectedLoop id={id} />
              </RackMount>
            )
          default:
            return null
        }
      })}
    </>
  )
}

const AddInstrumentButtons: FCWithoutChildren = () => {
  const { addNode } = useAddNode()
  const addLoop = useCallback(() => addNode(loopType), [addNode])

  return (
    <ButtonSet>
      <Button handler={addLoop}>Add Loop</Button>
    </ButtonSet>
  )
}

const RackMount: FunctionComponent = ({ children }) => (
  <InstrumentContainer>
    <ErrorBoundary>{children}</ErrorBoundary>
  </InstrumentContainer>
)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const InstrumentContainer = styled(AnimIn)`
  &:not(:first-of-type) {
    margin-top: 2em;
  }
`
