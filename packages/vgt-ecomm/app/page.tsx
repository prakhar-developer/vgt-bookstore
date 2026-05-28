import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookCard from '@/components/BookCard';
import { BookOpen, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import RecommendationShelf from '@/components/RecommendationShelf';

async function getFeaturedBooks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/books?featured=true&limit=4`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const [featuredBooks, categories] = await Promise.all([
    getFeaturedBooks(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-vgt-primary to-vgt-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Discover Your Next Favorite Book
              </h1>
              <p className="text-lg mb-8 text-gray-100">
                Explore our vast collection of books across all genres. From timeless classics to contemporary bestsellers.
              </p>
              <Link href="/books">
                <Button size="lg" variant="outline" className="text-vgt-dark bg-white hover:bg-gray-100">
                  Browse Collection
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <BookOpen className="w-full h-64 text-vgt-highlight opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-vgt-dark mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category: any) => (
            <Link
              key={category._id}
              href={`/books?category=${category.slug}`}
              className="group"
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-vgt-surface rounded-full flex items-center justify-center group-hover:bg-vgt-primary transition-colors">
                    <BookOpen className="w-6 h-6 text-vgt-dark group-hover:text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-vgt-dark">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-vgt-dark">Featured Books</h2>
          <Link href="/books">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book: any) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
        {featuredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured books available at the moment.</p>
          </div>
        )}
      </section>

      <RecommendationShelf />

      {/* Trust Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-vgt-dark text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-vgt-surface rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-vgt-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-vgt-dark">Vast Collection</h3>
              <p className="text-sm text-gray-600">Thousands of books across all genres</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-vgt-surface rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-vgt-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-vgt-dark">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick and reliable shipping</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-vgt-surface rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-vgt-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-vgt-dark">Secure Payment</h3>
              <p className="text-sm text-gray-600">Safe and secure transactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-vgt-surface rounded-full flex items-center justify-center">
                <HeadphonesIcon className="w-8 h-8 text-vgt-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-vgt-dark">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
