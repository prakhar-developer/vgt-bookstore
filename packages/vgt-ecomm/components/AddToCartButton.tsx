'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cartStore';
import { useCustomerAuthStore } from '@/lib/store/authStore';

interface Props {
  book: {
    _id: string;
    title: string;
    author: string;
    price: number;
    coverImage: string;
    category: string;
    inStock: boolean;
    quantity?: number;
  };
  fullWidth?: boolean;
}

export default function AddToCartButton({ book, fullWidth }: Props) {
  const isAvailable = (book.quantity ?? 0) > 0 || book.inStock;
  const addItem = useCartStore((state) => state.addItem);
  const sessionId = useCartStore((state) => state.sessionId);
  const customer = useCustomerAuthStore((state) => state.customer);

  const handleAddToCart = async () => {
    addItem({
      bookId: book._id,
      title: book.title,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage,
      category: book.category,
      inStock: book.inStock,
    });

    toast.success(`${book.title} added to cart`);

    try {
      await axios.post('/api/events', {
        type: 'add_to_cart',
        bookId: book._id,
        customerId: customer?.id,
        sessionId,
        quantity: 1,
        metadata: { title: book.title, category: book.category },
      });
    } catch (error) {
      console.error('Failed to track add to cart', error);
    }
  };

  return (
    <Button type="button" variant="outline" className={fullWidth ? 'w-full' : ''} onClick={handleAddToCart} disabled={!isAvailable}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      Add to Cart
    </Button>
  );
}