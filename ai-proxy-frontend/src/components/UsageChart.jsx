import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  // dateStr comes as "YYYY-MM-DD"
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-indigo-600">{payload[0].value.toLocaleString('es-ES')} tokens</p>
      {payload[1] && (
        <p className="text-gray-500">{payload[1].value} solicitudes</p>
      )}
    </div>
  )
}

export default function UsageChart({ history = [] }) {
  const data = history.map((d) => ({
    date: formatDate(d.date),
    tokens: d.tokensUsed ?? 0,
    requests: d.requestsCount ?? 0,
  }))

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Uso de los últimos 7 días
      </h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-36 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          Sin datos de uso aún
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
            <Bar dataKey="tokens" radius={[6, 6, 0, 0]} maxBarSize={48} name="Tokens" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
