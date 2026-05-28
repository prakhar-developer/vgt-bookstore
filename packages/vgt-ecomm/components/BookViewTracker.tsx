'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useCustomerAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';

export default function BookViewTracker({
  bookId,
  title,
  category,
}: {
  bookId: string;
  title: string;
  category: string;
}) {
  const customer = useCustomerAuthStore((state) => state.customer);
  const sessionId = useCartStore((state) => state.sessionId);

  useEffect(() => {
    const track = async () => {
      try {
        await axios.post('/api/events', {
          type: 'view_book',
          bookId,
          customerId: customer?.id,
          sessionId,
          metadata: { title, category },
        });
      } catch (error) {
        console.error('Failed to track book view', error);
      }
    };

    track();
  }, [bookId, category, customer?.id, sessionId, title]);

  return null;
}