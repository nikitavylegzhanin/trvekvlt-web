import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_URL })

const parseDateLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    if (response?.data?.trends) {
      response.data.trends = response.data.trends.map((trend: any) => ({
        ...trend,
        createdAt: new Date(trend.createdAt),
      }))
    }

    if (response?.data?.addTrend) {
      response.data.addTrend = {
        ...response.data.addTrend,
        createdAt: new Date(response.data.addTrend.createdAt),
      }
    }

    if (response?.data?.chart?.candles) {
      response.data.chart.candles = response.data.chart.candles.map(
        (candle: any) => ({
          ...candle,
          date: new Date(candle.date),
        })
      )
    }

    if (response?.data?.chart?.orders) {
      response.data.chart.orders = response.data.chart.orders.map(
        (order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
        })
      )
    }

    if (response?.data?.chart?.trends) {
      response.data.chart.trends = response.data.chart.trends.map(
        (trend: any) => ({
          ...trend,
          createdAt: new Date(trend.createdAt),
        })
      )
    }

    if (response?.data?.positions) {
      response.data.positions = response.data.positions.map(
        (position: any) => ({
          ...position,
          closedAt: new Date(position.closedAt),
        })
      )
    }

    return response
  })
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: parseDateLink.concat(httpLink),
})

export default client
