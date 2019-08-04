import React, { FunctionComponent, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { audioEngineEventsSelector } from '~/state/audioEngine/selectors'
import { clearAudioEngineEventsAction } from '~/state/audioEngine/actions'
import useConnections from '~/state/hooks/useConnections'
import useGlobalPlayback from '~/state/hooks/useGlobalPlayback'
import useAudioNodes from '~/state/hooks/useAudioNodes'

import AudioEngine from './AudioEngine'

const ConnectedAudioEngine: FunctionComponent = () => {
  const { connections } = useConnections()
  const { isPlaying, setMainOutFrequencyData } = useGlobalPlayback()
  const { nodes } = useAudioNodes()

  const dispatch = useDispatch()
  const audioEngineEvents = useSelector(audioEngineEventsSelector)

  const clearAudioEngineEvents = useCallback(
    () => dispatch(clearAudioEngineEventsAction()),
    [dispatch],
  )

  return (
    <AudioEngine
      isPlaying={isPlaying}
      nodes={nodes}
      connections={connections}
      audioEngineEvents={audioEngineEvents}
      clearAudioEngineEvents={clearAudioEngineEvents}
      setMainOutFrequencyData={setMainOutFrequencyData}
    />
  )
}

export default ConnectedAudioEngine
