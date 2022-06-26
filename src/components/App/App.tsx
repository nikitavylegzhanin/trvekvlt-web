import { useState } from 'react'

import Bots, { Bot } from 'components/Bots'
import CandlestickChart from 'components/CandlestickChart'
import HistoricalChart from 'components/HistoricalChart'
import styles from './App.module.css'

const App = () => {
  const [bot, selectBot] = useState<Bot>()

  return (
    <main className={styles.container}>
      <section className={styles.bots}>
        <Bots activeBotId={bot?.id} selectBot={selectBot} />
      </section>

      <section className={styles.chart}>
        {bot ? (
          <CandlestickChart botId={bot.id} levels={bot.levels} />
        ) : (
          <HistoricalChart />
        )}
      </section>

      <section className={styles.notifications} />
    </main>
  )
}

export default App
