import { useCallback, MouseEvent, Dispatch, SetStateAction } from 'react'
import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'

import styles from './Bots.module.css'

const botsQuery = loader('./bots.graphql')

export type Level = {
  id: string
  value: number
}

export type Bot = {
  id: string
  name: string
  accountId: string
  ticker: string
  figi: string
  levels: Level[]
}

type Props = {
  activeBotId?: Bot['id']
  selectBot: Dispatch<SetStateAction<Bot | undefined>>
}

const Bots = ({ activeBotId, selectBot }: Props) => {
  const { loading, error, data } = useQuery<{ bots: Bot[] }>(botsQuery)

  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const { value } = e.currentTarget
      const bot =
        activeBotId !== value
          ? data?.bots.find((bot) => bot.id === e.currentTarget.value)
          : undefined

      return selectBot(bot)
    },
    [data?.bots, activeBotId, selectBot]
  )

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error.message}</span>

  return (
    <ul className={styles.bots}>
      {data?.bots?.map((bot) => (
        <li key={bot.id}>
          <button
            className={[
              styles.bot,
              activeBotId === bot.id ? styles.active : undefined,
            ].join(' ')}
            value={bot.id}
            onClick={onClick}
          >
            {bot.name}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Bots
