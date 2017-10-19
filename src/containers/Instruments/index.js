import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { __ } from 'ramda'
import { INS_LOOP } from '../../constants/nodeTypes'
import { getConnectionsFor } from '../../util/audio'
import { noop, stubArray } from '../../util/function'
import {
  instrumentsSelector,
  connectionsSelector,
} from '../../state/gleetchy/selectors'
import {
  nodeUpdateLabel,
  nodeUpdateProps,
  loopReceiveAudioFile,
  loopSelectAudioFile,
  loopAdd,
  nodeRemove,
} from '../../state/gleetchy/actions'
import ErrorBoundary from '../../components/ErrorBoundary'
import AnimIn from '../../components/AnimIn'
import Loop from '../../components/Loop'
import LoopEqControls from '../../components/Loop/LoopEqControls'
import LoopPlaybackControls from '../../components/Loop/LoopPlaybackControls'

const Instruments = ({
  instruments,
  loopSelectFile,
  loopReceiveFile,
  updateInstrument,
  updateInstrumentLabel,
  addLoop,
  removeInstrument,
  getConnections,
}) => (
  <div className="instruments">
    <ErrorBoundary>
      {instruments.map(({ id, label, type, props }) => (
        <div className="instruments__instrumentContainer" key={id}>
          <AnimIn>
            {type === INS_LOOP ? (
              <Loop
                {...props}
                label={label}
                selectAudioFile={() => loopSelectFile(id)}
                receiveAudioFile={file => loopReceiveFile(id, file)}
                remove={() => removeInstrument(id)}
                onLabelChange={val => updateInstrumentLabel(id, val)}
                connections={getConnections(id)}
                onLoopRegionChange={(start, end) =>
                  updateInstrument(id, {
                    loopStart: start,
                    loopEnd: end,
                  })}
                renderControls={() => [
                  <LoopPlaybackControls
                    key="playback"
                    gain={props.gain}
                    playbackRate={props.playbackRate}
                    onGainChange={val => updateInstrument(id, { gain: val })}
                    onPlaybackRateChange={val =>
                      updateInstrument(id, { playbackRate: val })}
                  />,
                  <LoopEqControls
                    key="eq"
                    eqLow={props.eqLow}
                    eqMid={props.eqMid}
                    eqHigh={props.eqHigh}
                    onEqChange={eqProps => updateInstrument(id, eqProps)}
                  />,
                ]}
              />
            ) : null}
          </AnimIn>
        </div>
      ))}
    </ErrorBoundary>
    <div
      className="instruments__addButton"
      onClick={addLoop}
      role="button"
      tabIndex={0}
      onKeyDown={({ key }) => {
        if (key === 'Enter') addLoop()
      }}
    >
      [ Add loop ]
    </div>
    <style jsx>{`
      .instruments {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .instruments__instrumentContainer:not(:first-child) {
        margin-top: 2em;
      }

      .instruments__addButton {
        cursor: pointer;
        margin: 2em 0 0;
        padding: 1em 0;
        width: 100%;
        text-align: center;
        font-size: 0.8em;
      }
    `}</style>
  </div>
)

Instruments.propTypes = {
  instruments: PropTypes.arrayOf(PropTypes.shape({})),
  getConnections: PropTypes.func,
  loopSelectFile: PropTypes.func,
  loopReceiveFile: PropTypes.func,
  updateInstrument: PropTypes.func,
  updateInstrumentLabel: PropTypes.func,
  addLoop: PropTypes.func,
  removeInstrument: PropTypes.func,
}

Instruments.defaultProps = {
  instruments: [],
  getConnections: stubArray,
  loopSelectFile: noop,
  loopReceiveFile: noop,
  updateInstrument: noop,
  updateInstrumentLabel: noop,
  addLoop: noop,
  removeInstrument: noop,
}

export default connect(
  state => ({
    instruments: instrumentsSelector(state),
    getConnections: getConnectionsFor(__, connectionsSelector(state)),
  }),
  dispatch => ({
    loopSelectFile: id => dispatch(loopSelectAudioFile(id)),
    loopReceiveFile: (id, file) => dispatch(loopReceiveAudioFile(id, file)),
    updateInstrument: (id, props) => dispatch(nodeUpdateProps(id, props)),
    updateInstrumentLabel: (id, label) => dispatch(nodeUpdateLabel(id, label)),
    addLoop: () => dispatch(loopAdd()),
    removeInstrument: id => dispatch(nodeRemove(id)),
  }),
)(Instruments)
