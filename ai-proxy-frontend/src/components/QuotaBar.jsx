export default function QuotaBar({ tokensUsed = 0, maxTokens, plan, resetDate }) {
  const isUnlimited = !maxTokens || maxTokens === 2147483647
  const pct = isUnlimited ? 0 : Math.min((tokensUsed / maxTokens) * 100, 100)

  const barColor =
    pct >= 90
      ? 'bg-red-500'
      : pct >= 60
      ? 'bg-yellow-400'
      : 'bg-emerald-500'

  const formattedReset = resetDate
    ? new Date(resetDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Cuota Mensual</span>
        <span className="text-xs text-gray-500">
          {isUnlimited
            ? `${tokensUsed.toLocaleString('es-ES')} / ∞ tokens usados`
            : `${tokensUsed.toLocaleString('es-ES')} / ${maxTokens.toLocaleString('es-ES')} tokens usados`}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: isUnlimited ? '0%' : `${pct}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {isUnlimited ? 'Sin límite mensual' : `${pct.toFixed(1)}% utilizado`}
        </span>
        {formattedReset && (
          <span className="text-xs text-gray-400">
            Reinicia el {formattedReset}
          </span>
        )}
      </div>
    </div>
  )
}
