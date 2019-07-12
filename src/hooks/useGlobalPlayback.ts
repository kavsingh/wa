import { useSelector, useDispatch } from 'react-redux'
import { isPlayingSelector } from '~/state/globalPlayback/selectors'
import { toggleGlobalPlaybackAction } from '~/state/globalPlayback/actions'
import { useCallback } from 'react'

const useGlobalPlayback = () => {
  const dispatch = useDispatch()

  const isPlaying = useSelector(isPlayingSelector)

  const togglePlayback = useCallback(
    () => dispatch(toggleGlobalPlaybackAction()),
    [dispatch],
  )

  return { isPlaying, togglePlayback }
}

export default useGlobalPlayback