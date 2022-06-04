import { useState } from 'react'

import Bots, { Bot } from './Bots'

const App = () => {
  const [selectedBot, selectBot] = useState<Bot>()

  if (selectedBot) {
    return <div>{JSON.stringify(selectedBot)}</div>
  }

  return <Bots selectBot={selectBot} />
}

export default App
