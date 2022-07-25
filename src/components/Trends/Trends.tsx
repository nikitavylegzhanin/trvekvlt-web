import { useMemo, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { loader } from 'graphql.macro'
import { formatDistance } from 'date-fns'
import styled from 'styled-components'

import { Bot } from 'components/Bots'
import AddTrend from './AddTrend'
import TrendItem, { Trend } from './Trend'

const trendsQuery = loader('./trends.gql')
const addTrendMutation = loader('./addTrend.gql')

const List = styled.div`
  padding-top: 1em;
  height: calc(100% - 5em);
`

type Props = {
  botId: Bot['id']
}

const Trends = ({ botId }: Props) => {
  const { loading, error, data } = useQuery<{ trends: Trend[] }>(trendsQuery, {
    variables: { botId },
  })

  const [addTrend] = useMutation<
    { addTrend: Trend },
    { botId: Bot['id']; direction: Trend['direction'] }
  >(addTrendMutation, {
    update: (cache, result) => {
      if (!result.data) return

      const { addTrend: trend } = result.data
      cache.updateQuery<{ trends: Trend[] }>(
        { query: trendsQuery, variables: { botId } },
        (data) => {
          const trends = data?.trends || []

          if (trends[0]?.id === trend.id) return { trends }

          return { trends: [trend, ...trends] }
        }
      )
    },
  })

  const onAddTrend = useCallback(
    (direction: Trend['direction']) =>
      addTrend({ variables: { botId, direction } }),
    [addTrend, botId]
  )

  const trends = useMemo(
    () =>
      data?.trends.map((trend, index, trends) => ({
        ...trend,
        distance: formatDistance(
          index === 0 ? new Date() : trends[index - 1].createdAt,
          trend.createdAt
        ),
      })) || [],
    [data]
  )

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error.message}</span>

  return (
    <div>
      <AddTrend onAddTrend={onAddTrend} />

      <List>
        {trends.map((trend) => (
          <TrendItem key={trend.id} {...trend} />
        ))}
      </List>
    </div>
  )
}

export default Trends
