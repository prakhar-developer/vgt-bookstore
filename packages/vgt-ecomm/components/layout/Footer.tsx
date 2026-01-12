import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-vgt-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">VGT Bookstore</h3>
            <p className="text-gray-300 text-sm">
              Your trusted source for quality books. Discover, explore, and order books from our vast collection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-vgt-highlight transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-gray-300 hover:text-vgt-highlight transition">
                  Browse Books
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-vgt-highlight transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-vgt-highlight transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-vgt-highlight" />
                <span className="text-gray-300">support@vgtbookstore.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-vgt-highlight" />
                <span className="text-gray-300">+91 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-vgt-highlight" />
                <span className="text-gray-300">New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} VGT Bookstore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
