'use client';

import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomerAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import axios from 'axios';
import Image from 'next/image';

type Review = {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  photoUrl?: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

export default function BookReviews({ bookId, initialReviews = [], initialAverageRating = 0 }: { bookId: string; initialReviews?: Review[]; initialAverageRating?: number }) {
  const { token, customer, isAuthenticated } = useCustomerAuthStore();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setReviews(initialReviews);
    setAverageRating(initialAverageRating);
  }, [initialReviews, initialAverageRating]);

  const refreshReviews = async () => {
    const res = await fetch(`/api/reviews?bookId=${bookId}`, { cache: 'no-store' });
    if (!res.ok) {
      return;
    }

    const data = await res.json();
    setReviews(data.data?.reviews || []);
    setAverageRating(data.data?.averageRating || 0);
  };

  const stars = useMemo(() => Array.from({ length: 5 }, (_, index) => index + 1), []);

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      toast.error('Photo upload is not configured');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploadingPhoto(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setPhotoUrl(response.data.secure_url);
      toast.success('Photo uploaded successfully');
    } catch (uploadError) {
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const submitReview = async () => {
    if (!isAuthenticated || !token || !customer) {
      setError('Please login to submit a review');
      toast.error('Please login to submit a review');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bookId, rating, title, photoUrl }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to submit review');
      }

      await refreshReviews();
      setTitle('');
      setPhotoUrl('');
      setRating(5);
      toast.success('Review submitted successfully');
    } catch (submissionError: any) {
      const message = submissionError?.message || 'Failed to submit review';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <p className="text-sm text-gray-600">Average rating: {averageRating.toFixed(1)} / 5 from {reviews.length} reviews</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              Please login to leave a review.
            </div>
          ) : null}
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <div className="grid gap-3 md:grid-cols-5">
            {stars.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                disabled={!isAuthenticated}
                className={`flex items-center justify-center rounded-lg border px-3 py-2 ${value <= rating ? 'border-vgt-primary bg-vgt-primary/10 text-vgt-primary' : 'border-gray-200'}`}
              >
                <Star className="mr-1 h-4 w-4" /> {value}
              </button>
            ))}
          </div>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Review title" disabled={!isAuthenticated} />
          <div className="space-y-2">
            <Input type="file" accept="image/*" onChange={uploadPhoto} disabled={!isAuthenticated || uploadingPhoto} />
            {photoUrl ? (
              <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
                <Image src={photoUrl} alt="Review photo" width={64} height={64} className="h-16 w-16 rounded object-cover" />
                <div className="text-sm text-gray-600">Photo attached</div>
              </div>
            ) : null}
          </div>
          <Button onClick={submitReview} disabled={loading || !isAuthenticated || !title.trim()}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id}>
            <CardContent className="pt-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-vgt-dark">{review.customerName}</p>
                <p className="text-sm text-gray-600">{review.rating}/5</p>
              </div>
              <p className="font-medium">{review.title}</p>
              {review.photoUrl ? (
                <Image src={review.photoUrl} alt={`${review.customerName} review photo`} width={360} height={240} className="rounded-lg object-cover" />
              ) : null}
              {review.verifiedPurchase ? <p className="text-xs text-green-600">Verified purchase</p> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}