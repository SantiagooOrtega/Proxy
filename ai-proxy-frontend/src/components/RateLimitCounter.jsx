export default function RateLimitCounter({ requestsUsed = 0, maxRequests, secondsUntilReset = 0 }) {
  const isUnlimited = !maxRequests || maxRequests === 2147483647
  const pct = isUnlimited ? 0 : Math.min((requestsUsed / maxRequests) * 100, 100)

  const barColor =
    pct >= 90
      ? 'bg-red-500'
      : pct >= 70
      ? 'bg-yellow-400'
      : 'bg-blue-500'

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          Solicitudes por minuto:{' '}
          <span className="font-bold text-gray-900">
            {requestsUsed}/{isUnlimited ? '∞' : maxRequests}
          </span>
        </span>
        {secondsUntilReset > 0 && (
          <span className="text-xs font-medium text-orange-500">
            Reinicia en: {secondsUntilReset}s
          </span>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: isUnlimited ? '0%' : `${pct}%` }}
        />
      </div>

      {pct >= 90 && !isUnlimited && (
        <p className="text-xs text-red-500">
          Límite de solicitudes casi alcanzado
        </p>
      )}
    </div>
  )
}
