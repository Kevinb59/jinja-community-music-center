import { handleStripeWebhook } from '../../server/stripe/webhook.mjs'

export const config = {
  api: {
    bodyParser: false
  }
}

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method not allowed')
    return
  }

  try {
    const rawBody = await readRawBody(req)
    const signature = req.headers['stripe-signature']
    const result = await handleStripeWebhook(rawBody, signature)
    res.status(200).json(result)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ error: err.message || 'Erreur webhook' })
  }
}
