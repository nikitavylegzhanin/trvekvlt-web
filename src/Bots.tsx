import { useCallback, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { gql, useQuery } from '@apollo/client'

const GET_BOTS = gql`
  query Bots {
    bots {
      id
      name
      accountId
      ticker
    }
  }
`

export type Bot = {
  id: string
  name: string
  accountId: string
  ticker: string
}

type Props = {
  selectBot: Dispatch<SetStateAction<Bot | undefined>>
}

const Bots = ({ selectBot }: Props) => {
  const { loading, error, data } = useQuery<{ bots: Bot[] }>(GET_BOTS)

  const onChangeBot = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const bot = data?.bots.find((bot) => bot.id === e.currentTarget.value)

      return selectBot(bot)
    },
    [data?.bots, selectBot]
  )

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error.message}</span>

  return (
    <select onChange={onChangeBot}>
      <option />

      {data?.bots.map((bot) => (
        <option key={bot.id} value={bot.id}>
          {bot.name} ({bot.ticker})
        </option>
      ))}
    </select>
  )
}

export default Bots
