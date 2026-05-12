import { format, parseISO } from 'date-fns'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Briefcase,
  MessageSquare,
  Percent,
  Trophy,
  XCircle,
} from 'lucide-react'
import {
  APPLICATION_STATUSES,
  STATUS_STYLES,
} from '../constants'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DemoLoading } from '../components/DemoLoading'
import { StatusBadge } from '../components/StatusBadge'
import { useApplications } from '../context/useApplications'
import { cn } from '@/lib/utils'

const CHART_FILL = {
  Applied: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
}

function MetricCard({ label, value, hint, icon: Icon, accent }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </CardTitle>
        <span
          className={cn(
            'flex size-9 items-center justify-center rounded-xl ring-1 ring-black/[0.04]',
            accent,
          )}
        >
          <Icon className="size-4 text-zinc-700" aria-hidden />
        </span>
      </CardHeader>
      <CardContent className="pb-5">
        <p className="text-3xl font-bold tabular-nums tracking-tight text-zinc-900">
          {value}
        </p>
        {hint ? (
          <p className="mt-2 text-xs leading-snug text-zinc-500">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function StatusSummaryCard({ status, count, total }) {
  const meta = STATUS_STYLES[status]
  const pct = total === 0 ? 0 : Math.round((count / total) * 1000) / 10

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className={cn('absolute inset-x-0 top-0 h-1 rounded-t-2xl', meta.dot)} />
      <CardHeader className="pb-2 pt-5">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-zinc-900">
            {status}
          </CardTitle>
          <span className="text-2xl font-bold tabular-nums text-zinc-900">
            {count}
          </span>
        </div>
        <CardDescription className="text-xs">
          {pct}% of pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5 pt-0">
        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
          <div
            className={cn('h-full rounded-full transition-all duration-500', meta.dot)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const { applications, ready, useApi } = useApplications()

  if (!ready) {
    return <DemoLoading label="Connecting to your data…" />
  }

  const total = applications.length
  const interviews = applications.filter((a) => a.status === 'Interview').length
  const offers = applications.filter((a) => a.status === 'Offer').length
  const rejections = applications.filter((a) => a.status === 'Rejected').length
  const responded = applications.filter((a) =>
    ['Interview', 'Offer', 'Rejected'].includes(a.status),
  ).length
  const responseRate =
    total === 0 ? 0 : Math.round((responded / total) * 1000) / 10

  const statusCounts = APPLICATION_STATUSES.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
    fill: CHART_FILL[status],
  }))

  const recent = [...applications]
    .sort((a, b) => {
      const da = parseISO(a.dateApplied)
      const db = parseISO(b.dateApplied)
      return db - da
    })
    .slice(0, 8)

  return (
    <div className="space-y-10 pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
          Pipeline health at a glance.
          {useApi
            ? ' Data is loaded from the REST API (PostgreSQL).'
            : ' Offline demo: data stays in this browser (localStorage).'}
        </p>
      </div>

      <section aria-label="Summary metrics">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            label="Total applications"
            value={total}
            icon={Briefcase}
            accent="bg-indigo-50"
          />
          <MetricCard
            label="Interviews"
            value={interviews}
            icon={MessageSquare}
            accent="bg-amber-50"
          />
          <MetricCard
            label="Offers"
            value={offers}
            icon={Trophy}
            accent="bg-emerald-50"
          />
          <MetricCard
            label="Rejections"
            value={rejections}
            icon={XCircle}
            accent="bg-red-50"
          />
          <MetricCard
            label="Response rate"
            value={`${responseRate}%`}
            hint="Moved past “Applied”"
            icon={Percent}
            accent="bg-violet-50"
          />
        </div>
      </section>

      <section aria-label="Status breakdown">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Status summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {APPLICATION_STATUSES.map((status) => (
            <StatusSummaryCard
              key={status}
              status={status}
              count={statusCounts.find((s) => s.status === status)?.count ?? 0}
              total={total}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2" aria-label="Charts">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Applications by stage</CardTitle>
            <CardDescription>Volume per pipeline column</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-56 w-full sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusCounts}
                  margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 11, fill: '#71717a' }}
                    axisLine={{ stroke: '#e4e4e7' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#71717a' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgb(244 244 245 / 0.8)' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e4e4e7',
                      fontSize: '12px',
                      boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.15)',
                    }}
                    formatter={(value) => [value, 'Count']}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48}>
                    {statusCounts.map((entry) => (
                      <Cell key={entry.status} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Pipeline mix</CardTitle>
            <CardDescription>Share of applications by outcome</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex h-56 flex-col sm:h-64 sm:flex-row sm:items-center">
              <div className="h-48 flex-1 sm:h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusCounts}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={76}
                      paddingAngle={3}
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {statusCounts.map((entry) => (
                        <Cell key={entry.status} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e4e4e7',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs sm:mt-0 sm:flex-col sm:justify-center sm:pl-2">
                {APPLICATION_STATUSES.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-zinc-600">
                    <span
                      className={`size-2 shrink-0 rounded-full ${STATUS_STYLES[s].dot}`}
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Recent applications</CardTitle>
          <CardDescription>Newest by date applied — click Applications for full list</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <div className="thin-scrollbar max-h-[min(420px,50vh)] overflow-y-auto px-6">
            <ul className="divide-y divide-zinc-100">
              {recent.length === 0 ? (
                <li className="py-10 text-center text-sm text-zinc-500">
                  No applications yet.
                </li>
              ) : (
                recent.map((app) => (
                  <li
                    key={app.id}
                    className="flex flex-col gap-3 py-4 transition-colors hover:bg-indigo-50/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="font-semibold tracking-tight text-zinc-900">
                        {app.company}
                      </p>
                      <p className="text-sm text-zinc-600">{app.role}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <StatusBadge status={app.status} />
                      <span className="text-xs tabular-nums text-zinc-500">
                        Applied {format(parseISO(app.dateApplied), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
