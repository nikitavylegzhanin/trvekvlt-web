/// <reference types="react-scripts" />

import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      text: string
      border: string
      primary: string
      bg: string
      hover: string
      warning: string
    }
  }
}
