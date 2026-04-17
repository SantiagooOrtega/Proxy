import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Normalize error so callers always get a plain message + optional metadata
const handleError = (error) => {
  if (error.response) {
    const data = error.response.data
    const err = new Error(data?.error || data?.message || 'Request failed')
    err.status = error.response.status
    err.retryAfter = data?.retryAfter ?? null
    throw err
  }
  throw new Error(error.message || 'Network error')
}

export const generateText = async (userId, prompt) => {
  try {
    const { data } = await client.post('/api/ai/generate', {
      userId,
      prompt,
      model: 'mock-gpt',
    })
    return data
  } catch (error) {
    handleError(error)
  }
}

export const getQuotaStatus = async (userId) => {
  try {
    const { data } = await client.get('/api/quota/status', { params: { userId } })
    return data
  } catch (error) {
    handleError(error)
  }
}

export const getHistory = async (userId) => {
  try {
    const { data } = await client.get('/api/quota/history', { params: { userId } })
    return data
  } catch (error) {
    handleError(error)
  }
}

export const upgradePlan = async (userId, plan) => {
  try {
    const { data } = await client.post('/api/quota/upgrade', null, {
      params: { userId, plan },
    })
    return data
  } catch (error) {
    handleError(error)
  }
}
