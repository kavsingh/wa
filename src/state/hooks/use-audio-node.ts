import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { equals } from 'ramda'

import {
  updateAudioNodeAudioPropsAction,
  updateAudioNodeLabelAction,
  duplicateAudioNodeAction,
  removeAudioNodeAction,
} from '~/state/audio-nodes/actions'
import { getConnectionsFor } from '~/lib/audio'
import type { AudioNodeState, AudioNodeConnection } from '~/types'

import {
  audioNodesSelector,
  activeAudioNodeIdsSelector,
} from '../audio-nodes/selectors'
import { connectionsSelector } from '../connections/selectors'
import type { ApplicationState } from '../configure-store'

const useAudioNode = <P extends object>(
  id: string,
  isValid: AudioNodeStateValidator,
) => {
  const node = useSelector<ApplicationState, AudioNodeState<T>>(
    (state) => audioNodesSelector(state)[id] as AudioNodeState<T>,
    equals,
  )
  const isActive = useSelector<ApplicationState, boolean>((state) =>
    activeAudioNodeIdsSelector(state).includes(node.id),
  )
  const allConnections = useSelector(connectionsSelector)
  const dispatch = useDispatch()

  const [connections, setConnections] = useState<AudioNodeConnection[]>([])

  const duplicate = useCallback(() => dispatch(duplicateAudioNodeAction(id)), [
    id,
    dispatch,
  ])

  const remove = useCallback(() => dispatch(removeAudioNodeAction(id)), [
    id,
    dispatch,
  ])

  const updateAudioProps = useCallback(
    (audioProps: Partial<P>) =>
      dispatch(updateAudioNodeAudioPropsAction(id, audioProps)),
    [id, dispatch],
  )

  const updateLabel = useCallback(
    (label: string) => dispatch(updateAudioNodeLabelAction(id, label)),
    [id, dispatch],
  )

  useEffect(() => {
    if (!node) throw new Error(`Audio node not found at id ${id}`)
    if (!isValid(node)) throw new Error(`Audio node is invalid for ${id}`)
  }, [id, isValid, node])

  useEffect(() => {
    setConnections((current) => {
      const next = getConnectionsFor(id, allConnections)

      return equals(current, next) ? current : next
    })
  }, [id, allConnections])

  return [
    { connections, isActive, label: node.label, audioProps: node.audioProps },
    { updateAudioProps, updateLabel, duplicate, remove },
  ]
}

export default useAudioNode

export interface UseAudioNodeState<P extends object> {
  connections: AudioNodeConnection[]
  isActive: boolean
  label: string
  audioProps: P
}

export interface UseAudioNodeActions<P extends object> {
  updateAudioProps(props: Partial<P>): void
  updateLabel(label: string): void
  duplicate(): void
  remove(): void
}

export type AudioNodeStateValidator = (node: AudioNodeState<{}>) => boolean

export const validateNodeType = (
  type: AudioNodeState<{}>['type'],
): AudioNodeStateValidator => (node: AudioNodeState<{}>) => node.type === type
