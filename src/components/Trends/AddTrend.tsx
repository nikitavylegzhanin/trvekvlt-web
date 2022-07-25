import { useCallback, FormEventHandler, useState } from 'react'
import styled from 'styled-components'

import { Trend } from './Trend'

const Form = styled.form`
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  padding: 0 1em;
  height: 5em;
  display: flex;
  align-items: center;
`

const Select = styled.select`
  border: 2px solid ${(props) => props.theme.colors.border};

  &:focus {
    box-shadow: 0 0 5px ${(props) => props.theme.colors.primary};
    outline-width: 0;
  }

  box-shadow: none;
  border-radius: 0.5em;
  width: 100%;
  height: 3em;
  background-color: transparent;
  padding-left: 0.5em;
`

const Button = styled.button`
  margin-left: 1em;

  &:disabled {
    cursor: not-allowed;
  }
`

type Props = {
  onAddTrend: (direction: Trend['direction']) => Promise<any>
}

const AddTrend = ({ onAddTrend }: Props) => {
  const [isLoading, setLoadingState] = useState(false)

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault()

      const direction: Trend['direction'] = (e.target as any).direction.value

      setLoadingState(true)

      try {
        await onAddTrend(direction)
      } catch (error) {
        console.debug(error)
      } finally {
        setLoadingState(false)
      }
    },
    [onAddTrend]
  )

  return (
    <Form autoComplete="off" onSubmit={onSubmit}>
      <Select name="direction">
        <option value="UP">Uptrend</option>

        <option value="DOWN">Downtrend</option>
      </Select>

      <Button type="submit" disabled={isLoading}>
        Add
      </Button>
    </Form>
  )
}

export default AddTrend
