import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import Chart from 'react-google-charts'
import {
  eachDayOfInterval,
  startOfWeek,
  endOfDay,
  addDays,
  isSameDay,
} from 'date-fns'

import {
  DEFAULT_CHART_OPTIONS,
  getColumnTooltip,
  getUsdLineTooltip,
  sumProfitPercent,
  sumProfitUsd,
} from './utils'
import { Position } from './types'

const positionsQuery = loader('./positions.graphql')

const from = startOfWeek(new Date(), { weekStartsOn: 1 })
const variables = {
  from,
  to: endOfDay(addDays(from, 4)),
}

const HistoricalChart = () => {
  const { loading, error, data } = useQuery<{ positions: Position[] }>(
    positionsQuery,
    { variables }
  )

  const tickers = useMemo(
    () =>
      data?.positions
        ?.map((position) => position.instrument.ticker)
        .filter((value, index, self) => self.indexOf(value) === index) || [],
    [data?.positions]
  )

  const chartData = useMemo(() => {
    const positionsGroupedByDay = eachDayOfInterval({
      start: variables.from,
      end: variables.to,
    }).map((date) => ({
      date,
      positions:
        data?.positions.filter((position) =>
          isSameDay(date, position.closedAt)
        ) || [],
    }))

    const profitPercents = positionsGroupedByDay
      .map(({ positions }) => sumProfitPercent(positions))
      .filter((value) => value)

    const maxProfitPercent = Math.max(...profitPercents)

    const avgPercent =
      profitPercents.reduce((sum, percent) => sum + percent, 0) /
      profitPercents.length

    const maxProfitUsd = Math.max(
      ...positionsGroupedByDay.map(({ positions }) => sumProfitUsd(positions))
    )

    return [
      [
        'Ticker',
        ...tickers
          .map((ticker) => [
            ticker,
            { type: 'string', role: 'tooltip', p: { html: true } },
          ])
          .flat(),
        { type: 'number', label: 'USD' },
        { type: 'string', role: 'style' },
        { type: 'string', role: 'tooltip', p: { html: true } },
        { type: 'number', label: `Avg ${(avgPercent * 100).toFixed(2)}%` },
      ],
      ...positionsGroupedByDay.map(({ date, positions }) => {
        const dailyProfitUsd = positions.reduce(
          (sum, val) => sum + val.profit.usd,
          0
        )
        const usdLineValue =
          maxProfitPercent * 0.85 * (dailyProfitUsd / maxProfitUsd)

        return [
          date,
          ...tickers
            .map((ticker) => {
              const positionsForTicker =
                positions.filter(
                  (position) => position.instrument.ticker === ticker
                ) || []

              const profitPercent = positionsForTicker.reduce(
                (sum, val) => sum + val.profit.percent,
                0
              )

              return [
                profitPercent || null,
                getColumnTooltip(ticker, positionsForTicker),
              ]
            })
            .flat(),
          usdLineValue + 0.002,
          `point { visible: ${!!usdLineValue} }`,
          getUsdLineTooltip(dailyProfitUsd),
          avgPercent,
        ]
      }),
    ]
  }, [data?.positions, tickers])

  const options = useMemo(
    () => ({
      ...DEFAULT_CHART_OPTIONS,
      series: {
        [tickers.length]: {
          type: 'line',
          curveType: 'function',
          pointSize: 8,
        },
        [tickers.length + 1]: {
          type: 'line',
          lineDashStyle: [5, 5],
          enableInteractivity: false,
        },
      },
    }),
    [tickers]
  )

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error.message}</span>

  return (
    <Chart
      chartType="ColumnChart"
      data={chartData}
      options={options}
      width="100%"
      height="330px"
    />
  )
}

export default HistoricalChart
