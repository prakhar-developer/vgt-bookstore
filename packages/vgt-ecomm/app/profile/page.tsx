'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCustomerAuthStore } from '@/lib/store/authStore';

export default function ProfilePage() {
  const { token, customer, isAuthenticated } = useCustomerAuthStore();
  const [profile, setProfile] = useState<any>(customer);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [profileRes, ordersRes] = await Promise.all([
          axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/orders/history', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfile(profileRes.data.data);
        setOrders(ordersRes.data.data || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-lg font-semibold text-vgt-dark">Please sign in to view your profile.</p>
            <div className="flex justify-center gap-3">
              <Link href="/login"><Button>Login</Button></Link>
              <Link href="/register"><Button variant="outline">Register</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-vgt-dark">My Profile</h1>
        <p className="text-gray-600 mt-2">Your saved details, orders, and reading activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Saved Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-vgt-dark">{profile?.name || customer?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-vgt-dark">{profile?.email || customer?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-vgt-dark">{profile?.phone || 'Not saved yet'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-vgt-dark">{profile?.address || 'Not saved yet'}</p>
            </div>
            <div className="flex gap-2 flex-wrap pt-2">
              <Badge variant="secondary">{profile?.status || customer?.status || 'guest'}</Badge>
              <Badge variant="secondary">{profile?.orderCount || 0} orders</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between gap-4 p-4 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-semibold text-vgt-dark">{order.book?.title || order.orderId}</p>
                      <p className="text-sm text-gray-600">{order.book?.author || 'Unknown author'}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-vgt-primary">₹{order.price}</p>
                      <Badge variant={order.status === 'delivered' ? 'success' : 'secondary'}>{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No orders yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}