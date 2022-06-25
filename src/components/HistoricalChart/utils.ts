import { GoogleChartOptions } from 'react-google-charts'
import { format } from 'date-fns'

import { Position } from './types'
import styles from '../CandlestickChart/Chart.module.css'

export const DEFAULT_CHART_OPTIONS: GoogleChartOptions = {
  tooltip: { isHtml: true, trigger: 'selection' },
  legend: { position: 'right', textStyle: { color: '#636d83' } },
  bar: { groupWidth: '75%' },
  isStacked: true,
  backgroundColor: '#282c34',
  colors: ['#c16266', '#be8a59', '#90b061', '#9da39d'],
  chartArea: {
    left: 50,
    bottom: 50,
    right: 120,
    top: 20,
    width: '100%',
    height: '100%',
  },
  hAxis: {
    format: 'ccc d MMM',
    minorGridlines: {
      count: 0,
    },
    gridlines: {
      color: '#181a1f',
    },
    textStyle: {
      color: '#636d83',
    },
  },
  vAxis: {
    format: 'percent',
    gridlines: {
      count: 0,
    },
    textStyle: {
      color: '#636d83',
    },
  },
}

export const getColumnTooltip = (ticker: string, positions: Position[]) => {
  const profitPercent = (
    positions.reduce((sum, val) => sum + val.profit.percent, 0) * 100
  ).toFixed(2)
  const profitUsd = positions
    .reduce((sum, val) => sum + val.profit.usd, 0)
    .toFixed(2)

  return `
    <div class=${styles.tooltip}>
      <strong>${ticker}</strong> x${positions.length}
      <br />${profitPercent}% ($${profitUsd})

      ${
        positions.length > 1
          ? `
          <br /><br />

          <ol>
            ${positions
              .map(
                (position) => `
          <li>
            ${format(position.closedAt, 'HH:mm')}
            |
            ${(position.profit.percent * 100).toFixed(
              2
            )}% ($${position.profit.usd.toFixed(2)})
          </li>
      `
              )
              .join('')}
          </ol>`
          : ''
      }
    </div>
  `
}

export const getUsdLineTooltip = (usd: number) => `
  <div class=${styles.tooltip}>
    $${usd.toFixed(2)}
  </div>
`

export const sumProfitPercent = (positions: Position[]) =>
  positions.reduce((sum, position) => sum + position.profit.percent, 0)

export const sumProfitUsd = (positions: Position[]) =>
  positions.reduce((sum, position) => sum + position.profit.usd, 0)
