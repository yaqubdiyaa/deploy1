import ordersRaw from '../../data/orders.json'

export type OrderStatus = 'delivered' | 'delayed' | 'in_transit'

export type Order = {
  id: string
  customer: string
  amount: number
  placed: string
  expected: string
  status: OrderStatus
  days_delayed: number
}

export const orders = ordersRaw as Order[]

export const isOrderFlagged = (order: Order) => order.days_delayed > 3

export const orderSummary = {
  totalOrders: orders.length,
  flaggedOrders: orders.filter(isOrderFlagged).length,
  activeOrders: orders.filter((order) => order.status !== 'delivered').length,
  totalValue: orders.reduce((sum, order) => sum + order.amount, 0),
}
