import { identity, prop } from 'ramda'
import { createSelector } from 'reselect'

import { ApplicationState } from '~/state/configureStore'

const globalPlaybackStateSelector = (state: ApplicationState) =>
  state.globalPlayback

export const globalPlaybackSelector = createSelector(
  globalPlaybackStateSelector,
  identity,
)

export const isPlayingSelector = createSelector(
  globalPlaybackSelector,
  prop('isPlaying'),
)

export const mainOutfrequencyDataSelector = createSelector(
  globalPlaybackSelector,
  prop('mainOutFrequencyData'),
)
