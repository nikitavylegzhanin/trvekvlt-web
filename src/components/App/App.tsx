import { useState } from 'react'

import Bots, { Bot } from 'components/Bots'
import Chart from 'components/Chart'
import styles from './App.module.css'

const App = () => {
  const [bot, selectBot] = useState<Bot>()

  return (
    <main className={styles.container}>
      <section className={styles.bots}>
        <Bots activeBotId={bot?.id} selectBot={selectBot} />
      </section>

      <section className={styles.chart}>
        {!!bot && <Chart figi={bot.figi} levels={bot.levels} />}
      </section>

      <section className={styles.notifications} />
    </main>
  )
}

export default App
