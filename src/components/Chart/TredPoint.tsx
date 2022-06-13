import { useMemo } from 'react'
import { format } from 'date-fns'

import { Trend } from './Chart.types'
import { getTrendPointId } from './utils'
import styles from './TrendPoint.module.css'
import chartStyles from './Chart.module.css'

const TrendPoint = (trend: Trend) => {
  const id = useMemo(() => getTrendPointId(trend.id), [trend.id])
  const className = useMemo(
    () =>
      [
        styles.container,
        trend.type === 'CORRECTION' ? styles.correction : undefined,
      ].join(' '),
    [trend.type]
  )
  const tooltipText = useMemo(() => format(trend.createdAt, 'PP HH:mm:ss'), [
    trend.createdAt,
  ])

  return (
    <div id={id} className={className}>
      {trend.direction === 'UP' ? '↗️' : '↘️'}

      <span className={`${chartStyles.tooltip} ${styles.tooltip}`}>
        {tooltipText}
      </span>
    </div>
  )
}

export default TrendPoint
