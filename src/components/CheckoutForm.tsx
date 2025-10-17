'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  amount: number;
  courseName: string;
  orderId: string;
  enrollmentId: number;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay: {
      new (options: {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        handler: (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => void;
        prefill: {
          name: string;
          email: string;
        };
        theme: {
          color: string;
        };
        modal: {
          ondismiss: () => void;
        };
      }): {
        open: () => void;
      };
    };
  }
}

export default function CheckoutForm({
  amount,
  courseName,
  orderId,
  enrollmentId,
  onSuccess,
}: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: Math.round(amount * 100), // Convert to paise
          currency: 'INR',
          name: 'Portfolio Courses',
          description: courseName,
          order_id: orderId,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // Verify payment on server
              const verifyResponse = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...response,
                  enrollmentId,
                }),
              });

              if (verifyResponse.ok) {
                window.location.href = '/payment/success?status=success';
                onSuccess?.();
              } else {
                throw new Error('Payment verification failed');
              }
            } catch {
              setErrorMessage('Payment verification failed. Please contact support.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: '',
            email: '',
          },
          theme: {
            color: '#2563eb',
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };

      script.onerror = () => {
        setErrorMessage('Failed to load payment gateway');
        setIsProcessing(false);
      };
    } catch {
      setErrorMessage('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Course:</span>
          <span className="font-semibold">{courseName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount:</span>
          <span className="text-2xl font-bold text-blue-600">₹{amount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ₹${amount.toLocaleString('en-IN')}`
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span>Secure payment powered by</span>
        <span className="font-semibold text-blue-600">Razorpay</span>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Supports UPI, Cards, Net Banking, Wallets & more
      </div>
    </div>
  );
}
