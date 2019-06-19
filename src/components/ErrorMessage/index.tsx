import React, { memo, FunctionComponent, ReactNode } from 'react'
import { css } from '@emotion/core'
import { withTheme } from 'emotion-theming'

import { UITheme } from '~/style/theme'

const rootStyle = (theme: UITheme) =>
  css({
    backgroundColor: theme.colorError,
    color: theme.colorEmphasis,
    fontSize: '0.9em',
    padding: '2em',
    width: '100%',
  })
// For some reason memo does not expose children properly.
// TODO: kiv type updates
const ErrorMessage: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <div css={rootStyle}>{children}</div>

export default memo(withTheme(ErrorMessage))
