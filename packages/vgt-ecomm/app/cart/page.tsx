'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/store/cartStore';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const shippingFee = useMemo(() => (subtotal > 0 ? (subtotal >= 999 ? 0 : 49) : 0), [subtotal]);
  const total = subtotal + shippingFee;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-vgt-dark">Your Cart</h1>
          <p className="text-gray-600 mt-2">Review multiple books before checkout.</p>
        </div>
        <Link href="/books">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.bookId}>
                <CardContent className="p-4 flex gap-4">
                  <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded">
                    <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-vgt-dark">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.author}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <p className="font-bold text-vgt-primary">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.bookId, Number(e.target.value) || 1)}
                        className="w-24"
                      />
                      <Button variant="ghost" onClick={() => removeItem(item.bookId)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span className="text-vgt-primary">₹{total}</span>
              </div>
              <Link href="/checkout">
                <Button className="w-full mt-4">Proceed to Checkout</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-gray-600">Your cart is empty.</p>
            <Link href="/books">
              <Button>Browse Books</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}