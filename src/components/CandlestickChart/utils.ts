import { format, sub } from 'date-fns'
import { GoogleChartOptions, ReactGoogleChartEvent } from 'react-google-charts'

import { Level } from 'components/Bots'
import { Candle, Order, Trend } from './Chart.types'
import styles from './Chart.module.css'

const ordersRows = [
  'Orders',
  { type: 'string', role: 'style' },
  { type: 'string', role: 'tooltip', p: { html: true } },
]

export const getChartDataHeaders = (levels: Level[], withOrders: boolean) => [
  { type: 'date', label: 'Date' },
  { type: 'number' }, // low
  { type: 'number' }, // open
  { type: 'number' }, // close
  { type: 'number' }, // high
  { type: 'string', role: 'tooltip', p: { html: true } }, // candle tooltip
  ...(withOrders ? ordersRows : []),
  ...levels.map((level) => ({ type: 'number', label: level.id.toString() })),
]

const getFirstDate = (date: Date, candleInterval: 2 | 3 | 4) =>
  sub(date, {
    hours: candleInterval === 4 ? 1 : undefined,
    minutes: candleInterval === 2 ? 5 : candleInterval === 3 ? 15 : undefined,
  })

export const getCandleTooltip = (candle: Candle, interval: 2 | 3 | 4) => `
  <div class=${styles.tooltip}>
    <strong>
      ${format(getFirstDate(candle.date, interval), 'HH:mm')}
      -
      ${format(candle.date, 'HH:mm')}
    </strong>
    <br />Open: ${candle.open}
    <br />Close: ${candle.close}
    <br />High: ${candle.high}
    <br />Low: ${candle.low}
    <br />Vol: ${candle.volume}
  </div>
`

export const getOrdersAvgPrice = (orders: Order[]) =>
  orders.reduce((sum, { price }) => sum + price, 0) / orders.length

const pointSize = 12

const getPointFillColor = (orders: Order[]) =>
  orders.length === 1 ? 'pink' : orders.length === 2 ? 'hotpink' : 'deeppink'

export const getOrdersPoint = (orders: Order[]) => `
  point {
    size: ${Math.round(pointSize * (1 + orders.length / 5))};
    fill-color: ${getPointFillColor(orders)};
  }
`

export const getOrdersTooltip = (orders: Order[]) => `
  <div class=${styles.tooltip}>
    ${orders
      .map(
        (order) => `
          <strong>${order.rule}</strong>
          <br />${order.quantity} x ${order.price} ${order.currency}
          <br />${order.direction} ${order.type}
          <br />${format(order.createdAt, 'hh:mm:ss.S')}
        `
      )
      .join('<br /><br />')}
  </div>
`

export const DEFAULT_CHART_OPTIONS: GoogleChartOptions = {
  tooltip: { isHtml: true, trigger: 'selection' },
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
  },
}

export const getTrendPointId = (id: Trend['id']) => `chartTrendPoint${id}`

export const getTrendPointsEvent = (
  trends: Trend[],
  minX: Date
): ReactGoogleChartEvent => ({
  eventName: 'ready',
  callback: (event) => {
    const chart = event.chartWrapper.getChart() as any
    const layout = chart.getChartLayoutInterface()

    trends.forEach((trend, index) => {
      const x = layout.getXLocation(!index ? minX : trend.createdAt)

      const el = document.getElementById(getTrendPointId(trend.id))
      if (el) {
        el.setAttribute('style', `left: ${Math.round(x)}px; top: 430px;`)
      }
    })
  },
})
