import { createPaymentIntent } from '../../server/stripe/create-payment-intent.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const result = await createPaymentIntent({
      amountCents: body.amountCents,
      email: body.email,
      name: body.name
    })
    res.status(200).json(result)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ error: err.message || 'Erreur serveur' })
  }
}
