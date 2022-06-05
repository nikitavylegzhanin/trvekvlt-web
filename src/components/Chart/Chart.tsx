import { useMemo, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import GoogleChart from 'react-google-charts'

import { Level } from 'components/Bots'
import Controls from './Controls'

const GET_CANDLES = gql`
  query Candles($figi: String!, $interval: Int) {
    candles(figi: $figi, interval: $interval) {
      date
      low
      open
      close
      high
      volume
    }
  }
`

const defaultPoint = {
  type: 'scatter',
  color: 'pink',
  pointSize: 18,
  dataOpacity: 0.8,
}

type Candle = {
  date: Date
  low: number
  open: number
  close: number
  high: number
  volume: number
}

type Props = {
  figi: string
  levels: Level[]
}

const Chart = ({ figi, levels }: Props) => {
  const [interval, setInterval] = useState<2 | 3 | 4>(2)
  const { loading, error, data } = useQuery<{ candles: Candle[] }>(
    GET_CANDLES,
    { variables: { figi, interval } }
  )

  const chartData = useMemo(() => {
    if (!data?.candles.length) {
      return []
    }

    const levelsValues = levels.map((level) => level.value)

    return [
      [
        { type: 'date', label: 'Date' },
        { type: 'number', label: 'Price' }, // Low
        { type: 'number' }, // Open
        { type: 'number' }, // Close
        { type: 'number' }, // High
        // 'Open Position',
        // { type: 'string', role: 'tooltip', p: { html: true } },
        // 'Avg Position',
        // 'Avg Position',
        // 'Close Position by SL',
        // 'Close Position by TP',
        // 'Close Position by SLT_3TICKS',
        // 'Close Position by SLT_50PERCENT',
        // 'Close Position Forcibly',
        ...levels.map((level) => `Level ${level.id}`),
      ],
      ...data.candles.map((candle, index) => [
        new Date(candle.date),
        candle.low,
        candle.open,
        candle.close,
        candle.high,
        // // Open Position
        // index === 20 ? 4.45 : null,
        // index === 20
        //   ? `<strong>BEFORE_LEVEL_3TICKS</strong><br />Price: 4.45<br />Commisions: 0.05`
        //   : null,
        // index === 21 ? 4.42 : null, // Avg Position 1
        // index === 24 ? 4.39 : null, // Avg Position 2
        // index === 26 ? 4.35 : null, // Close Position by SL
        // index === 48 ? 4.42 : null, // Close Position by TP
        // index === 60 ? 4.6 : null, // Close Position by SLT_3TICKS
        // index === 62 ? 4.6 : null, // Close Position by SLT_50PERCENT
        // index === 64 ? 4.6 : null, // Close Position Forcibly
        ...levelsValues,
      ]),
    ]
  }, [levels, data?.candles])

  const options = useMemo(
    () => ({
      tooltip: { isHtml: true },
      series: {
        // 1: { ...defaultPoint, color: 'pink' }, // Open Position
        // 2: { ...defaultPoint, color: 'hotpink' }, // Avg Position 1
        // 3: { ...defaultPoint, color: 'deeppink' }, // Avg Position 2
        // 4: { ...defaultPoint, color: 'red' }, // Close Position by SL
        // 5: { ...defaultPoint, color: 'green' }, // Close Position by TP
        // 6: { ...defaultPoint, color: 'orangered' }, // Close Position by SLT_3TICKS
        // 7: { ...defaultPoint, color: 'indianred' }, // Close Position by SLT_50PERCENT
        // 8: { ...defaultPoint, color: 'grey' }, // Close Position Forcibly
        // Levels
        ...levels
          .map((_, index) => ({
            [index + 1]: {
              type: 'line',
              color: '#abb2bf',
              enableInteractivity: false,
            },
          }))
          .reduce((obj, value) => ({ ...obj, ...value }), {}),
      },
      backgroundColor: '#282c34',
      legend: 'none',
      candlestick: {
        fallingColor: {
          fill: '#636d83',
        },
        risingColor: {
          fill: '#282c34',
        },
      },
      colors: ['#636d83'],
      chartArea: {
        left: 50,
        bottom: 50,
        top: 20,
        width: '100%',
        height: '100%',
      },
      hAxis: {
        format: 'H:mm',
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
        gridlines: {
          count: 0,
        },
        textStyle: {
          color: '#636d83',
        },
        viewWindow: {
          max:
            Math.max(...(data?.candles.map((candle) => candle.high) || [0])) +
            0.02,
          min:
            Math.min(...(data?.candles.map((candle) => candle.low) || [0])) -
            0.02,
        },
      },
    }),
    [levels, data?.candles]
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
      />

      <Controls interval={interval} setInterval={setInterval} />
    </>
  )
}

export default Chart
