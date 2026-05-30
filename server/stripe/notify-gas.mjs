/**
 * Notification GAS après paiement Stripe validé (webhook → mail-handler.gs).
 */
export async function notifyGasDonation({ amountEur, currency, name, email, paymentId }) {
  const gasUrl = process.env.GAS_URL_CONTACT || process.env.GAS_URL_STRIPE_NOTIFY
  const secret = process.env.STRIPE_GAS_NOTIFY_SECRET

  if (!gasUrl || gasUrl.includes('XXXXX') || !secret) {
    console.warn('[stripe webhook] GAS ou STRIPE_GAS_NOTIFY_SECRET non configuré — e-mail ignoré')
    return { skipped: true }
  }

  const params = new URLSearchParams({
    type: 'stripe_donation',
    secret,
    amount: String(amountEur),
    currency: String(currency || 'eur').toUpperCase(),
    name: String(name || ''),
    email: String(email || ''),
    payment_id: String(paymentId || '')
  })

  const res = await fetch(`${gasUrl}?${params.toString()}`, { method: 'GET' })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`GAS notify failed (${res.status}): ${text}`)
  }
  return { ok: true, body: text }
}
