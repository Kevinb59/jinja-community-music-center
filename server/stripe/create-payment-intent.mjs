/**
 * Création d’un PaymentIntent Stripe (montant en centimes EUR).
 * Variables : amountCents, email, name → clientSecret pour Payment Element.
 */
import Stripe from 'stripe'

const MIN_CENTS = 100
const MAX_CENTS = 1_000_000

export async function createPaymentIntent({ amountCents, email, name }) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY manquante')
  }

  const cents = Number(amountCents)
  if (!Number.isFinite(cents) || cents < MIN_CENTS || cents > MAX_CENTS) {
    const err = new Error('Montant invalide (min. 1 €, max. 10 000 €)')
    err.statusCode = 400
    throw err
  }

  const stripe = new Stripe(secretKey)
  const donorEmail = String(email || '').trim()
  const donorName = String(name || '').trim()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(cents),
    currency: 'eur',
    automatic_payment_methods: { enabled: true },
    receipt_email: donorEmail.includes('@') ? donorEmail : undefined,
    metadata: {
      donor_name: donorName,
      donor_email: donorEmail
    }
  })

  return { clientSecret: paymentIntent.client_secret }
}
