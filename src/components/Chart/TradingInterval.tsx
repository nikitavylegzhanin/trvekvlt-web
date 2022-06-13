import { useState, useCallback } from 'react'
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker'

import styles from './TradingPeriod.module.css'

type Props = {
  selectedDate: Date
  onSelect: SelectSingleEventHandler
}

const TradingInterval = ({ selectedDate, onSelect }: Props) => {
  const [isOpen, open] = useState(false)

  const onClick = useCallback(() => open((isOpen) => !isOpen), [])

  return (
    <div
      className={[styles.container, isOpen ? styles.open : undefined].join(' ')}
    >
      <button className={styles.button} onClick={onClick}>
        Daypicker
      </button>

      <div className={styles.daypicker}>
        <DayPicker mode="single" selected={selectedDate} onSelect={onSelect} />
      </div>
    </div>
  )
}

export default TradingInterval
