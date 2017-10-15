import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clamp } from 'ramda'
import TitleBar from '../TitleBar'
import FileDropRegion from '../FileDropRegion'
import LoopSample from './LoopSample'

const renderTitle = (title, fileName, selectAudioFile) => (
  <span>
    {title}
    {fileName ? (
      <span
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
        onClick={selectAudioFile}
        onKeyDown={({ key }) => {
          if (key === 'Enter') selectAudioFile()
        }}
      >
        {' '}
        / Load audio file
      </span>
    ) : null}
  </span>
)

class Loop extends Component {
  constructor(...args) {
    super(...args)

    this.handleLoopStartDrag = this.handleLoopStartDrag.bind(this)
    this.handleLoopEndDrag = this.handleLoopEndDrag.bind(this)
    this.handleLoopRegionDrag = this.handleLoopRegionDrag.bind(this)
  }

  handleLoopStartDrag(movement) {
    const { loopStart, loopEnd } = this.props

    this.props.onLoopRegionChange(
      clamp(0, loopEnd - 0.0001, loopStart + movement),
      loopEnd,
    )
  }

  handleLoopEndDrag(movement) {
    const { loopStart, loopEnd } = this.props

    this.props.onLoopRegionChange(
      loopStart,
      clamp(loopStart + 0.0001, 1, loopEnd + movement),
    )
  }

  handleLoopRegionDrag(movement) {
    const { loopStart, loopEnd } = this.props
    const gap = loopEnd - loopStart

    let nextStart
    let nextEnd

    if (movement < 0) {
      nextStart = clamp(0, 1 - gap, loopStart + movement)
      nextEnd = nextStart + gap
    } else {
      nextEnd = clamp(gap, 1, loopEnd + movement)
      nextStart = nextEnd - gap
    }

    this.props.onLoopRegionChange(nextStart, nextEnd)
  }

  render() {
    const {
      fileName,
      audioBuffer,
      label,
      loopEnd,
      loopStart,
      selectAudioFile,
      receiveAudioFile,
    } = this.props

    const title = [
      `${label} (Loop)`,
      fileName ? ` / ${fileName}` : '',
      fileName && audioBuffer ? ` - ${audioBuffer.duration.toFixed(2)}s` : '',
    ].join('')

    return (
      <div className="loop">
        <FileDropRegion
          fileFilter={({ type }) => type.startsWith('audio')}
          onFiles={files => receiveAudioFile(files[0])}
        >
          {({ dropActive, ...fileDropEvents }) => (
            <div className="loop__wrap" {...fileDropEvents}>
              <div className="loop__title">
                <TitleBar>
                  {() => renderTitle(title, fileName, selectAudioFile)}
                </TitleBar>
              </div>
              <div className="loop__main">
                <LoopSample
                  fromSaved={!!(fileName && !audioBuffer)}
                  audioBuffer={audioBuffer}
                  loopStart={loopStart}
                  loopEnd={loopEnd}
                  onLoopStartDrag={this.handleLoopStartDrag}
                  onLoopEndDrag={this.handleLoopEndDrag}
                  onLoopRegionDrag={this.handleLoopRegionDrag}
                  selectAudioFile={selectAudioFile}
                />
                <div className="loop__controlsContainer">
                  {this.props.renderControls()}
                </div>
              </div>
            </div>
          )}
        </FileDropRegion>
        <style jsx>{`
          .loop,
          .loop__wrap {
            width: 100%;
            height: 100%;
          }

          .loop__wrap {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: stretch;
          }

          .loop__title {
            flex-grow: 0;
            flex-shrink: 0;
            width: 100%;
          }

          .loop__main {
            display: flex;
            flex-wrap: nowrap;
            flex-grow: 1;
            flex-shrink: 0;
            flex-basis: 10em;
            width: 100%;
            border-top: 1px solid rgba(0, 0, 0, 0);
          }

          .loop__controlsContainer {
            height: 100%;
            margin-left: 1.2em;
            display: flex;
          }
        `}</style>
      </div>
    )
  }
}

Loop.propTypes = {
  loopStart: PropTypes.number,
  loopEnd: PropTypes.number,
  label: PropTypes.string,
  audioBuffer: PropTypes.instanceOf(AudioBuffer),
  fileName: PropTypes.string,
  selectAudioFile: PropTypes.func,
  receiveAudioFile: PropTypes.func,
  onLoopRegionChange: PropTypes.func,
  renderControls: PropTypes.func,
}

Loop.defaultProps = {
  loopStart: 0,
  loopEnd: 1,
  label: '',
  fileName: '',
  audioBuffer: undefined,
  selectAudioFile: () => {},
  receiveAudioFile: () => {},
  onLoopRegionChange: () => {},
  renderControls: () => <div />,
}

export default Loop