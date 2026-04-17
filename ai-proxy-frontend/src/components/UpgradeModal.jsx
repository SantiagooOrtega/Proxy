import { useState } from 'react'
import { upgradePlan } from '../services/api'
import toast from 'react-hot-toast'

const PLANS = [
  {
    id: 'FREE',
    label: 'Gratuito',
    price: '$0/mes',
    rpm: '10 solicitudes/min',
    tokens: '50k tokens/mes',
    color: 'border-gray-300',
    selected: 'border-gray-500 bg-gray-50',
  },
  {
    id: 'PRO',
    label: 'Pro',
    price: '$9.99/mes',
    rpm: '60 solicitudes/min',
    tokens: '500k tokens/mes',
    color: 'border-gray-300',
    selected: 'border-indigo-500 bg-indigo-50',
    recommended: true,
  },
  {
    id: 'ENTERPRISE',
    label: 'Enterprise',
    price: 'Personalizado',
    rpm: 'Ilimitado',
    tokens: 'Ilimitado',
    color: 'border-gray-300',
    selected: 'border-purple-500 bg-purple-50',
  },
]

export default function UpgradeModal({ isOpen, onClose, onUpgrade, userId, currentPlan }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const needsPayment = selectedPlan && selectedPlan !== 'FREE'

  const formatCard = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const handleConfirm = async () => {
    if (!selectedPlan) {
      toast.error('Selecciona un plan')
      return
    }
    if (needsPayment && (!name.trim() || cardNumber.trim().length < 4)) {
      toast.error('Completa los datos de pago')
      return
    }
    setLoading(true)
    try {
      await upgradePlan(userId, selectedPlan)
      toast.success(`Plan actualizado a ${selectedPlan}`)
      onUpgrade()
      onClose()
      setSelectedPlan(null)
      setName('')
      setCardNumber('')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedPlan(null)
    setName('')
    setCardNumber('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl px-6 py-5 text-white">
          <h2 className="text-xl font-bold">Cambiar Plan</h2>
          <p className="text-sm text-indigo-200 mt-1">
            Plan actual: <span className="font-semibold text-white">{currentPlan ?? 'FREE'}</span>
          </p>
        </div>

        <div className="p-6 space-y-4">

          {/* Plan selector */}
          <div className="space-y-2">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id
              const isCurrent = plan.id === currentPlan

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all
                    ${isSelected ? plan.selected : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{plan.label}</p>
                        {isCurrent && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            Actual
                          </span>
                        )}
                        {plan.recommended && (
                          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{plan.rpm} · {plan.tokens}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-800">{plan.price}</p>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? 'border-indigo-600' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Payment form — only for paid plans */}
          {needsPayment && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Datos de pago</p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nombre en la tarjeta
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan García"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono tracking-widest"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleClose}
              className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm font-medium
                rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedPlan || loading}
              className="flex-1 py-2 bg-indigo-600 text-white text-sm font-semibold
                rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Procesando...' : selectedPlan === 'FREE' ? 'Cambiar a Gratuito' : `Confirmar — ${PLANS.find(p => p.id === selectedPlan)?.price}`}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
