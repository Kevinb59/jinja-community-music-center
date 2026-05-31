/**
 * Formulaire de don Stripe intégré : montants suggérés, montant libre, Payment Element.
 */
import React, { useMemo, useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { notifyStripeDonation } from './gasSubmit'
import { useCopy } from './i18n/LocaleContext.jsx'
import { DONATION_SUGGESTED_AMOUNTS, isStripePaymentConfigured, STRIPE_PUBLISHABLE_KEY } from './siteConfig'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null

function eurosToCents(value) {
  const n = Number(String(value).replace(',', '.'))
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100)
}

function PaymentStep({ onSuccess, onBack, busy, setBusy, setError }) {
  const copy = useCopy()
  const stripe = useStripe()
  const elements = useElements()

  async function handlePay(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    setBusy(true)
    setError('')
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}${window.location.pathname}#don-financier`
      }
    })

    setBusy(false)
    if (error) {
      setError(error.message || copy.donateStripePayError)
      return
    }
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent)
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs'
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!stripe || !elements || busy}
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {busy ? copy.donateStripePaying : copy.donateStripePayBtn}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={busy}
          className="text-sm font-medium text-slate-600 underline underline-offset-4 hover:text-slate-900"
        >
          {copy.donateStripeBack}
        </button>
      </div>
    </form>
  )
}

export default function DonationStripeForm({ inputClass, labelClass }) {
  const copy = useCopy()
  const stripeReady = isStripePaymentConfigured() && Boolean(stripePromise)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [step, setStep] = useState('amount')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const amountCents = useMemo(() => {
    if (selectedPreset != null) return selectedPreset * 100
    return eurosToCents(customAmount)
  }, [selectedPreset, customAmount])

  const amountLabel = useMemo(() => {
    if (selectedPreset != null) return `${selectedPreset} €`
    const n = Number(String(customAmount).replace(',', '.'))
    return Number.isFinite(n) && n > 0 ? `${n.toFixed(2).replace(/\.00$/, '')} €` : ''
  }, [selectedPreset, customAmount])

  async function handlePaymentSuccess(paymentIntent) {
    setStep('success')

    // Purpose: notification e-mail via GAS (GET classique), comme contact/virement.
    // GAS vérifie payment_id chez Stripe — pas de webhook Stripe → GAS.
    try {
      await notifyStripeDonation({ paymentId: paymentIntent.id })
    } catch {
      // Paiement OK même si l’e-mail échoue (GAS non configuré, etc.).
    }
  }

  async function startPayment(e) {
    e.preventDefault()
    setError('')

    if (!stripeReady) {
      setError(copy.donateStripeConfigHint)
      return
    }

    if (amountCents < 100) {
      setError(copy.donateStripeAmountError)
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError(copy.donateStripeEmailError)
      return
    }

    setBusy(true)
    try {
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountCents,
          email: email.trim(),
          name: name.trim()
        })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || copy.donateStripePayError)
      }
      setClientSecret(data.clientSecret)
      setStep('pay')
    } catch (err) {
      setError(err.message || copy.donateStripePayError)
    } finally {
      setBusy(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-900">
        <p className="font-semibold">{copy.donateStripeSuccessTitle}</p>
        <p className="mt-2">{copy.donateStripeSuccessText}</p>
      </div>
    )
  }

  if (step === 'pay' && clientSecret && stripePromise) {
    const options = { clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#059669' } } }
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          {copy.donateStripeAmountConfirm} <strong className="text-slate-900">{amountLabel}</strong>
        </p>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <Elements stripe={stripePromise} options={options}>
          <PaymentStep
            onSuccess={handlePaymentSuccess}
            onBack={() => {
              setStep('amount')
              setClientSecret('')
              setError('')
            }}
            busy={busy}
            setBusy={setBusy}
            setError={setError}
          />
        </Elements>
      </div>
    )
  }

  return (
    <form onSubmit={startPayment} className="space-y-4">
      {!stripeReady ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {copy.donateStripeConfigHint}
        </p>
      ) : null}

      {/* Purpose: montants suggérés + saisie libre en euros. */}
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">{copy.donateStripeAmountLabel}</p>
        <div className="flex flex-wrap gap-2">
          {DONATION_SUGGESTED_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => {
                setSelectedPreset(amount)
                setCustomAmount('')
              }}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition',
                selectedPreset === amount
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50'
              )}
            >
              {amount} €
            </button>
          ))}
        </div>
        <label className={cn(labelClass, 'mt-3 block')}>
          {copy.donateStripeCustomAmount}
          <input
            className={inputClass}
            type="number"
            min="1"
            step="0.01"
            inputMode="decimal"
            placeholder={copy.placeholderStripeAmount}
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value)
              setSelectedPreset(null)
            }}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          {copy.donateStripeNameLabel}
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={copy.placeholderName}
          />
        </label>
        <label className={labelClass}>
          {copy.donateStripeEmailLabel}
          <input
            className={inputClass}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.placeholderEmail}
          />
        </label>
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {busy ? copy.donateStripeLoading : copy.donateStripeContinue}
      </button>
    </form>
  )
}
