import { always, curry, pick } from 'ramda'

import { DELAY_UPPER_BOUND } from '~/constants/audio'
import { GAudioNode } from '~/types'
import { connectable } from '~/util/connection'

import nodeProps from './nodeProps'
import nodeType from './nodeType'

const updateWetDry = (
  wetDryRatio: number,
  wetGainNode: GainNode,
  dryGainNode: GainNode,
) => {
  Object.assign(wetGainNode.gain, { value: wetDryRatio })
  Object.assign(dryGainNode.gain, { value: 1 - wetDryRatio })
}

export const pickProps = pick(Object.keys(nodeProps))

export default curry(
  (audioContext: AudioContext, initProps: typeof nodeProps): GAudioNode => {
    const props = { ...nodeProps, ...pickProps(initProps || {}) }
    const delayNode = audioContext.createDelay(DELAY_UPPER_BOUND)
    const inNode = audioContext.createGain()
    const outNode = audioContext.createGain()
    const wetGainNode = audioContext.createGain()
    const dryGainNode = audioContext.createGain()

    inNode.connect(dryGainNode)
    inNode.connect(delayNode)
    delayNode.connect(wetGainNode)
    wetGainNode.connect(outNode)
    dryGainNode.connect(outNode)

    updateWetDry(props.wetDryRatio, wetGainNode, dryGainNode)

    delayNode.delayTime.value = props.delayTime

    return connectable({
      getInNode: always(inNode),
      getOutNode: always(outNode),
    })({
      type: nodeType,

      set(newProps = {}) {
        Object.assign(props, pickProps(newProps))

        delayNode.delayTime.value = props.delayTime
        updateWetDry(props.wetDryRatio, wetGainNode, dryGainNode)
      },
    })
  },
)