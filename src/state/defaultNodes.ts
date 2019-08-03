import { MAIN_OUT_ID } from '~/constants/audio'
import * as delay from '~/nodes/audioEffects/delay'
import * as reverb from '~/nodes/audioEffects/reverb'
import * as loop from '~/nodes/instruments/loop'
import { AudioNodeState } from '~/types'

const defaultNodes: AudioNodeState<
  delay.NodeProps | reverb.NodeProps | loop.NodeProps | {}
>[] = [
  {
    id: MAIN_OUT_ID,
    label: 'Main',
    audioProps: { gain: 1 },
    type: 'MAIN_OUT',
  },
  {
    id: 'looper-default0',
    label: 'L0',
    audioProps: { ...loop.defaultProps },
    type: loop.nodeType,
  },
  {
    id: 'looper-default1',
    label: 'L1',
    audioProps: { ...loop.defaultProps },
    type: loop.nodeType,
  },
  {
    id: 'delay-default0',
    label: 'D0',
    audioProps: { ...delay.defaultProps },
    type: delay.nodeType,
  },
  {
    id: '​​​​delay-default1',
    label: 'D1',
    audioProps: { ...delay.defaultProps },
    type: delay.nodeType,
  },
  {
    id: '​​​​​reverb-default0',
    label: 'R0',
    audioProps: { ...reverb.defaultProps },
    type: reverb.nodeType,
  },
  {
    id: 'reverb-default1',
    label: 'R1',
    audioProps: { ...reverb.defaultProps },
    type: reverb.nodeType,
  },
]

export default defaultNodes
