import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { ApplicationState } from '~/state/configureStore'

import { isPlayingSelector } from './selectors'
import {
  GlobalPlaybackStartAction,
  GlobalPlaybackStopAction,
  GlobalPlaybackSetFrequenctDataAction,
} from './types'

export const startGlobalPlaybackAction: ActionCreator<
  GlobalPlaybackStartAction
> = () => ({ type: 'GLOBAL_PLAYBACK_START' })

export const stopGlobalPlaybackAction: ActionCreator<
  GlobalPlaybackStopAction
> = () => ({ type: 'GLOBAL_PLAYBACK_STOP' })

export const toggleGlobalPlaybackAction = (): ThunkAction<
  void,
  ApplicationState,
  undefined,
  GlobalPlaybackStartAction | GlobalPlaybackStopAction
> => (dispatch, getState) => {
  const isPlaying = isPlayingSelector(getState())

  if (isPlaying) {
    dispatch<GlobalPlaybackStopAction>(stopGlobalPlaybackAction())
  } else {
    dispatch<GlobalPlaybackStartAction>(startGlobalPlaybackAction())
  }
}

export const setGlobalPlaybackFrequencyData: ActionCreator<
  GlobalPlaybackSetFrequenctDataAction
> = (payload: Uint8Array) => ({
  type: 'GLOBAL_PLAYBACK_SET_FREQUENCY_DATA',
  payload,
})
