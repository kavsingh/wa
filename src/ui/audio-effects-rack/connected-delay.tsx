import React from 'react'

import { nodeType, UI } from '~/nodes/audio-effects/delay'
import { AudioNodeStateProvider, validateNodeType } from '~/nodes/lib/context'
import type { FunctionComponentWithoutChildren } from '~/types'

const validator = validateNodeType(nodeType)

const ConnectedDelay: FunctionComponentWithoutChildren<{ id: string }> = ({
  id,
}) => (
  <AudioNodeStateProvider id={id} validator={validator}>
    <UI />
  </AudioNodeStateProvider>
)

export default ConnectedDelay
