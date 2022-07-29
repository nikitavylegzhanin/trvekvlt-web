import styled, { keyframes } from 'styled-components'

import { ReactComponent as CogIcon } from './cog.svg'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Loading = styled(CogIcon)`
  animation: ${rotate} 3.5s linear infinite;
`

export default Loading
