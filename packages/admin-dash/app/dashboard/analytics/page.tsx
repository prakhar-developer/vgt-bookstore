'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/admin/analytics');
        setData(res.data.data);
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-vgt-dark">Analytics</h1>
        <p className="text-gray-600 mt-2">Commerce, engagement, and customer segmentation signals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Revenue', `₹${data?.metrics?.revenue || 0}`],
          ['Orders', data?.metrics?.totalOrders || 0],
          ['Low Stock', data?.metrics?.lowStockBooks || 0],
          ['Events', data?.metrics?.totalEvents || 0],
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-3xl font-bold text-vgt-dark">{value as any}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(data?.segments || {}).map(([segment, value]) => (
              <div key={segment} className="flex items-center justify-between">
                <span className="capitalize text-gray-700">{segment}</span>
                <Badge>{String(value)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.topCategories || []).map((item: any) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-gray-700">{item.category}</span>
                <Badge variant="secondary">{item.quantity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Items</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.lowStockBooks?.length > 0 ? (
            <div className="space-y-2">
              {data.lowStockBooks.map((book: any) => (
                <div key={book._id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium text-vgt-dark">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <Badge variant={book.quantity === 0 ? 'destructive' : 'secondary'}>
                    {book.quantity ?? 0} left
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No low stock books right now.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}