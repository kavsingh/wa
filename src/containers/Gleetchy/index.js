import Inferno from 'inferno'
import Component from 'inferno-component'
import { tryCatch } from 'ramda'
import { warn, loadAudioToBuffer } from '../../util'
import { loadAudioFilesToArrayBuffers } from '../../apis/file'
import PlayPauseButton from '../../components/PlayPauseButton'
import AudioLooper from '../../components/AudioLooper'
import classNames from './Gleetchy.css'

const Panel = ({ children, style }) => (
  <div className={classNames.panel} style={{ ...style }}>
    {children}
  </div>
)

class Gleetchy extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      isPlaying: false,
      loops: [
        {
          id: 'loop0',
          label: 'Loop 0',
          src: 'media/okthenalright4rhyth.mp3',
          gain: 0.6,
          loopStart: 0,
          loopEnd: 0.25,
          playbackRate: 1,
        },
        {
          id: 'loop1',
          label: 'Loop 1',
          src: 'media/okthenalright4bass.mp3',
          gain: 0.5,
          loopStart: 0,
          loopEnd: 1,
          playbackRate: 1,
        },
      ],
    }

    const context = new AudioContext()
    const out = context.destination

    this.handlePlayPause = this.handlePlayPause.bind(this)
    this.loadAudioToBuffer = loadAudioToBuffer(context)
    this.connectOut = tryCatch(node => node.connect(out), warn)
    this.disconnectOut = tryCatch(node => node.disconnect(out), warn)
    this.createBufferSourceNode = tryCatch(
      () => context.createBufferSource(),
      warn,
    )
    this.createGainNode = tryCatch(() => context.createGain(), warn)
  }

  handlePlayPause() {
    this.setState(state => ({ isPlaying: !state.isPlaying }))
  }

  render() {
    const { loops, isPlaying } = this.state

    return (
      <div className={classNames.root}>
        <Panel>
          <PlayPauseButton
            isPlaying={this.state.isPlaying}
            onClick={this.handlePlayPause}
          />
          <div onClick={() => loadAudioFilesToArrayBuffers()
            .then(console.log.bind(console))}>Clicky</div>
        </Panel>
        {loops.map(
          (
            { loopStart, loopEnd, gain, src, id, label, playbackRate },
            index,
          ) => (
            <Panel
              style={{
                height: '10em',
                ...(index === 0
                  ? { borderTop: '1px solid #fee' }
                  : { marginTop: '1em' }),
              }}
              key={id}
            >
              <div className={classNames.label}>{label}</div>
              <AudioLooper
                gain={gain}
                playbackRate={playbackRate}
                loopStart={loopStart}
                loopEnd={loopEnd}
                createBufferSourceNode={this.createBufferSourceNode}
                createGainNode={this.createGainNode}
                loadAudio={() => this.loadAudioToBuffer(src)}
                connect={node => this.connectOut(node, id)}
                disconnect={node => this.disconnectOut(node, id)}
                isPlaying={isPlaying}
              />
            </Panel>
          ),
        )}
      </div>
    )
  }
}

export default Gleetchy