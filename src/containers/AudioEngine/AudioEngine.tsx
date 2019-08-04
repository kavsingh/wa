import { always, cond, equals, pick, pipe, tryCatch } from 'ramda'
import { Component } from 'react'

import { warn } from '~/util/dev'
import { isInstrument } from '~/util/audio'
import { getAudioContext } from '~/apis/audio'
import { MAIN_OUT_ID } from '~/constants/audio'
import {
  createAudioNode as createDelayNode,
  nodeType as delayType,
} from '~/nodes/audioEffects/delay'
import {
  createAudioNode as createReverbNode,
  nodeType as reverbType,
} from '~/nodes/audioEffects/reverb'
import {
  createAudioNode as createLoopNode,
  nodeType as loopType,
} from '~/nodes/instruments/loop'
import { AudioEngineEvent } from '~/state/audioEngine/types'
import {
  AudioNodeConnection,
  AudioNodeState,
  GAudioNode,
  InstrumentNode,
} from '~/types'

type AudioEngineNode = AudioNode | GAudioNode | InstrumentNode
type InstrumentNodeProcessor = (node: InstrumentNode) => void
type TrySet = (args: { node: AudioEngineNode; audioProps: object }) => void

const setNodeProps = tryCatch<TrySet>(({ node, audioProps }) => {
  const target = node as GAudioNode

  if (typeof target.set === 'function') target.set(audioProps)
}, warn)

type NodeCreator = (...args: unknown[]) => AudioEngineNode
const getNodeCreator: (state: AudioNodeState) => NodeCreator = pipe(
  ({ type }: AudioNodeState) => type,
  cond([
    [equals(delayType), always(createDelayNode)],
    [equals(reverbType), always(createReverbNode)],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [equals(loopType), always(createLoopNode) as any],
  ]),
)

export interface AudioEngineProps {
  audioEngineEvents: AudioEngineEvent[]
  connections: AudioNodeConnection[]
  isPlaying: boolean
  nodes: { [key: string]: AudioNodeState }
  clearAudioEngineEvents(): unknown
  setMainOutFrequencyData(data: Uint8Array): unknown
}

class AudioEngine extends Component<AudioEngineProps> {
  private audioContext?: AudioContext
  private processor?: ScriptProcessorNode
  private analyzer?: AnalyserNode
  private mainOutFrequencyData?: Uint8Array
  private mainOutNode?: GainNode
  private audioNodes: {
    [key: string]: GAudioNode | InstrumentNode | AudioNode
  } = {}

  public componentDidMount() {
    this.audioContext = getAudioContext()

    if (!this.audioContext) throw new Error('Could not create audio context')

    this.mainOutNode = this.audioContext.createGain()
    this.audioNodes = { [MAIN_OUT_ID]: this.mainOutNode }

    this.updateAudioNodes()
    this.updateAudioGraph()
    this.createAnalyzer()
  }

  public shouldComponentUpdate(props: AudioEngineProps) {
    return (
      !!props.audioEngineEvents.length &&
      this.props.audioEngineEvents !== props.audioEngineEvents
    )
  }

  public componentDidUpdate() {
    this.props.audioEngineEvents.forEach(this.processAudioEngineEvent)
    this.props.clearAudioEngineEvents()
  }

  public componentWillUnmount() {
    this.props.clearAudioEngineEvents()
    if (this.audioContext) this.audioContext.close()
  }

  public render() {
    return null
  }

  private handleAudioProcessEvent = () => {
    if (!this.mainOutFrequencyData || !this.analyzer) return

    this.analyzer.getByteFrequencyData(this.mainOutFrequencyData)
    this.props.setMainOutFrequencyData(this.mainOutFrequencyData)
  }

  private createAnalyzer() {
    if (!this.audioContext || !this.mainOutNode) return

    this.processor = this.audioContext.createScriptProcessor(2048, 1, 1)
    this.analyzer = this.audioContext.createAnalyser()
    this.analyzer.fftSize = 1024
    this.analyzer.smoothingTimeConstant = 0.3
    this.mainOutFrequencyData = new Uint8Array(this.analyzer.frequencyBinCount)

    this.analyzer.connect(this.processor)
    this.processor.connect(this.audioContext.destination)
    this.mainOutNode.connect(this.analyzer)

    this.processor.addEventListener(
      'audioprocess',
      this.handleAudioProcessEvent,
    )
  }

  private getInstrumentNodes(): InstrumentNode[] {
    return Object.values(this.audioNodes).filter(
      isInstrument,
    ) as InstrumentNode[]
  }

  private forEachInstrument(fn: InstrumentNodeProcessor) {
    if (!this.audioNodes) return

    this.getInstrumentNodes().forEach(fn)
  }

  private disconnectAllNodes() {
    if (!this.audioNodes) return

    Object.values(this.audioNodes).forEach(node => node.disconnect())
  }

  private updateAudioNodes() {
    if (!this.audioContext || !this.mainOutNode) return

    const { nodes: nextNodes = {}, isPlaying = false } = this.props
    const nextNodeIds = Object.keys(nextNodes)

    this.audioNodes = Object.entries(this.audioNodes).length
      ? pick(nextNodeIds, this.audioNodes)
      : { [MAIN_OUT_ID]: this.mainOutNode }

    nextNodeIds
      .filter(id => !this.audioNodes[id])
      .forEach(id => {
        const node = nextNodes[id]
        const nodeCreator = getNodeCreator(node) as NodeCreator

        if (!nodeCreator) return

        const newNode: AudioEngineNode = nodeCreator(
          this.audioContext,
          node.audioProps,
        )

        this.audioNodes[node.id] = newNode

        if (isPlaying && isInstrument(newNode)) {
          ;(newNode as InstrumentNode).play()
        }
      })
  }

  private updateAudioGraph() {
    if (!this.audioContext || !this.mainOutNode) return

    this.disconnectAllNodes()

    const { connections } = this.props

    if (!connections.length) return

    connections.forEach(({ from, to }) => {
      const fromNode = this.audioNodes[from]
      const toNode = this.audioNodes[to]

      if (fromNode && toNode) fromNode.connect(toNode)
    })

    this.mainOutNode.connect(this.audioContext.destination)
  }

  private updateNode({ id, audioProps }: { id: string; audioProps: object }) {
    const node = this.audioNodes[id]

    if (!node) return

    setNodeProps({ node, audioProps })
  }

  private rebuildAll() {
    this.disconnectAllNodes()

    this.audioNodes = {}

    this.updateAudioNodes()
    this.updateAudioGraph()
  }

  private processAudioEngineEvent = (event: AudioEngineEvent) => {
    switch (event.type) {
      case 'GLOBAL_PLAYBACK_START':
        this.forEachInstrument(node => node.play())
        break
      case 'GLOBAL_PLAYBACK_STOP':
        this.forEachInstrument(node => node.stop())
        break
      case 'AUDIO_NODE_UPDATE_AUDIO_PROPS':
        this.updateNode(event.payload)
        break
      case 'AUDIO_FILE_DECODE_COMPLETE':
        this.updateNode({
          id: event.payload.id,
          audioProps: event.payload.file,
        })
        break
      case 'CONNECTION_ADD':
      case 'CONNECTION_REMOVE':
        this.updateAudioGraph()
        break
      case 'AUDIO_NODE_ADD':
        this.updateAudioNodes()
        this.updateAudioGraph()
        break
      case 'AUDIO_NODE_REMOVE':
        this.rebuildAll()
        break
      default:
        break
    }
  }
}

export default AudioEngine
