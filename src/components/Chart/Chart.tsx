import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import GoogleChart from 'react-google-charts'
import { isWithinInterval } from 'date-fns'

import { Bot, Level } from 'components/Bots'
import { ChartData } from './Chart.types'
import Controls from './Controls'
import TrendPoint from './TredPoint'
import {
  getChartDataHeaders,
  getCandleTooltip,
  getOrdersAvgPrice,
  getOrdersPoint,
  getOrdersTooltip,
  DEFAULT_CHART_OPTIONS,
  getTrendPointsEvent,
} from './utils'

const chartQuery = loader('./chart.graphql')

type Props = {
  botId: Bot['id']
  levels: Level[]
}

const Chart = ({ botId, levels }: Props) => {
  const [interval, setInterval] = useState<2 | 3 | 4>(2)
  const { loading, error, data } = useQuery<{ chart: ChartData }>(chartQuery, {
    variables: {
      botId,
      from: '2022-06-06T16:00:01',
      to: '2022-06-06T23:59:59',
      interval,
    },
  })

  const { max, min } = useMemo(
    () => ({
      max:
        Math.max(...(data?.chart.candles.map((candle) => candle.high) || [0])) +
        0.02,
      min:
        Math.min(...(data?.chart.candles.map((candle) => candle.low) || [0])) -
        0.02,
    }),
    [data?.chart?.candles]
  )

  const chartData = useMemo(() => {
    if (!data?.chart.candles.length) {
      return []
    }

    return [
      getChartDataHeaders(levels),
      ...data.chart.candles.map((candle, index, candles) => {
        const nextCandle = candles[index + 1]

        const candleOrders = nextCandle
          ? data.chart.orders
              .filter(({ createdAt }) =>
                isWithinInterval(createdAt, {
                  start: candle.date,
                  end: nextCandle.date,
                })
              )
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          : []

        return [
          candle.date,
          candle.low,
          candle.open,
          candle.close,
          candle.high,
          getCandleTooltip(candle, interval),
          candleOrders.length ? getOrdersAvgPrice(candleOrders) : null,
          candleOrders.length ? getOrdersPoint(candleOrders) : null,
          candleOrders.length ? getOrdersTooltip(candleOrders) : null,
          ...levels.map((level) => level.value),
        ]
      }),
    ]
  }, [levels, data?.chart, interval])

  const options = useMemo(
    () => ({
      ...DEFAULT_CHART_OPTIONS,
      series: {
        ...DEFAULT_CHART_OPTIONS.series,
        ...levels
          .map((_, index) => ({
            [index + 2]: {
              type: 'line',
              color: '#abb2bf',
              enableInteractivity: false,
            },
          }))
          .reduce((obj, value) => ({ ...obj, ...value }), {}),
      },
      vAxis: {
        ...DEFAULT_CHART_OPTIONS.vAxis,
        viewWindow: { max, min },
      },
    }),
    [levels, max, min]
  )

  const chartEvents = useMemo(
    () =>
      !data?.chart
        ? []
        : [
            getTrendPointsEvent(
              data.chart.trends,
              data.chart.candles[0].date,
              min
            ),
          ],
    [data?.chart]
  )

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error.message}</span>

  return (
    <>
      <GoogleChart
        chartType="CandlestickChart"
        width="100%"
        height="500px"
        data={chartData}
        options={options}
        chartEvents={chartEvents}
      />

      {data?.chart.trends.map((trend) => (
        <TrendPoint key={trend.id} {...trend} />
      ))}

      <Controls interval={interval} setInterval={setInterval} />
    </>
  )
}

export default Chart
