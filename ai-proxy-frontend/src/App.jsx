import { useState, useEffect, useCallback } from 'react'
import { Toaster } from 'react-hot-toast'
import { getQuotaStatus, getHistory } from './services/api'
import ChatInterface from './components/ChatInterface'
import QuotaBar from './components/QuotaBar'
import RateLimitCounter from './components/RateLimitCounter'
import UsageChart from './components/UsageChart'
import PlanBadge from './components/PlanBadge'
import UpgradeModal from './components/UpgradeModal'

const USER_ID = 'user-001'

const PLAN_MAX_TOKENS = { FREE: 50000, PRO: 500000, ENTERPRISE: 2147483647 }
const PLAN_MAX_RPM    = { FREE: 10,    PRO: 60,     ENTERPRISE: 2147483647 }

export default function App() {
  const [quotaData, setQuotaData]           = useState(null)
  const [history, setHistory]               = useState([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0)

  // ── data fetching ──────────────────────────────────────────────
  const fetchQuota = useCallback(async () => {
    try {
      const data = await getQuotaStatus(USER_ID)
      setQuotaData(data)
    } catch (_) {}
  }, [])

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getHistory(USER_ID)
      setHistory(data)
    } catch (_) {}
  }, [])

  // initial load
  useEffect(() => {
    fetchQuota()
    fetchHistory()
  }, [fetchQuota, fetchHistory])

  // poll quota every 5 seconds
  useEffect(() => {
    const id = setInterval(fetchQuota, 5000)
    return () => clearInterval(id)
  }, [fetchQuota])

  // ── rate limit countdown ───────────────────────────────────────
  useEffect(() => {
    if (rateLimitSeconds <= 0) return
    const id = setInterval(() => {
      setRateLimitSeconds((s) => {
        if (s <= 1) { clearInterval(id); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [rateLimitSeconds])

  // ── handlers ──────────────────────────────────────────────────
  const handleMessageSent = () => {
    fetchQuota()
    fetchHistory()
  }

  const handleRateLimited = (seconds) => {
    setRateLimitSeconds(seconds)
  }

  const handleQuotaExceeded = () => {
    setShowUpgradeModal(true)
  }

  const handleUpgraded = () => {
    fetchQuota()
    fetchHistory()
  }

  // ── derived values ─────────────────────────────────────────────
  const plan        = quotaData?.plan ?? 'FREE'
  const maxTokens   = PLAN_MAX_TOKENS[plan]
  const maxRequests = PLAN_MAX_RPM[plan]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <h1 className="text-base font-semibold text-gray-800">AI Proxy Platform</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Usuario: <span className="font-medium text-gray-600">{USER_ID}</span></span>
          <PlanBadge plan={plan} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col gap-5 p-5 overflow-y-auto shrink-0">

          <div className="space-y-4">
            <QuotaBar
              tokensUsed={quotaData?.tokensUsed ?? 0}
              maxTokens={maxTokens}
              plan={plan}
              resetDate={quotaData?.resetDate}
            />
            <RateLimitCounter
              requestsUsed={quotaData?.requestsThisMinute ?? 0}
              maxRequests={maxRequests}
              secondsUntilReset={rateLimitSeconds}
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <UsageChart history={history} />
          </div>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="mt-auto w-full py-2 bg-indigo-600 text-white text-sm font-medium
              rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Mejorar plan
          </button>
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface
            userId={USER_ID}
            quotaData={quotaData}
            onMessageSent={handleMessageSent}
            rateLimitSeconds={rateLimitSeconds}
            onRateLimited={handleRateLimited}
            onQuotaExceeded={handleQuotaExceeded}
          />
        </main>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgraded}
        userId={USER_ID}
        currentPlan={plan}
      />
    </div>
  )
}
