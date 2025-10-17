// Configuration for development and production environments

export const config = {
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_1234567890abcdef1234567890abcdef1234567890abcdef',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER || 'demo@example.com',
    pass: process.env.EMAIL_PASS || 'demo-password',
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },
  app: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    isDevelopment: process.env.NODE_ENV === 'development',
  },
};

// Test card numbers for Stripe testing
export const testCards = {
  success: '4242424242424242',
  declined: '4000000000000002',
  requiresAuth: '4000002500003155',
  insufficient: '4000000000009995',
};
