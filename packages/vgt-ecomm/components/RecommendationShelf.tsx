'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import BookCard from '@/components/BookCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomerAuthStore } from '@/lib/store/authStore';

export default function RecommendationShelf() {
  const { token, customer } = useCustomerAuthStore();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/api/recommendations', {
          params: { limit: 4 },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setBooks(response.data.data || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [token]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-vgt-dark">
            {customer ? 'Recommended for You' : 'Popular Picks for You'}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {customer
              ? 'Personalized from your reading history and preferences.'
              : 'Sign in to get personalized recommendations based on your reading history.'}
          </p>
        </div>
        {!customer && (
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">Loading recommendations...</CardContent>
        </Card>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            Start browsing books to unlock better recommendations.
          </CardContent>
        </Card>
      )}
    </section>
  );
}