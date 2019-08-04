import { Reducer } from 'redux'

import { GlobalPlaybackAction } from './types'

export interface GlobalPlaybackState {
  isPlaying: boolean
  mainOutFrequencyData?: Uint8Array
}

const defaultState: GlobalPlaybackState = { isPlaying: false }

const globalPlaybackReducer: Reducer<
  GlobalPlaybackState,
  GlobalPlaybackAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case 'GLOBAL_PLAYBACK_START':
      return state.isPlaying ? state : { isPlaying: true }
    case 'GLOBAL_PLAYBACK_STOP':
      return state.isPlaying ? { isPlaying: false } : state
    case 'GLOBAL_PLAYBACK_SET_FREQUENCY_DATA':
      // Note that frequency data will reference the same array
      return { ...state, mainOutFrequencyData: action.payload }
    default:
      return state
  }
}

export default globalPlaybackReducer
