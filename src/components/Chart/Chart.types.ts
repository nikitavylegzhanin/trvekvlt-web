export type Candle = {
  date: Date
  low: number
  open: number
  close: number
  high: number
  volume: number
}

export type Trend = {
  id: string
  direction: string
  type: string
  createdAt: Date
  updatedAt: Date
}

export type Position = {
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export type Order = {
  id: number
  price: number
  currency: string
  quantity: number
  direction: string
  type: string
  rule: string
  createdAt: Date
  updatedAt: string
  position: Position
}

export type ChartData = {
  candles: Candle[]
  trends: Trend[]
  orders: Order[]
}
