import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { INS_LOOPER } from '../../constants/nodeTypes'
import { instrumentsSelector } from '../../state/gleetchy/selectors'
import {
  nodeUpdateProps,
  looperReceiveAudioFile,
  looperSelectAudioFile,
} from '../../state/gleetchy/actions'
import ErrorBoundary from '../../components/ErrorBoundary'
import Panel from '../../components/Panel'
import Looper from '../../components/Looper'
import LooperEqControls from '../../components/Looper/LooperEqControls'
import LooperPlaybackControls from '../../components/Looper/LooperPlaybackControls'

const Instruments = ({
  instruments,
  looperSelectFile,
  looperReceiveFile,
  updateInstrument,
}) => (
  <div className="instruments">
    {instruments.map(({ id, label, type, props }, index) => (
      <Panel
        style={{
          height: '14em',
          ...(index === 0
            ? { borderTop: '1px solid #fee' }
            : { marginTop: '1em' }),
        }}
        key={id}
      >
        <ErrorBoundary>
          {type === INS_LOOPER ? (
            <Looper
              {...props}
              label={label}
              selectAudioFile={() => looperSelectFile(id)}
              receiveAudioFile={file => looperReceiveFile(id, file)}
              onLoopRegionChange={(start, end) =>
                updateInstrument(id, {
                  loopStart: start,
                  loopEnd: end,
                })}
              renderControls={() => [
                <LooperPlaybackControls
                  key="playback"
                  gain={props.gain}
                  playbackRate={props.playbackRate}
                  onGainChange={val => updateInstrument(id, { gain: val })}
                  onPlaybackRateChange={val =>
                    updateInstrument(id, { playbackRate: val })}
                />,
                <LooperEqControls
                  key="eq"
                  eqLow={props.eqLow}
                  eqMid={props.eqMid}
                  eqHigh={props.eqHigh}
                  onEqChange={eqProps => updateInstrument(id, eqProps)}
                />,
              ]}
            />
          ) : null}
        </ErrorBoundary>
      </Panel>
    ))}
    <style jsx>{`
      .instruments {
        width: 100%;
      }
    `}</style>
  </div>
)

Instruments.propTypes = {
  instruments: PropTypes.arrayOf(PropTypes.shape({})),
  looperSelectFile: PropTypes.func,
  looperReceiveFile: PropTypes.func,
  updateInstrument: PropTypes.func,
}

Instruments.defaultProps = {
  instruments: [],
  looperSelectFile: () => {},
  looperReceiveFile: () => {},
  updateInstrument: () => {},
}

export default connect(
  state => ({
    instruments: instrumentsSelector(state),
  }),
  dispatch => ({
    looperSelectFile: id => dispatch(looperSelectAudioFile(id)),
    looperReceiveFile: (id, file) => dispatch(looperReceiveAudioFile(id, file)),
    updateInstrument: (id, props) => dispatch(nodeUpdateProps(id, props)),
  }),
)(Instruments)