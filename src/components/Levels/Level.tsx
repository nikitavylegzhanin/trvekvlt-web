import { useCallback, MouseEventHandler, useState, useMemo } from 'react'
import { MutationFunction } from '@apollo/client'
import styled from 'styled-components'

import { ReactComponent as TrashIcon } from './trash.svg'
import { ReactComponent as ArchiveIcon } from './archive.svg'
import { ReactComponent as UnarchiveIcon } from './unarchive.svg'

const Button = styled.button`
  &:disabled {
    opacity: 0.2 !important;
    cursor: not-allowed;
  }

  cursor: pointer;
  position: absolute;
  right: 0.5em;
  width: 40px;
  height: 40px;
  top: 0.5em;
  color: black;
  opacity: 0.5;
`

const Wrapper = styled.div`
  &::before {
    border-left: 1px solid ${(props) => props.theme.colors.primary};

    content: '';
    position: absolute;
    top: 0;
    left: 1em;
    bottom: 0;
  }

  &:first-child::before {
    top: 100%;
  }

  &:last-child:before {
    bottom: 100%;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.hover};

    & > ${Button} {
      opacity: 1;
    }
  }

  width: 100%;
  padding: 1em 0.5em 1em 1.5em;
  position: relative;
`

const Diff = styled.span`
  background-color: ${(props) => props.theme.colors.primary};

  position: absolute;
  top: -0.5em;
  left: 0.5em;
  font-size: 0.7em;
  padding: 0.2em;
  border-radius: 0.2em;
`

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
          <Button value={id} disabled={isLoading} onClick={onClickArchive}>
            <ArchiveIcon />
          </Button>
        )
      }

      return (
        <Button value={id} disabled={isLoading} onClick={onClickUnarchive}>
          <UnarchiveIcon />
        </Button>
      )
    }

    return (
      <Button value={id} disabled={isLoading} onClick={onClickDelete}>
        <TrashIcon />
      </Button>
    )
  }, [
    id,
    isLoading,
    onClickArchive,
    onClickUnarchive,
    onClickDelete,
    openPositions.length,
    closedPositions.length,
    status,
  ])

  return (
    <Wrapper>
      {diff && <Diff>{diff}</Diff>}

      {value}

      {button}
    </Wrapper>
  )
}

export default LevelItem
