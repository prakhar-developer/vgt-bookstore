'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!orderId || !sessionId) {
      return;
    }

    const confirmPayment = async () => {
      try {
        await axios.post('/api/payments/stripe/confirm', { orderId, sessionId });
      } catch (error) {
        console.error('Failed to confirm Stripe payment', error);
      }
    };

    confirmPayment();
  }, [orderId, sessionId]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card>
        <CardContent className="pt-12 pb-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold text-vgt-dark mb-4">Order Placed Successfully!</h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your order. We&apos;ve received your order and payment screenshot.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
              <p className="text-2xl font-bold text-vgt-primary">{orderId}</p>
            </div>
          )}

          <div className="space-y-4 text-left bg-vgt-surface/10 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-lg text-vgt-dark mb-4">What happens next?</h2>
            <div className="space-y-3">
              <div className="flex space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-vgt-primary text-white rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                <p className="text-gray-700">
                  We&apos;ll verify your payment within 24 hours
                </p>
              </div>
              <div className="flex space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-vgt-primary text-white rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                <p className="text-gray-700">
                  You&apos;ll receive an email confirmation with order details
                </p>
              </div>
              <div className="flex space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-vgt-primary text-white rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                <p className="text-gray-700">
                  Your book will be dispatched within 2-3 business days
                </p>
              </div>
              <div className="flex space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-vgt-primary text-white rounded-full flex items-center justify-center text-sm">
                  4
                </span>
                <p className="text-gray-700">
                  You&apos;ll receive tracking information via email
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/books">
              <Button size="lg" variant="outline">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
