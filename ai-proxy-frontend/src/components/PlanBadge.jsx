const PLAN_CONFIG = {
  FREE: {
    label: 'Plan Gratuito',
    className: 'bg-gray-100 text-gray-600 border-gray-300',
  },
  PRO: {
    label: 'Plan Pro',
    className: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  ENTERPRISE: {
    label: 'Plan Enterprise',
    className: 'bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-yellow-400',
  },
}

export default function PlanBadge({ plan }) {
  const config = PLAN_CONFIG[plan] ?? PLAN_CONFIG.FREE

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  )
}
