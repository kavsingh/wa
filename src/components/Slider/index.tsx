import React, { PureComponent } from 'react'
import { css } from '@emotion/core'
import { withTheme } from 'emotion-theming'
import { clamp } from 'ramda'

import { noop } from '~/util/function'
import { UITheme } from '~/style/theme'
import SinglePointerDrag, {
  SinglePointerDragState,
} from '~/components/SinglePointerDrag'

const textStyle = css({
  flex: '0 0 auto',
  fontSize: '0.8em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const horizontalStyle = css({
  alignItems: 'stretch',
  flexDirection: 'row',
})

const rootStyle = css({
  display: 'flex',
  height: '100%',
  width: '100%',
})

const verticalStyle = css({
  alignItems: 'center',
  flexDirection: 'column',
})

const labelVerticalStyle = css({
  height: '1.4em',
})

const valueVerticalStyle = css({
  alignItems: 'flex-end',
  display: 'flex',
  height: '1.4em',
})

const labelHorizontalStyle = css({
  alignItems: 'center',
  display: 'flex',
  width: '3em',
})

const valueHorizontalStyle = css({
  alignItems: 'center',
  display: 'flex',
  width: '3em',
})

const barContainerStyle = css({
  flex: '1 1',
  position: 'relative',
})

const barContainerVerticalStyle = css({
  cursor: 'ns-resize',
  margin: '0.4em auto 0.2em',
  width: '100%',
})

const barContainerHorizontalStyle = css({
  cursor: 'ew-resize',
  height: '100%',
  margin: 'auto 0.6em',
})

const trackStyle = (theme: UITheme) =>
  css({
    backgroundColor: theme.colors.keyline,
    position: 'absolute',
    zIndex: 1,
  })

const barStyle = (theme: UITheme) =>
  css({
    backgroundColor: theme.colors.emphasis,
    position: 'absolute',
    zIndex: 2,
  })

const trackVerticalStyle = css({
  bottom: 0,
  left: '50%',
  top: 0,
  width: 1,
})

const barVerticalStyle = css({
  bottom: 0,
  left: 'calc(50% - 1px)',
  top: 0,
  width: 3,
})

const trackHorizontalStyle = css({
  height: 1,
  left: 0,
  right: 0,
  top: '50%',
})

const barHorizontalStyle = css({
  height: 3,
  left: 0,
  right: 0,
  top: 'calc(50% - 1px)',
})

export interface SliderProps {
  value: number
  defaultValue?: number
  orient?: 'vertical' | 'horizontal'
  label?: string
  valueLabel?: string
  title?: string
  onChange?(value: number): unknown
  theme: UITheme
}

class Slider extends PureComponent<SliderProps> {
  private barContainer?: HTMLElement | null

  public render() {
    const {
      value,
      orient = 'vertical',
      label = '',
      valueLabel = '',
      title = '',
      theme,
    } = this.props
    const isVert = orient === 'vertical'
    const offVal = `${(1 - value) * 100}%`

    return (
      <div
        css={[rootStyle, isVert && verticalStyle, !isVert && horizontalStyle]}
        title={title}
      >
        <div
          css={[
            textStyle,
            isVert && labelVerticalStyle,
            !isVert && labelHorizontalStyle,
          ]}
        >
          {label}
        </div>
        <SinglePointerDrag
          onDragMove={this.handleDragMove}
          onDragEnd={this.handleDragEnd}
        >
          {({ dragListeners }) => (
            <div
              {...dragListeners}
              css={[
                barContainerStyle,
                isVert && barContainerVerticalStyle,
                !isVert && barContainerHorizontalStyle,
              ]}
              role="presentation"
              onDoubleClick={this.handleDoubleClick}
              ref={el => (this.barContainer = el)}
            >
              <div
                css={[
                  trackStyle(theme),
                  isVert && trackVerticalStyle,
                  !isVert && trackHorizontalStyle,
                ]}
              />
              <div
                css={[
                  barStyle(theme),
                  isVert && barVerticalStyle,
                  !isVert && barHorizontalStyle,
                ]}
                style={isVert ? { top: offVal } : { right: offVal }}
              />
            </div>
          )}
        </SinglePointerDrag>
        <div
          css={[
            textStyle,
            isVert && valueVerticalStyle,
            !isVert && valueHorizontalStyle,
          ]}
        >
          {valueLabel}
        </div>
      </div>
    )
  }

  private handleDragMove = ({
    movementX,
    movementY,
  }: SinglePointerDragState) => {
    if (!this.barContainer) {
      return
    }

    const { orient = 'vertical', value, onChange = noop } = this.props
    const isVert = orient === 'vertical'
    const movement = isVert ? movementY : movementX
    const dim = isVert
      ? this.barContainer.offsetHeight * -1
      : this.barContainer.offsetWidth

    onChange(clamp(0, 1, movement / dim + value))
  }

  private handleDragEnd = ({
    movementX,
    movementY,
    duration,
    targetX,
    targetY,
  }: SinglePointerDragState) => {
    if (!this.barContainer) {
      return
    }

    const { orient = 'vertical', onChange = noop } = this.props
    const isVert = orient === 'vertical'
    const movement = isVert ? movementY : movementX

    if (duration > 300 || movement > 4) {
      return
    }

    const offset = isVert ? targetY : targetX
    const dim = isVert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    onChange(clamp(0, 1, isVert ? 1 - offset / dim : offset / dim))
  }

  private handleDoubleClick = () => {
    const { onChange = noop, defaultValue = 0.5 } = this.props

    onChange(defaultValue)
  }
}

export default withTheme(Slider)
