import { Dispatch, SetStateAction, useCallback, MouseEvent } from 'react'
import { set } from 'date-fns'

import TradingInterval from './TradingInterval'
import styles from './Controls.module.css'

type Props = {
  candleInterval: 2 | 3 | 4
  setCandleInterval: Dispatch<SetStateAction<2 | 3 | 4>>
  tradingInterval: { from: Date; to: Date }
  setTradingInterval: Dispatch<SetStateAction<{ from: Date; to: Date }>>
}

const candleIntervals = [
  { value: 2, label: '5m' },
  { value: 3, label: '15m' },
  { value: 4, label: '1h' },
]

const ChartControls = ({
  candleInterval,
  setCandleInterval,
  tradingInterval,
  setTradingInterval,
}: Props) => {
  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const value = parseInt(e.currentTarget.value)

      if (value !== 2 && value !== 3 && value !== 4) return

      return setCandleInterval(value)
    },
    [setCandleInterval]
  )

  const onSelectDay = useCallback(
    (date?: Date) => {
      if (date) {
        setTradingInterval({
          from: set(date, { hours: 16 }),
          to: set(date, { hours: 23 }),
        })
      }
    },
    [setTradingInterval]
  )

  return (
    <div className={styles.controls}>
      <TradingInterval
        selectedDate={tradingInterval.from}
        onSelect={onSelectDay}
      />

      <div className={styles.intervals}>
        {candleIntervals.map(({ value, label }) => (
          <button
            key={value}
            value={value}
            className={[
              styles.interval,
              candleInterval === value ? styles.active : undefined,
            ].join(' ')}
            onClick={onClick}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChartControls
