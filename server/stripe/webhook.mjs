/**
 * Webhook Stripe : payment_intent.succeeded → notification e-mail via GAS.
 */
import Stripe from 'stripe'
import { notifyGasDonation } from './notify-gas.mjs'

export async function handleStripeWebhook(rawBody, signature) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    const err = new Error('Stripe webhook non configuré')
    err.statusCode = 500
    throw err
  }

  const stripe = new Stripe(secretKey)
  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const e = new Error(`Signature webhook invalide: ${err.message}`)
    e.statusCode = 400
    throw e
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    const amountEur = (pi.amount / 100).toFixed(2)
    const meta = pi.metadata || {}

    await notifyGasDonation({
      amountEur,
      currency: pi.currency,
      name: meta.donor_name || '',
      email: meta.donor_email || pi.receipt_email || '',
      paymentId: pi.id
    })
  }

  return { received: true }
}
