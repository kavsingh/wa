import styled from '@emotion/styled'
import type { ReactElement } from 'react'

import Button, { ButtonProps } from './button'

const ButtonSet = styled.div<{
  children: ReactElement<ButtonProps>[] | ReactElement<ButtonProps>
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 5em;
  padding: 0.8rem 0;
`

export { Button }

export default ButtonSet
