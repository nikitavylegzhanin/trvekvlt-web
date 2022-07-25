import { useMemo, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { loader } from 'graphql.macro'

import { Bot } from 'components/Bots'
import AddLevel from './AddLevel'
import LevelItem, { Level } from './Level'

const addLevelMutation = loader('./addLevel.gql')
const levelsQuery = loader('./levels.gql')
const deleteLevelMutation = loader('./deleteLevel.gql')
const changeLevelStatusMutation = loader('./changeLevelStatus.gql')

const getDiff = (value1: number, value2: number) =>
  ((1 - value1 / value2) * 100).toFixed(2)

type Props = {
  botId: Bot['id']
}

const Levels = ({ botId }: Props) => {
  const { loading, error, data } = useQuery<{ levels: Level[] }>(levelsQuery, {
    variables: { botId },
  })

  const [addLevel] = useMutation<
    { addLevel: Level },
    { botId: Bot['id']; value: Level['value'] }
  >(addLevelMutation, {
    update: (cache, result) => {
      if (!result.data) return

      const { addLevel: level } = result.data
      cache.updateQuery<{ levels: Level[] }>(
        {
          query: levelsQuery,
          variables: { botId },
        },
        (data) => {
          if (!data?.levels) return { levels: [] }

          if (data.levels.findIndex((v) => v.id === level.id) !== -1)
            return data

          return {
            levels: [
              ...data.levels,
              {
                ...level,
                openPositions: [],
                closedPositions: [],
              },
            ],
          }
        }
      )
    },
  })

  const onAddLevel = useCallback(
    (value: Level['value']) => addLevel({ variables: { botId, value } }),
    [addLevel, botId]
  )

  const [deleteLevel] = useMutation<
    { deleteLevel: number },
    { levelId: Level['id'] }
  >(deleteLevelMutation, {
    update: (cache, result, { variables }) => {
      if (result.data?.deleteLevel && variables?.levelId) {
        cache.updateQuery<{ levels: Level[] }>(
          { query: levelsQuery, variables: { botId }, overwrite: true },
          (data) => ({
            levels:
              data?.levels.filter((level) => level.id !== variables.levelId) ||
              [],
          })
        )
      }
    },
  })

  const [changeLevelStatus] = useMutation<
    { changeLevelStatus: number },
    { levelId: Level['id']; status: Level['status'] }
  >(changeLevelStatusMutation, {
    update: (cache, result, { variables }) => {
      if (result.data?.changeLevelStatus && variables) {
        cache.updateQuery<{ levels: Level[] }>(
          { query: levelsQuery, variables: { botId } },
          (data) => ({
            levels:
              data?.levels.map((level) =>
                level.id === variables.levelId
                  ? { ...level, status: variables.status }
                  : level
              ) || [],
          })
        )
      }
    },
  })

  const levels = useMemo(
    () =>
      data?.levels
        ? [...data.levels]
            .sort((a, b) => b.value - a.value)
            .map((level, index, levels) => {
              if (!index) return level

              return {
                ...level,
                diff: getDiff(level.value, levels[index - 1].value),
              }
            })
        : [],
    [data]
  )

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error.message}</span>

  return (
    <div>
      <AddLevel onAddLevel={onAddLevel} />

      <div>
        {levels.map((level) => (
          <LevelItem
            key={level.id}
            {...level}
            onDelete={deleteLevel}
            onChangeLevelStatus={changeLevelStatus}
          />
        ))}
      </div>
    </div>
  )
}

export default Levels
