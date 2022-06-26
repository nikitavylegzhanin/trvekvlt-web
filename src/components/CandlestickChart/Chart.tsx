import { useMemo, useState, useCallback, MouseEvent, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import GoogleChart from 'react-google-charts'
import { isWithinInterval } from 'date-fns'

import { Bot, Level } from 'components/Bots'
import styles from './Chart.module.css'
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

type Scroll = {
  isScrolling: boolean
  y: number
  clientY: number
}

const initScroll = {
  isScrolling: false,
  y: 0,
  clientY: 0,
}

const Chart = ({ botId, levels }: Props) => {
  const [scroll, setScroll] = useState<Scroll>(initScroll)
  const [{ max, min }, setMaxMin] = useState<{ max: number; min: number }>({
    max: 0,
    min: 0,
  })
  const [candleInterval, setCandleInterval] = useState<2 | 3 | 4>(2)
  const [tradingInterval, setTradingInterval] = useState({
    from: new Date('2022-06-06T16:00:01'),
    to: new Date('2022-06-06T23:59:59'),
  })
  const { loading, error, data } = useQuery<{ chart: ChartData }>(chartQuery, {
    variables: {
      botId,
      interval: candleInterval,
      ...tradingInterval,
    },
  })

  const initMaxMin = useMemo(
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

  useEffect(() => setMaxMin(initMaxMin), [initMaxMin])

  useEffect(() => {
    const scale = scroll.y / 1000

    setMaxMin({
      max: initMaxMin.max * (1 - scale),
      min: initMaxMin.min * (1 + scale),
    })
  }, [initMaxMin, scroll.y])

  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) =>
      setScroll((scroll) => ({
        ...scroll,
        isScrolling: true,
        clientY: e.clientY,
      })),
    []
  )

  const onMouseUp = useCallback(
    () =>
      setScroll((scroll) => ({
        ...scroll,
        isScrolling: false,
      })),
    []
  )

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) =>
      setScroll((scroll) => {
        if (scroll.isScrolling) {
          return {
            ...scroll,
            y: scroll.y - e.clientY + scroll.clientY,
            clientY: e.clientY,
          }
        }

        return scroll
      }),
    []
  )

  const onMouseLeave = useCallback(
    () => setScroll((scroll) => ({ ...scroll, isScrolling: false })),
    []
  )

  const onDoubleClick = useCallback(() => setScroll(initScroll), [])

  const chartData = useMemo(() => {
    if (!data?.chart.candles.length) {
      return []
    }

    const withOrders = !!data.chart.orders.length

    return [
      getChartDataHeaders(levels, withOrders),
      ...data.chart.candles.map((candle, index, candles) => {
        const nextCandle = candles[index + 1]

        const candleOrders = withOrders
          ? nextCandle
            ? data.chart.orders
                .filter(({ createdAt }) =>
                  isWithinInterval(createdAt, {
                    start: candle.date,
                    end: nextCandle.date,
                  })
                )
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            : []
          : []

        return [
          candle.date,
          candle.low,
          candle.open,
          candle.close,
          candle.high,
          getCandleTooltip(candle, candleInterval),
          ...(withOrders
            ? [
                candleOrders.length ? getOrdersAvgPrice(candleOrders) : null,
                candleOrders.length ? getOrdersPoint(candleOrders) : null,
                candleOrders.length ? getOrdersTooltip(candleOrders) : null,
              ]
            : []),
          ...levels.map((level) => level.value),
        ]
      }),
    ]
  }, [levels, data?.chart, candleInterval])

  const options = useMemo(
    () => ({
      ...DEFAULT_CHART_OPTIONS,
      series: {
        ...(data?.chart.orders.length
          ? {
              1: { type: 'scatter', dataOpacity: 0.8 }, // orders
            }
          : undefined),
        ...levels
          .map((_, index) => ({
            [index + (data?.chart.orders.length ? 2 : 1)]: {
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
    [levels, max, min, data?.chart.orders]
  )

  const chartEvents = useMemo(
    () =>
      !data?.chart
        ? []
        : [getTrendPointsEvent(data.chart.trends, data.chart.candles[0].date)],
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

      <div
        className={styles.scrollY}
        onDoubleClick={onDoubleClick}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />

      {data?.chart.trends.map((trend) => (
        <TrendPoint key={trend.id} {...trend} />
      ))}

      <Controls
        candleInterval={candleInterval}
        setCandleInterval={setCandleInterval}
        tradingInterval={tradingInterval}
        setTradingInterval={setTradingInterval}
      />
    </>
  )
}

export default Chart
