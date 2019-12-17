import React, { FunctionComponent, memo } from 'react'
import styled from '@emotion/styled'

import Button from '../Button'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 5em;
  padding: 1em 0;
  font-size: 0.8em;
`

const AddNodeButtons: FunctionComponent<{
  buttons: [string, () => unknown][]
}> = ({ buttons }) => (
  <Container>
    {buttons.map(([name, handler]) => (
      <Button handler={handler} label={`Add ${name}`} key={name} />
    ))}
  </Container>
)

export default memo(AddNodeButtons)
