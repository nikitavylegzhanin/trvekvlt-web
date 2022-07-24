import { useCallback, MouseEventHandler, useState, useMemo } from 'react'
import { MutationFunction } from '@apollo/client'

import { ReactComponent as TrashIcon } from './trash.svg'
import { ReactComponent as ArchiveIcon } from './archive.svg'
import { ReactComponent as UnarchiveIcon } from './unarchive.svg'
import styles from './Level.module.css'

export type Level = {
  id: string
  value: number
  status: 'ACTIVE' | 'DISABLED_DURING_SESSION' | 'DISABLED'
  createdAt: string
  updatedAt: string
  openPositions: { id: string }[]
  closedPositions: { id: string }[]
  diff?: string
}

type Props = {
  onDelete: MutationFunction<{ deleteLevel: number }, { levelId: Level['id'] }>
  onChangeLevelStatus: MutationFunction<
    { changeLevelStatus: number },
    { levelId: Level['id']; status: Level['status'] }
  >
}

const LevelItem = ({
  id,
  diff,
  value,
  openPositions,
  closedPositions,
  status,
  onDelete,
  onChangeLevelStatus,
}: Level & Props) => {
  const [isLoading, setLoadingState] = useState(false)

  const onClickDelete = useCallback<MouseEventHandler<HTMLButtonElement>>(
    async (e) => {
      try {
        setLoadingState(true)

        await onDelete({ variables: { levelId: e.currentTarget.value } })
      } catch (error) {
        console.debug(error)
      } finally {
        setLoadingState(false)
      }
    },
    [onDelete]
  )

  const onClickArchive = useCallback<MouseEventHandler<HTMLButtonElement>>(
    async (e) => {
      try {
        setLoadingState(true)

        await onChangeLevelStatus({
          variables: { levelId: e.currentTarget.value, status: 'DISABLED' },
        })
      } catch (error) {
        console.debug(error)
      } finally {
        setLoadingState(false)
      }
    },
    [onChangeLevelStatus]
  )

  const onClickUnarchive = useCallback<MouseEventHandler<HTMLButtonElement>>(
    async (e) => {
      try {
        setLoadingState(true)

        await onChangeLevelStatus({
          variables: { levelId: e.currentTarget.value, status: 'ACTIVE' },
        })
      } catch (error) {
        console.debug(error)
      } finally {
        setLoadingState(false)
      }
    },
    [onChangeLevelStatus]
  )

  const button = useMemo(() => {
    if (openPositions.length || closedPositions.length) {
      if (status === 'ACTIVE') {
        return (
          <button
            className={styles['level__button']}
            value={id}
            disabled={isLoading}
            onClick={onClickArchive}
          >
            <ArchiveIcon />
          </button>
        )
      }

      return (
        <button
          className={styles['level__button']}
          value={id}
          disabled={isLoading}
          onClick={onClickUnarchive}
        >
          <UnarchiveIcon />
        </button>
      )
    }

    return (
      <button
        className={styles['level__button']}
        value={id}
        disabled={isLoading}
        onClick={onClickDelete}
      >
        <TrashIcon />
      </button>
    )
  }, [openPositions.length, closedPositions.length, status])

  return (
    <div className={styles.level}>
      {diff && <div className={styles.diff}>{diff}</div>}

      {value}

      {button}
    </div>
  )
}

export default LevelItem
