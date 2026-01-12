'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import axios from 'axios';

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  coverImage: string;
  language: string;
  pages: number;
  publisher: string;
  isbn?: string;
  featured: boolean;
  inStock: boolean;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    coverImage: '',
    language: 'English',
    pages: '',
    publisher: '',
    isbn: '',
    featured: false,
    inStock: true,
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/api/admin/books');
      setBooks(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/admin/categories');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      setFormData((prev: any) => ({ ...prev, coverImage: res.data.secure_url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBook) {
        await api.put(`/api/admin/books/${editingBook._id}`, formData);
        toast.success('Book updated successfully');
      } else {
        await api.post('/api/admin/books', formData);
        toast.success('Book created successfully');
      }
      
      fetchBooks();
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save book');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await api.delete(`/api/admin/books/${id}`);
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      price: '',
      category: '',
      coverImage: '',
      language: 'English',
      pages: '',
      publisher: '',
      isbn: '',
      featured: false,
      inStock: true,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-vgt-dark">Books Management</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <Card key={book._id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2">{book.category}</Badge>
              <h3 className="font-semibold text-lg line-clamp-1 mb-1">{book.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">{book.author}</p>
              <p className="text-lg font-bold text-vgt-primary mb-3">₹{book.price}</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(book)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(book._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="author">Author *</Label>
                    <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-input text-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Language *</Label>
                    <Input id="language" name="language" value={formData.language} onChange={handleChange} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="pages">Pages *</Label>
                    <Input id="pages" name="pages" type="number" value={formData.pages} onChange={handleChange} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="publisher">Publisher *</Label>
                    <Input id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} />
                  </div>
                  
                  <div className="col-span-2">
                    <Label>Cover Image *</Label>
                    {formData.coverImage ? (
                      <div>
                        <Image src={formData.coverImage} alt="Cover" width={150} height={200} className="rounded mb-2" />
                        <Button type="button" variant="outline" size="sm" onClick={() => setFormData((prev: any) => ({ ...prev, coverImage: '' }))}>
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <Label htmlFor="imageUpload" className="cursor-pointer text-vgt-primary">
                          {uploading ? 'Uploading...' : 'Click to upload'}
                        </Label>
                        <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="inStock" name="inStock" checked={formData.inStock} onChange={handleChange} />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" disabled={uploading}>Save</Button>
                  <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
