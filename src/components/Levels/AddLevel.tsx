import { useCallback, FormEventHandler, useState } from 'react'
import styled from 'styled-components'

import { Level } from './Level'

const Form = styled.form`
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  padding: 0 1em;
  height: 5em;
  display: flex;
  align-items: center;
`

const Input = styled.input`
  border: 2px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text};

  &:focus {
    box-shadow: 0 0 5px ${(props) => props.theme.colors.primary};
    outline-width: 0;
  }

  width: 100%;
  height: 3em;
  background-color: transparent;
  box-shadow: none;
  border-radius: 0.5em;
  appearance: none;
  padding-left: 0.5em;
`

const Button = styled.button`
  width: auto;
  margin-left: 1em;
  color: black;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

type Props = {
  onAddLevel: (value: Level['value']) => Promise<any>
}

const AddLevel = ({ onAddLevel }: Props) => {
  const [isLoading, setLoadingState] = useState(false)

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault()

      const value = parseFloat((e.target as any)[0].value)
      e.currentTarget.reset()

      if (!isNaN(value)) {
        setLoadingState(true)

        try {
          await onAddLevel(value)
        } catch (error) {
          console.debug(error)
        } finally {
          setLoadingState(false)
        }
      }
    },
    [onAddLevel]
  )

  return (
    <Form autoComplete="off" onSubmit={onSubmit}>
      <Input name="value" placeholder="Level value" autoComplete="off" />

      <Button type="submit" disabled={isLoading}>
        Add
      </Button>
    </Form>
  )
}

export default AddLevel
