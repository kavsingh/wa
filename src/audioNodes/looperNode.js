import { curry, pick } from 'ramda'
import { INS_LOOP } from '../constants/nodeTypes'
import nodeProps from '../constants/nodeProps'
import { createEq3Node, pickProps as pickEq3Props } from './eq3Node'
import { createConnect, createDisconnect } from './connection'

const defaultProps = { ...nodeProps[INS_LOOP] }

export const pickProps = pick(Object.keys(defaultProps))

export const createLoopNode = curry((audioContext, initProps) => {
  const props = { ...defaultProps, ...pickProps(initProps || {}) }
  const eq3Node = createEq3Node(audioContext, pickEq3Props(initProps))
  const gainNode = audioContext.createGain()
  const getInNode = () => gainNode
  const getOutNode = () => gainNode

  let isPlaying = false
  let bufferSourceNode = null

  eq3Node.connect(gainNode)
  gainNode.gain.value = props.gain

  const transferPropsToBufferSourceNode = () => {
    const { audioBuffer: { duration } } = props

    bufferSourceNode.loopStart = props.loopStart * duration
    bufferSourceNode.loopEnd = props.loopEnd * duration
    bufferSourceNode.playbackRate.value = props.playbackRate
  }

  const removeBufferSourceNode = () => {
    if (!bufferSourceNode) return

    bufferSourceNode.disconnect(eq3Node.getInNode())
    bufferSourceNode = null
  }

  const replaceBufferSourceNode = () => {
    removeBufferSourceNode()

    const { loopStart, audioBuffer } = props

    if (!audioBuffer) return

    bufferSourceNode = audioContext.createBufferSource()
    bufferSourceNode.buffer = audioBuffer
    bufferSourceNode.loop = true

    transferPropsToBufferSourceNode()

    bufferSourceNode.connect(eq3Node.getInNode())
    if (isPlaying) bufferSourceNode.start(0, loopStart * audioBuffer.duration)
  }

  return {
    type: INS_LOOP,

    play() {
      if (isPlaying) return

      isPlaying = true
      replaceBufferSourceNode()
    },

    stop() {
      if (!isPlaying) return

      isPlaying = false
      removeBufferSourceNode()
    },

    set(newProps = {}) {
      const prevProps = { ...props }

      Object.assign(props, pickProps(newProps))

      const { gain, audioBuffer, loopStart } = props

      eq3Node.set(pickEq3Props(props))
      gainNode.gain.value = gain

      if (
        prevProps.audioBuffer !== audioBuffer ||
        prevProps.loopStart !== loopStart
      ) {
        replaceBufferSourceNode()
      } else if (audioBuffer && bufferSourceNode) {
        transferPropsToBufferSourceNode()
      } else if (!audioBuffer) {
        removeBufferSourceNode()
      }
    },

    getInNode,
    getOutNode,
    connect: createConnect(getOutNode),
    disconnect: createDisconnect(getOutNode),
  }
})
