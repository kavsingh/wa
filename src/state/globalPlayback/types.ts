import { Action } from 'redux'

import { ActionWithPayload } from '~/types'

export type GlobalPlaybackStartAction = Action<'GLOBAL_PLAYBACK_START'>

export type GlobalPlaybackStopAction = Action<'GLOBAL_PLAYBACK_STOP'>

export type GlobalPlaybackSetFrequenctDataAction = ActionWithPayload<
  'GLOBAL_PLAYBACK_SET_FREQUENCY_DATA',
  Uint8Array
>

export type GlobalPlaybackAction =
  | GlobalPlaybackStartAction
  | GlobalPlaybackStopAction
  | GlobalPlaybackSetFrequenctDataAction
