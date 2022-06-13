import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_URL })

const parseDateLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
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

    return response
  })
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: parseDateLink.concat(httpLink),
})

export default client
