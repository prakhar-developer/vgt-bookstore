'use client';

import Link from 'next/link';
import { Search, ShoppingBag, UserCircle2, LogOut, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'sonner';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useCustomerAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-vgt-primary" />
            <span className="text-xl font-bold text-vgt-dark">VGT Bookstore</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vgt-primary"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/books">
              <Button variant="ghost">Books</Button>
            </Link>
            <Link href="/cart" className="relative">
              <Button variant="ghost">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Button>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-vgt-primary px-1 text-xs text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <UserCircle2 className="h-4 w-4" />
                  <span>{customer?.name}</span>
                </div>
                <Link href="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vgt-primary"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {isAuthenticated ? (
          <div className="md:hidden flex items-center justify-between pb-4">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <UserCircle2 className="h-4 w-4" />
              {customer?.name}
            </p>
            <div className="flex items-center gap-2">
              <Link href="/profile" className="text-sm text-vgt-primary">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-600 flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="md:hidden flex items-center gap-2 pb-4">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">Login</Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
