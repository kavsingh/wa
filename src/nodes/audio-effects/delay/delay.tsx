import React, { useCallback } from 'react'
import styled from '@emotion/styled'

import { FunctionComponentWithoutChildren } from '~/types'
import { DELAY_UPPER_BOUND } from '~/constants/audio'
import Knob from '~/components/knob'
import TitleBar from '~/components/title-bar'

import { useAudioNodeStateContext } from '../../lib/context'
import type { Props } from './node-props'

const Delay: FunctionComponentWithoutChildren = () => {
  const [{ isActive }] = useAudioNodeStateContext<Props>()

  return (
    <Container isActive={isActive}>
      <DelayTitleBar />
      <ControlsContainer>
        <KnobContainer key="time">
          <TimeKnob />
        </KnobContainer>
        <KnobContainer key="wetDry">
          <WetDryKnob />
        </KnobContainer>
      </ControlsContainer>
    </Container>
  )
}

export default Delay

const DelayTitleBar: FunctionComponentWithoutChildren = () => {
  const [
    { label, connections },
    { remove, updateLabel },
  ] = useAudioNodeStateContext<Props>()

  return (
    <TitleBar
      type="Delay"
      label={label}
      connections={connections}
      onLabelChange={updateLabel}
      onRemoveClick={remove}
    />
  )
}

const TimeKnob: FunctionComponentWithoutChildren = () => {
  const [{ audioProps }, { updateAudioProps }] = useAudioNodeStateContext<
    Props
  >()

  const handleChange = useCallback(
    (val: number) => {
      updateAudioProps({ delayTime: val * DELAY_UPPER_BOUND })
    },
    [updateAudioProps],
  )

  return (
    <Knob
      radius="2.4em"
      value={audioProps.delayTime / DELAY_UPPER_BOUND}
      onChange={handleChange}
      label="T"
      title="Delay Time"
      valueLabel={audioProps.delayTime.toFixed(2)}
    />
  )
}

const WetDryKnob: FunctionComponentWithoutChildren = () => {
  const [{ audioProps }, { updateAudioProps }] = useAudioNodeStateContext<
    Props
  >()

  const handleChange = useCallback(
    (val: number) => {
      updateAudioProps({ wetDryRatio: val * DELAY_UPPER_BOUND })
    },
    [updateAudioProps],
  )

  return (
    <Knob
      radius="2.4em"
      value={audioProps.wetDryRatio}
      onChange={handleChange}
      label="W / D"
      title="Wet / Dry Ratio"
      valueLabel={`${(audioProps.wetDryRatio * 100).toFixed(1)}%`}
    />
  )
}

const Container = styled.div<{ isActive: boolean }>`
  width: 100%;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
  transition: opacity 0.2s ease-out;
`

const ControlsContainer = styled.div`
  display: flex;
  width: 100%;
`

const KnobContainer = styled.div`
  flex: 0 0 3em;
`
