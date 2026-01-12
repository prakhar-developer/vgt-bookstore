'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { QrCode, Upload } from 'lucide-react';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get('bookId');

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    paymentScreenshot: '',
  });

  useEffect(() => {
    if (!bookId) {
      router.push('/books');
      return;
    }
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`/api/books/${bookId}`);
      setBook(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch book details');
      router.push('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      setFormData((prev) => ({ ...prev, paymentScreenshot: res.data.secure_url }));
      toast.success('Payment screenshot uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.paymentScreenshot) {
      toast.error('Please upload payment screenshot');
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post('/api/orders', {
        ...formData,
        bookId,
      });

      toast.success('Order placed successfully!');
      router.push(`/order-success?orderId=${res.data.data.orderId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-vgt-dark mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div className="relative h-32 w-24 flex-shrink-0">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                  <p className="text-xl font-bold text-vgt-primary">₹{book.price}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{book.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                  <span>Total:</span>
                  <span className="text-vgt-primary">₹{book.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment QR Code */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <span>Payment Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-6 rounded-lg text-center mb-4">
                <QrCode className="h-32 w-32 mx-auto text-vgt-primary mb-2" />
                <p className="text-sm text-gray-600">Scan QR code to pay</p>
                <p className="font-semibold text-vgt-dark mt-2">UPI ID: vgtbookstore@upi</p>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>1. Scan the QR code or use UPI ID</p>
                <p>2. Pay ₹{book.price}</p>
                <p>3. Take a screenshot of payment confirmation</p>
                <p>4. Upload the screenshot below</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    placeholder="+91 1234567890"
                  />
                </div>

                <div>
                  <Label htmlFor="customerAddress">Delivery Address *</Label>
                  <Textarea
                    id="customerAddress"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    required
                    placeholder="Enter your complete delivery address"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="paymentScreenshot">Payment Screenshot *</Label>
                  <div className="mt-2">
                    {formData.paymentScreenshot ? (
                      <div className="relative">
                        <Image
                          src={formData.paymentScreenshot}
                          alt="Payment screenshot"
                          width={200}
                          height={200}
                          className="rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => setFormData((prev) => ({ ...prev, paymentScreenshot: '' }))}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <Label
                          htmlFor="imageUpload"
                          className="cursor-pointer text-vgt-primary hover:text-vgt-dark"
                        >
                          {uploadingImage ? 'Uploading...' : 'Click to upload payment screenshot'}
                        </Label>
                        <Input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitting || uploadingImage}
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
