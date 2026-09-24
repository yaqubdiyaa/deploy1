import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import {
  AlertTriangle,
  ArrowDownUp,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
} from 'lucide-react'

import { Badge } from '../lib/shadcn/badge'
import { Button } from '../lib/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '../lib/shadcn/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../lib/shadcn/table'
import { cn } from '../lib/shadcn/utils'
import { isOrderFlagged, orders, orderSummary, type Order } from './data/orders'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

function formatStatus(status: Order['status']) {
  if (status === 'in_transit') return 'In transit'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function statusVariant(status: Order['status']) {
  if (status === 'delivered') return 'success'
  if (status === 'delayed') return 'warning'
  return 'secondary'
}

function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  urgent = false,
}: {
  title: string
  value: string
  detail: string
  icon: typeof PackageCheck
  urgent?: boolean
}) {
  return (
    <Card className={cn('overflow-hidden', urgent && 'border-warning/60 bg-warning/10')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn('h-4 w-4 text-muted-foreground', urgent && 'text-warning')} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function DelayedOrdersPanel({ delayedOrders }: { delayedOrders: Order[] }) {
  return (
    <Card className="border-warning/60 bg-warning/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <CardTitle className="text-lg">Delayed more than 3 days</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {delayedOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between gap-4 rounded-md border bg-card/80 p-3"
          >
            <div>
              <div className="font-medium">{order.id}</div>
              <div className="text-sm text-muted-foreground">{order.customer}</div>
            </div>
            <Badge variant="warning" className="shrink-0">
              {order.days_delayed} days late
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function OrdersTable() {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'days_delayed', desc: true }])

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            Order
            <ArrowDownUp className="h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
      },
      {
        accessorKey: 'customer',
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            Customer
            <ArrowDownUp className="h-3.5 w-3.5" />
          </Button>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)}>{formatStatus(row.original.status)}</Badge>
        ),
      },
      {
        accessorKey: 'placed',
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            Placed
            <ArrowDownUp className="h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => formatDate(row.original.placed),
      },
      {
        accessorKey: 'expected',
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            Expected
            <ArrowDownUp className="h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => formatDate(row.original.expected),
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            Amount
            <ArrowDownUp className="h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => currencyFormatter.format(row.original.amount),
      },
      {
        accessorKey: 'days_delayed',
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            Delay
            <ArrowDownUp className="h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) =>
          isOrderFlagged(row.original) ? (
            <Badge variant="warning" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {row.original.days_delayed} days
            </Badge>
          ) : (
            <span className="text-muted-foreground">{row.original.days_delayed} days</span>
          ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All orders</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Orders with more than 3 days delayed are highlighted and flagged.
            </p>
          </div>
          <Badge variant="outline">{orders.length} orders</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => {
                const flagged = isOrderFlagged(row.original)

                return (
                  <TableRow
                    key={row.id}
                    className={cn(flagged && 'bg-warning/10 hover:bg-warning/20')}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function OrderManagementPage() {
  const delayedOrders = useMemo(() => orders.filter(isOrderFlagged), [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-retool-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              Order management
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Order delay tracker</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Monitor every order, review fulfillment status, and immediately spot orders delayed by
              more than 3 days.
            </p>
          </div>
          <div className="rounded-xl border bg-warning/10 p-4 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Delay rule
            </div>
            <p className="mt-1 text-muted-foreground">Flag when days_delayed is greater than 3.</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total orders"
            value={String(orderSummary.totalOrders)}
            detail="Across the order list"
            icon={PackageCheck}
          />
          <StatCard
            title="Flagged delayed"
            value={String(orderSummary.flaggedOrders)}
            detail="More than 3 days delayed"
            icon={AlertTriangle}
            urgent
          />
          <StatCard
            title="Active orders"
            value={String(orderSummary.activeOrders)}
            detail="In transit or delayed"
            icon={Clock3}
          />
          <StatCard
            title="Total value"
            value={currencyFormatter.format(orderSummary.totalValue)}
            detail="Combined order amount"
            icon={CheckCircle2}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <OrdersTable />
          <DelayedOrdersPanel delayedOrders={delayedOrders} />
        </section>
      </div>
    </main>
  )
}
