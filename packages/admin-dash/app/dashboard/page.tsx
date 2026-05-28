'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ShoppingCart, CheckCircle, Clock, Users } from 'lucide-react';

interface Stats {
  totalBooks: number;
  totalOrders: number;
  pendingOrders: number;
  verifiedOrders: number;
  totalCustomers: number;
  lowStockBooks: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalOrders: 0,
    pendingOrders: 0,
    verifiedOrders: 0,
    totalCustomers: 0,
    lowStockBooks: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [booksRes, ordersRes, customersRes] = await Promise.all([
        api.get('/api/admin/books'),
        api.get('/api/admin/orders'),
        api.get('/api/admin/customers'),
      ]);

      const books = booksRes.data.data;
      const orders = ordersRes.data.data;
      const customers = customersRes.data.data;

      setStats({
        totalBooks: books.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
        verifiedOrders: orders.filter((o: any) => o.status === 'verified').length,
        totalCustomers: customers.length,
        lowStockBooks: books.filter((book: any) => (book.quantity ?? 0) <= 5).length,
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentCustomers(customers.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      title: 'Verified Orders',
      value: stats.verifiedOrders,
      icon: CheckCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-teal-600',
      bg: 'bg-teal-100',
    },
    {
      title: 'Low Stock',
      value: stats.lowStockBooks,
      icon: BookOpen,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-vgt-dark mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-vgt-dark">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCustomers.length > 0 ? (
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-vgt-dark">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <p className="text-xs text-gray-500">{customer.status} • {customer.orderCount} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-vgt-primary">₹{customer.totalSpent || 0}</p>
                      <p className="text-xs text-gray-500">
                        {customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : 'No orders yet'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No customers yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-vgt-dark">{order.orderId}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-sm text-gray-600">{order.book?.title || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-vgt-primary">₹{order.price}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'delivered'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
