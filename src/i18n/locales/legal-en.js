/**
 * Legal notice for English UI — summary in English; full French text remains authoritative.
 */
import { LEGAL_CONTACT_EMAIL } from './legal-constants.js'
import { legalModalBodyHtml as legalFrHtml } from './legal-fr.js'

export const legalModalBodyHtml = `
<div class="space-y-6 text-sm leading-7 text-slate-600">
  <p class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-slate-800">
    <strong class="text-slate-900">English summary.</strong>
    Jinja Community Music Center – France is a French non-profit association (law of 1 July 1901).
    This website is governed by <strong class="text-slate-900">French law</strong>.
    The <strong class="text-slate-900">French version below is the legally binding version</strong>.
    For any request regarding your personal data or this site:
    <a href="mailto:${LEGAL_CONTACT_EMAIL}" class="font-medium text-emerald-600 underline">${LEGAL_CONTACT_EMAIL}</a>.
    Donations are <strong class="text-slate-900">not tax-deductible in France</strong> unless otherwise stated by law in your country; we can provide a simple receipt of payment on request.
  </p>
  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Full legal notice (French)</p>
</div>
${legalFrHtml}
`.trim()
