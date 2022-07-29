import { ChangeEventHandler, useMemo } from 'react'
import styled from 'styled-components'

import { ReactComponent as ClockIcon } from './clock.svg'
import Loading from './Loading'

const Track = styled.span`
  background: ${(props) => props.theme.colors.border};
  border-radius: 1em;
  cursor: pointer;
  display: flex;
  height: 2em;
  width: 4em;
  margin-right: 12px;
  position: relative;
`

const Indicator = styled.span`
  align-items: center;
  border-radius: 50%;
  height: 1.5em;
  width: 1.5em;
  display: flex;
  justify-content: center;
  outline: solid 2px transparent;
  position: absolute;
  top: 0.25em;
  left: 0.25em;
  transition: 0.2s;
  color: #636d83;
`

const Input = styled.input.attrs({ type: 'checkbox' })`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;

  &:disabled + ${Track} {
    cursor: not-allowed;
  }

  &:not(:checked) + ${Track} ${Indicator} {
    border: 1px solid #636d83;
  }

  &:checked + ${Track} ${Indicator} {
    background-color: ${(props) => props.theme.colors.primary};
    transform: translateX(2em);
    color: black;
  }
`

type Props = {
  isChecked?: boolean
  isLoading?: boolean
  isTemporary?: boolean
  onChange?: ChangeEventHandler
}

const Switch = ({ isChecked, isLoading, isTemporary, onChange }: Props) => {
  const indicator = useMemo(() => {
    if (isLoading) return <Loading />

    if (isTemporary) return <ClockIcon />

    return null
  }, [isLoading, isTemporary])

  return (
    <label>
      <Input disabled={isLoading} checked={isChecked} onChange={onChange} />

      <Track>
        <Indicator>{indicator}</Indicator>
      </Track>
    </label>
  )
}

export default Switch
