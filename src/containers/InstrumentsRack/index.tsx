import React, { FunctionComponent, useCallback } from 'react'
import styled from '@emotion/styled'

import { AudioNodeMeta } from '~/types'
import useAudioNodes from '~/state/hooks/useAudioNodes'
import useAudioNodesMeta from '~/state/hooks/useAudioNodesMeta'
import { nodeType as loopType } from '~/nodes/instruments/loop'
import AnimIn from '~/components/AnimIn'
import ErrorBoundary from '~/components/ErrorBoundary'
import AddNodeButtons from '~/components/AddNodeButtons'

import ConnectedLoop from './ConnectedLoop'

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

const RackMount: FunctionComponent = ({ children }) => (
  <InstrumentContainer>
    <ErrorBoundary>{children}</ErrorBoundary>
  </InstrumentContainer>
)

export interface InstrumentsRackProps {
  instruments: AudioNodeMeta[]
  addLoop(): unknown
}

const Rack: FunctionComponent = () => {
  const [{ instruments }] = useAudioNodesMeta()

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

const Add: FunctionComponent = () => {
  const [, { addNode }] = useAudioNodes()

  const addLoop = useCallback(() => addNode(loopType), [addNode])

  return <AddNodeButtons buttons={[['Loop', addLoop]]} />
}

const InstrumentsRack: FunctionComponent = () => {
  return (
    <Container>
      <Rack />
      <Add />
    </Container>
  )
}

export default InstrumentsRack
