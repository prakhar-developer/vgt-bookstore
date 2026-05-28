'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/api/admin/reviews');
      setReviews(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId: string, approved: boolean) => {
    try {
      await api.patch('/api/admin/reviews', { reviewId, approved });
      toast.success('Review updated');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await api.delete(`/api/admin/reviews?reviewId=${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-vgt-dark mb-8">Reviews Management</h1>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-vgt-dark">{review.customerName}</p>
                    <p className="text-sm text-gray-600">{review.book?.title || 'Unknown book'}</p>
                    <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
                  </div>
                  <Badge variant={review.approved ? 'success' : 'secondary'}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>

                <p className="font-medium">{review.title}</p>
                {review.photoUrl ? (
                  <Image src={review.photoUrl} alt={review.title} width={320} height={200} className="rounded-lg object-cover" />
                ) : null}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant={review.approved ? 'outline' : 'default'} onClick={() => updateReview(review._id, !review.approved)}>
                    {review.approved ? 'Unapprove' : 'Approve'}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteReview(review._id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No reviews have been submitted yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}