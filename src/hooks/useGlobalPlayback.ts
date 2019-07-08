import { useSelector, useDispatch } from 'react-redux'
import { isPlayingSelector } from '~/state/globalPlayback/selectors'
import { toggleGlobalPlaybackAction } from '~/state/globalPlayback/actions'

const useGlobalPlayback = () => {
  const dispatch = useDispatch()
  const isPlaying = useSelector(isPlayingSelector)
  const togglePlayBack = () => dispatch(toggleGlobalPlaybackAction())

  return { isPlaying, togglePlayBack }
}

export default useGlobalPlayback
