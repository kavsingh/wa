import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  isPlayingSelector,
  mainOutfrequencyDataSelector,
} from '~/state/globalPlayback/selectors'
import {
  toggleGlobalPlaybackAction,
  setGlobalPlaybackFrequencyData,
} from '~/state/globalPlayback/actions'

const useGlobalPlayback = () => {
  const dispatch = useDispatch()

  const isPlaying = useSelector(isPlayingSelector)
  const mainOutFrequencyData = useSelector(
    mainOutfrequencyDataSelector,
    // since the root state always references the same array,
    // we want it to register as changed... always.
    (left, right) => !(left || right),
  )

  const togglePlayback = useCallback(
    () => dispatch(toggleGlobalPlaybackAction()),
    [dispatch],
  )

  const setMainOutFrequencyData = useCallback(
    (data: Uint8Array) => dispatch(setGlobalPlaybackFrequencyData(data)),
    [dispatch],
  )

  return {
    isPlaying,
    mainOutFrequencyData,
    togglePlayback,
    setMainOutFrequencyData,
  }
}

export default useGlobalPlayback
