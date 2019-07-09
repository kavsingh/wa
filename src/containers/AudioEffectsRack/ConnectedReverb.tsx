import React, { FunctionComponent } from 'react'

import {
  nodeType,
  defaultProps,
  NodeProps,
  UI,
} from '~/nodes/audioEffects/reverb'
import useAudioNode from '~/hooks/useAudioNode'

const ConnectedReverb: FunctionComponent<{ id: string }> = ({ id }) => {
  const {
    connections,
    isActive,
    label,
    audioProps,
    updateLabel,
    updateAudioProps,
    remove,
  } = useAudioNode<NodeProps>(id, node => node.type === nodeType, defaultProps)

  return (
    <UI
      connections={connections}
      isActive={isActive}
      label={label}
      wetDryRatio={audioProps.wetDryRatio}
      onLabelChange={updateLabel}
      onWetDryRatioChange={wetDryRatio => updateAudioProps({ wetDryRatio })}
      remove={remove}
    />
  )
}

export default ConnectedReverb
