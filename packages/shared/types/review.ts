export interface IReviewItem {
  _id: string;
  bookId: string;
  customerName: string;
  rating: number;
  title: string;
  photoUrl?: string;
  verifiedPurchase: boolean;
  approved: boolean;
  createdAt: string;
}