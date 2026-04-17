import { useState, useRef, useEffect } from 'react'
import { generateText } from '../services/api'
import TokenEstimator from './TokenEstimator'

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3 bg-gray-100 rounded-2xl rounded-tl-none w-fit">
    <span className="text-xs text-gray-500 mr-1">Pensando</span>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
)

export default function ChatInterface({ userId, quotaData, onMessageSent, rateLimitSeconds, onRateLimited, onQuotaExceeded }) {
  const [messages, setMessages] = useState([])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const isRateLimited = rateLimitSeconds > 0
  const isQuotaExceeded =
    quotaData &&
    quotaData.plan !== 'ENTERPRISE' &&
    quotaData.tokensUsed >= (quotaData.plan === 'PRO' ? 500000 : 50000)

  const canSend = !loading && !isRateLimited && !isQuotaExceeded && prompt.trim()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSend) return

    const userMessage = { role: 'user', text: prompt.trim() }
    setMessages((prev) => [...prev, userMessage])
    setPrompt('')
    setLoading(true)

    try {
      const data = await generateText(userId, userMessage.text)
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: data.generatedText,
          tokensUsed: data.tokensUsed,
          processingTimeMs: data.processingTimeMs,
        },
      ])
      onMessageSent()
    } catch (err) {
      if (err.status === 429) {
        onRateLimited(err.retryAfter ?? 60)
        setMessages((prev) => [
          ...prev,
          { role: 'error', text: `Límite de solicitudes alcanzado. Intenta en ${err.retryAfter ?? 60}s.` },
        ])
      } else if (err.status === 402) {
        onQuotaExceeded()
        setMessages((prev) => [
          ...prev,
          { role: 'error', text: 'Cuota mensual agotada. Actualiza tu plan para continuar.' },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'error', text: `Error: ${err.message}` },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">

      {/* Message history */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">Escribe un mensaje para comenzar</p>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === 'user') {
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-[75%] bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm">
                  {msg.text}
                </div>
              </div>
            )
          }

          if (msg.role === 'ai') {
            return (
              <div key={i} className="flex justify-start">
                <div className="max-w-[75%] space-y-1">
                  <div className="bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm leading-relaxed">
                    {msg.text}
                  </div>
                  <p className="text-xs text-gray-400 pl-1">
                    {msg.tokensUsed} tokens · {msg.processingTimeMs}ms
                  </p>
                </div>
              </div>
            )
          }

          if (msg.role === 'error') {
            return (
              <div key={i} className="flex justify-center">
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                  {msg.text}
                </p>
              </div>
            )
          }

          return null
        })}

        {loading && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 px-4 py-3 space-y-2">
        {isRateLimited && (
          <p className="text-xs text-orange-500 font-medium">
            Límite alcanzado. Espera {rateLimitSeconds}s
          </p>
        )}
        {isQuotaExceeded && (
          <p className="text-xs text-red-500 font-medium">
            Cuota agotada. Actualiza tu plan
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              rows={2}
              disabled={isRateLimited || isQuotaExceeded}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                disabled:bg-gray-50 disabled:text-gray-400"
            />
            <TokenEstimator promptText={prompt} />
          </div>
          <button
            type="submit"
            disabled={!canSend}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl
              hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors self-start mt-0.5"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
