import { useState } from 'react'
import styled from 'styled-components'

import Bots, { Bot } from 'components/Bots'
import BotStatus from 'components/BotStatus'
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
  const [botId, setBotId] = useState<Bot['id']>()

  return (
    <Wrapper>
      <BotsSection>
        <Bots botId={botId} setBotId={setBotId} />
      </BotsSection>

      <ContentSection>
        {botId ? (
          <>
            <div style={{ position: 'absolute', zIndex: 1, left: 50, top: 10 }}>
              <BotStatus botId={botId} />
            </div>

            <CandlestickChart botId={botId} />
          </>
        ) : (
          <HistoricalChart />
        )}
      </ContentSection>

      <NotificationsSection />
    </Wrapper>
  )
}

export default App
