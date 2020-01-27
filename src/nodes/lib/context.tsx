import React, { createContext, useContext, FunctionComponent } from 'react'

import useAudioNode, {
  validateNodeType,
  AudioNodeStateValidator,
  UseAudioNodeState,
  UseAudioNodeActions,
} from '~/state/hooks/use-audio-node'

export { validateNodeType, AudioNodeStateValidator }

const AudioNodeStateContext = createContext<
  [UseAudioNodeState<{}>, UseAudioNodeActions<{}>]
>([
  {
    label: '',
    audioProps: {},
    connections: [],
    isActive: false,
  },
  {
    updateLabel: () => ({
      type: 'AUDIO_NODE_UPDATE_LABEL',
      payload: { id: '', label: '' },
    }),
    updateAudioProps: () => ({
      type: 'AUDIO_NODE_UPDATE_AUDIO_PROPS',
      payload: { id: '', audioProps: {} },
    }),
    duplicate: () => ({
      type: 'AUDIO_NODE_DUPLICATE',
      payload: { id: '' },
    }),
    remove: () => ({
      type: 'AUDIO_NODE_REMOVE',
      payload: { id: '' },
    }),
  },
])

export const useAudioNodeStateContext = <P extends object>() => {
  return useContext(AudioNodeStateContext) as [
    UseAudioNodeState<P>,
    UseAudioNodeActions<P>,
  ]
}

export const AudioNodeStateProvider: FunctionComponent<{
  id: string
  validator: AudioNodeStateValidator
}> = ({ id, validator, children }) => {
  const nodeHookReturn = useAudioNode(id, validator)

  return (
    <AudioNodeStateContext.Provider value={nodeHookReturn}>
      {children}
    </AudioNodeStateContext.Provider>
  )
}
