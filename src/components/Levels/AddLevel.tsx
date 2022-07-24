import { useCallback, FormEventHandler, useState } from 'react'

import { Level } from './Level'
import styles from './AddLevel.module.css'

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
    <form
      className={styles['add-level']}
      autoComplete="off"
      onSubmit={onSubmit}
    >
      <input name="value" placeholder="Level value" autoComplete="off" />

      <button type="submit" disabled={isLoading}>
        Add
      </button>
    </form>
  )
}

export default AddLevel
