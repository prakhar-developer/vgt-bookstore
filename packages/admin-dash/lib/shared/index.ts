// Re-export shared modules for Next.js
export { default as connectDB } from '../../../shared/lib/mongodb';
export { default as Book } from '../../../shared/models/Book';
export { default as Category } from '../../../shared/models/Category';
export { default as Order } from '../../../shared/models/Order';
export { default as Admin } from '../../../shared/models/Admin';
export * from '../../../shared/lib/auth';
