import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User, Building, Globe, FileText } from 'lucide-react';

async function getBook(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/books/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);

  if (!book) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Book Cover */}
        <div>
          <Card className="overflow-hidden">
            <div className="relative h-[500px] bg-gray-100">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Card>
        </div>

        {/* Book Details */}
        <div>
          <Badge variant="secondary" className="mb-4">
            {book.category}
          </Badge>
          
          <h1 className="text-4xl font-bold text-vgt-dark mb-4">{book.title}</h1>
          
          <div className="flex items-center space-x-2 mb-6">
            <User className="h-5 w-5 text-gray-600" />
            <p className="text-lg text-gray-700">{book.author}</p>
          </div>

          <div className="flex items-center space-x-4 mb-8">
            <div className="text-3xl font-bold text-vgt-primary">₹{book.price}</div>
            {book.inStock ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <p className="text-gray-700 mb-8 leading-relaxed">{book.description}</p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-vgt-primary" />
              <span className="text-gray-700">
                <strong>Publisher:</strong> {book.publisher}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-vgt-primary" />
              <span className="text-gray-700">
                <strong>Language:</strong> {book.language}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-vgt-primary" />
              <span className="text-gray-700">
                <strong>Pages:</strong> {book.pages}
              </span>
            </div>
            {book.isbn && (
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-vgt-primary" />
                <span className="text-gray-700">
                  <strong>ISBN:</strong> {book.isbn}
                </span>
              </div>
            )}
          </div>

          {book.inStock ? (
            <Link href={`/checkout?bookId=${book._id}`}>
              <Button size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="w-full" disabled>
              Out of Stock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
