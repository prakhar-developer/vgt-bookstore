'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/api/admin/customers');
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-vgt-dark mb-8">Customers</h1>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-center py-6">Loading customers...</p>
          ) : customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Orders</th>
                    <th className="py-3 pr-4">Spent</th>
                    <th className="py-3 pr-4">Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id} className="border-b last:border-b-0">
                      <td className="py-4 pr-4 font-medium text-vgt-dark">{customer.name}</td>
                      <td className="py-4 pr-4 text-gray-600">{customer.email}</td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.status === 'registered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-gray-600">{customer.orderCount || 0}</td>
                      <td className="py-4 pr-4 text-gray-600">₹{customer.totalSpent || 0}</td>
                      <td className="py-4 pr-4 text-gray-600">
                        {customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No customers found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}