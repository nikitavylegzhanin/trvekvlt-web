import { useMemo, useCallback, ChangeEventHandler } from 'react'
import { useMutation, useApolloClient } from '@apollo/client'
import { loader } from 'graphql.macro'

import { Bot } from 'components/Bots'
import { botsQuery } from 'components/Bots'
import Switch from './Switch'

const changeBotStatusMutation = loader('./changeBotStatus.gql')

type Props = {
  botId: Bot['id']
}

const BotStatus = ({ botId }: Props) => {
  const client = useApolloClient()
  const botsQueryResult = client.readQuery<{ bots: Bot[] }>(
    { query: botsQuery },
    true
  )

  const status = useMemo(() => {
    const bot = botsQueryResult?.bots.find((bot) => bot.id === botId)

    return bot?.status
  }, [botId, botsQueryResult])

  const [changeBotStatus, { loading }] = useMutation<
    { changeBotStatus: number },
    { botId: Bot['id']; status: Bot['status'] }
  >(changeBotStatusMutation, {
    optimisticResponse: {
      changeBotStatus: 1,
    },
    update: (cache, result, { variables }) => {
      if (!result.data?.changeBotStatus || !variables) return

      cache.updateQuery<{ bots: Bot[] }>({ query: botsQuery }, (data) => {
        if (!data?.bots) return { bots: [] }

        return {
          bots: data.bots.map((bot) =>
            bot.id === variables.botId
              ? { ...bot, status: variables.status }
              : bot
          ),
        }
      })
    },
  })

  const { isChecked, isTemporary } = useMemo(
    () => ({
      isChecked: status === 'RUNNING',
      isTemporary: status === 'DISABLED_DURING_SESSION',
    }),
    [status]
  )

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (e) => {
      try {
        await changeBotStatus({
          variables: {
            botId,
            status: e.currentTarget.checked ? 'RUNNING' : 'DISABLED',
          },
        })
      } catch (error) {
        console.debug(error)
      }
    },
    [changeBotStatus, botId]
  )

  return (
    <Switch
      isLoading={!status || loading}
      isChecked={isChecked}
      isTemporary={isTemporary}
      onChange={onChange}
    />
  )
}

export default BotStatus
