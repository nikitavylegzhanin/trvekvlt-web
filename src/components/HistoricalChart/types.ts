type Profit = {
  usd: number
  percent: number
}

type Instrument = {
  figi: string
  name: string
  ticker: string
}

type Operation = {
  id: string
  currency: string
  payment: number
  price: number
  quantity: number
  date: string
  type: string
  operationType: string
}

export type Position = {
  closedAt: Date
  profit: Profit
  instrument: Instrument
  operations: Operation[]
}
