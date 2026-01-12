'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/admin/orders');
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/api/admin/orders/${orderId}`, { status });
      toast.success('Order status updated');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'warning',
      verified: 'success',
      dispatched: 'default',
      delivered: 'success',
      cancelled: 'destructive',
    };
    return colors[status] || 'default';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-vgt-dark mb-8">Orders Management</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {order.book?.coverImage && (
                    <div className="relative h-20 w-16">
                      <Image src={order.book.coverImage} alt={order.book?.title || ''} fill className="object-cover rounded" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{order.orderId}</p>
                    <p className="text-sm text-gray-600">{order.customerName} - {order.customerEmail}</p>
                    <p className="text-sm text-gray-600">{order.book?.title || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-vgt-primary mb-2">₹{order.price}</p>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  <Button size="sm" variant="outline" className="mt-2 ml-2" onClick={() => setSelectedOrder(order)}>
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Order Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">{selectedOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-sm">{selectedOrder.customerEmail}</p>
                  <p className="text-sm">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-sm">{selectedOrder.customerAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Book</p>
                  <p className="font-semibold">{selectedOrder.book?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Screenshot</p>
                  <Image src={selectedOrder.paymentScreenshot} alt="Payment" width={300} height={400} className="rounded mt-2" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Update Status</p>
                  <div className="flex space-x-2">
                    {['pending', 'verified', 'dispatched', 'delivered', 'cancelled'].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedOrder.status === status ? 'default' : 'outline'}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
