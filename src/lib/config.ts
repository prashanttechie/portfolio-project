// Configuration for development and production environments

export const config = {
  razorpay: {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'test_secret_key',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret',
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

// Test payment methods for Razorpay testing
export const testPayments = {
  cards: {
    success: '4111111111111111',
    declined: '4000000000000002',
    requiresAuth: '4000002500003155',
  },
  upi: {
    success: 'success@razorpay',
    failure: 'failure@razorpay',
  },
};
