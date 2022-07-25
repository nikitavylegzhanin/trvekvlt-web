import { DefaultTheme, createGlobalStyle } from 'styled-components'
import 'react-day-picker/dist/style.css'

const theme: DefaultTheme = {
  colors: {
    text: '#abb2bf',
    border: '#181a1f',
    primary: '#802c5a',
    bg: '#21252b',
    hover: 'rgba(255, 20, 147, 0.1)',
    warning: '#e06c75',
  },
}

export const GlobalStyle = createGlobalStyle`
  :root {
    --main-background-color: #21252b;
    --main-border-color: #181a1f;
    --main-text-color: #abb2bf;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    background-color: ${(props) => props.theme.colors.bg};
    color: ${(props) => props.theme.colors.text};
  }

  button {
    background-color: transparent;
    border: none;
    padding: 0px;
  }

  .google-visualization-tooltip {
    border: none !important;
    border-radius: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
  }
`

export default theme
