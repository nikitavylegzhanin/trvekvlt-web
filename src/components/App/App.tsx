import { useState } from 'react'
import styled from 'styled-components'

import Bots, { Bot } from 'components/Bots'
import CandlestickChart from 'components/CandlestickChart'
import HistoricalChart from 'components/HistoricalChart'

const Wrapper = styled.main`
  display: grid;
  grid-template-columns: auto 400px;
  grid-template-rows: 60px auto;

  width: 100vw;
  height: 100vh;
`

const BotsSection = styled.section`
  grid-column: 1;
  grid-row: 1;

  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const ContentSection = styled.section`
  grid-column: 1;
  grid-row: 2;

  position: relative;
`

const NotificationsSection = styled.section`
  grid-column: 2;
  grid-row-start: 1;
  grid-row-end: span 2;

  border-left: 1px solid ${(props) => props.theme.colors.border};
`

const App = () => {
  const [bot, selectBot] = useState<Bot>()

  return (
    <Wrapper>
      <BotsSection>
        <Bots activeBotId={bot?.id} selectBot={selectBot} />
      </BotsSection>

      <ContentSection>
        {bot ? (
          <CandlestickChart botId={bot.id} levels={bot.levels} />
        ) : (
          <HistoricalChart />
        )}
      </ContentSection>

      <NotificationsSection />
    </Wrapper>
  )
}

export default App
