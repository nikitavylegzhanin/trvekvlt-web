import { Dispatch, SetStateAction, useCallback, MouseEvent } from 'react'

import styles from './Controls.module.css'

type Props = {
  interval: 2 | 3 | 4
  setInterval: Dispatch<SetStateAction<2 | 3 | 4>>
}

const intervals = [
  { value: 2, label: '5m' },
  { value: 3, label: '15m' },
  { value: 4, label: '1h' },
]

const ChartControls = ({ interval, setInterval }: Props) => {
  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const value = parseInt(e.currentTarget.value)

      if (value !== 2 && value !== 3 && value !== 4) return

      return setInterval(value)
    },
    [setInterval]
  )

  return (
    <div className={styles.controls}>
      {intervals.map(({ value, label }) => (
        <button
          key={value}
          value={value}
          className={[
            styles.interval,
            interval === value ? styles.active : undefined,
          ].join(' ')}
          onClick={onClick}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default ChartControls
