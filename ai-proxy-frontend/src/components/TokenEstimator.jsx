export default function TokenEstimator({ promptText = '' }) {
  const wordCount = promptText.trim() === '' ? 0 : promptText.trim().split(/\s+/).length
  const estimatedTokens = Math.ceil(wordCount * 2.5)

  if (!promptText.trim()) return null

  return (
    <p className="text-xs text-gray-400">
      ~<span className="font-semibold text-gray-600">{estimatedTokens}</span> tokens estimados
    </p>
  )
}
