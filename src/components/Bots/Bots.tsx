import { useCallback, MouseEvent, Dispatch, SetStateAction } from 'react'
import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import styled, { css } from 'styled-components'

const botsQuery = loader('./bots.gql')

const Wrapper = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  height: 100%;

  & > li {
    float: left;
    height: inherit;
  }
`

const Button = styled.button<{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive ? props.theme.colors.primary : 'transparent'};

  ${(props) =>
    !props.isActive &&
    css`
      &:hover {
        background-color: ${(props) => props.theme.colors.hover};
      }
    `}

  color: inherit;
  width: 100px;
  height: inherit;
  font-size: 1.1rem;
  font-weight: bold;
`

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
    <Wrapper>
      {data?.bots?.map((bot) => (
        <li key={bot.id}>
          <Button
            isActive={activeBotId === bot.id}
            value={bot.id}
            onClick={onClick}
          >
            {bot.name}
          </Button>
        </li>
      ))}
    </Wrapper>
  )
}

export default Bots
