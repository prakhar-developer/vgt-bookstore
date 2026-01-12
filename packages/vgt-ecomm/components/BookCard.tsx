import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    price: number;
    coverImage: string;
    category: string;
    inStock: boolean;
  };
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 bg-gray-100">
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!book.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2">
          {book.category}
        </Badge>
        <h3 className="font-semibold text-lg line-clamp-2 mb-1 text-vgt-dark">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        <p className="text-xl font-bold text-vgt-primary">₹{book.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/books/${book._id}`} className="w-full">
          <Button className="w-full" disabled={!book.inStock}>
            {book.inStock ? 'View Details' : 'Out of Stock'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
