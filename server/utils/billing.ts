import type { CheckoutPayload } from './contracts'

interface BillingRuntimeConfig {
  billingMode?: unknown
  stripeSecretKey?: unknown
  paidPlanPriceId?: unknown
}

export function createCheckoutResponse(body: CheckoutPayload, config: BillingRuntimeConfig) {
  if (config.billingMode === 'demo' || !config.stripeSecretKey || !config.paidPlanPriceId) {
    return {
      mode: 'demo' as const,
      checkoutUrl: `/pricing?checkout=demo&plan=${body.plan}&email=${encodeURIComponent(body.email)}`,
      message: 'Demo checkout created. Add Stripe keys to turn this into a real hosted-plan checkout.'
    }
  }

  return {
    mode: 'manual' as const,
    checkoutUrl: `mailto:sales@example.com?subject=Hosted%20CRM%20signup&body=${encodeURIComponent(`Email: ${body.email}\nPlan: ${body.plan}`)}`,
    message: 'Stripe keys are present, but the production Stripe call is intentionally left as an integration boundary.'
  }
}
