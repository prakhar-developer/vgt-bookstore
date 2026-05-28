import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User, Building, Globe, FileText } from 'lucide-react';
import BookCard from '@/components/BookCard';
import AddToCartButton from '@/components/AddToCartButton';
import BookViewTracker from '@/components/BookViewTracker';
import BookReviews from '@/components/BookReviews';

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

async function getSimilarBooks(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/recommendations?bookId=${id}&limit=4`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

async function getReviews(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/reviews?bookId=${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return { reviews: [], averageRating: 0 };
    const data = await res.json();
    return data.data || { reviews: [], averageRating: 0 };
  } catch (error) {
    return { reviews: [], averageRating: 0 };
  }
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, similarBooks, reviews] = await Promise.all([
    getBook(params.id),
    getSimilarBooks(params.id),
    getReviews(params.id),
  ]);

  if (!book) {
    notFound();
  }

  const availableQuantity = Number(book.quantity ?? 0);
  const isLowStock = availableQuantity > 0 && availableQuantity < 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        <BookViewTracker bookId={book._id} title={book.title} category={book.category} />
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
            {availableQuantity > 0 ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
            {isLowStock && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200">
                Buy fast, only {availableQuantity} left
              </Badge>
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

          {availableQuantity > 0 ? (
            <div className="space-y-3">
              {isLowStock && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Buy fast, only {availableQuantity} left in stock.
                </div>
              )}
              <Link href={`/checkout?bookId=${book._id}`}>
                <Button size="lg" className="w-full">
                  Buy Now
                </Button>
              </Link>
              <AddToCartButton
                fullWidth
                book={{
                  _id: book._id,
                  title: book.title,
                  author: book.author,
                  price: book.price,
                  coverImage: book.coverImage,
                  category: book.category,
                  inStock: book.inStock,
                }}
              />
            </div>
          ) : (
            <Button size="lg" className="w-full" disabled>
              Out of Stock
            </Button>
          )}
        </div>
      </div>

      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-vgt-dark">Similar Books</h2>
            <p className="text-sm text-gray-600 mt-1">Picked using your current book, reading patterns, and catalog similarity.</p>
          </div>
        </div>

        {similarBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarBooks.map((similarBook: any) => (
              <BookCard key={similarBook._id} book={similarBook} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              More recommendations will appear once the catalog has more overlapping genres and authors.
            </CardContent>
          </Card>
        )}
      </section>

      <BookReviews bookId={book._id} initialReviews={reviews.reviews} initialAverageRating={reviews.averageRating} />
    </div>
  );
}
