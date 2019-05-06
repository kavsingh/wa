import { css, cx } from 'emotion'
import React, { memo, FunctionComponent } from 'react'

import { colorEmphasis } from '~/style/color'

const rootStyle = css({
  height: '100%',
  pointerEvents: 'none',
  position: 'relative',
  width: '100%',
})

const alignRightStyle = css({
  transform: 'translateX(-100%)',
})

const tagStyle = css({
  backgroundColor: colorEmphasis,
  height: 1,
  pointerEvents: 'all',
  position: 'absolute',
  top: 0,
  width: '60%',
})

const tagAlignLeftStyle = css({
  left: 0,
})

const tagAlignRightStyle = css({
  right: 0,
})

const barStyle = css({
  height: '100%',
  pointerEvents: 'all',
  position: 'absolute',
  top: 0,
  width: '100%',
})

const barAlignLeftStyle = css({
  borderRight: `1px solid ${colorEmphasis}`,
  left: '-100%',
})

const barAlignRightStyle = css({
  borderLeft: `1px solid ${colorEmphasis}`,
  right: '-100%',
})

export interface LoopHandleProps {
  align: 'left' | 'right'
}

const LoopHandle: FunctionComponent<LoopHandleProps> = ({ align = 'left' }) => (
  <div
    className={cx({
      [rootStyle]: true,
      [alignRightStyle]: align === 'right',
    })}
  >
    <div
      className={cx({
        [tagStyle]: true,
        [tagAlignLeftStyle]: align === 'left',
        [tagAlignRightStyle]: align === 'right',
      })}
    />
    <div
      className={cx({
        [barStyle]: true,
        [barAlignLeftStyle]: align === 'left',
        [barAlignRightStyle]: align === 'right',
      })}
    />
  </div>
)

export default memo(LoopHandle)
