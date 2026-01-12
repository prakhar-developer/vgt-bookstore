# 🚀 Deployment Guide - VGT Bookstore

This guide will walk you through deploying the VGT Bookstore platform to Vercel with MongoDB Atlas.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)
- Resend account (free tier works)

## 🗄️ Step 1: Setup MongoDB Atlas

1. **Create a MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set role to "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://user:password@cluster.mongodb.net/vgt-bookstore?retryWrites=true&w=majority`

## ☁️ Step 2: Setup Cloudinary

1. **Create Cloudinary Account**
   - Go to [https://cloudinary.com/](https://cloudinary.com/)
   - Sign up for free account

2. **Get Credentials**
   - Go to Dashboard
   - Note down:
     - Cloud Name
     - API Key
     - API Secret

3. **Create Upload Preset**
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set Signing Mode to "Unsigned"
   - Set folder name (e.g., "vgt-bookstore")
   - Save the preset name

## 📧 Step 3: Setup Resend

1. **Create Resend Account**
   - Go to [https://resend.com/](https://resend.com/)
   - Sign up for free account

2. **Create API Key**
   - Go to API Keys
   - Click "Create API Key"
   - Give it a name (e.g., "VGT Bookstore")
   - Copy the API key (you won't see it again!)

3. **Add Domain (Optional)**
   - For production, add your domain
   - For testing, the default domain works

## 🔧 Step 4: Setup Vercel for E-commerce Site

1. **Push Code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [https://vercel.com/](https://vercel.com/)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select "vgt-bookstore"

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `packages/vgt-ecomm`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/vgt-bookstore
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   RESEND_API_KEY=re_your_api_key
   NEXT_PUBLIC_BASE_URL=https://your-ecomm-site.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your e-commerce site is live! 🎉

## 🔧 Step 5: Setup Vercel for Admin Dashboard

1. **Add New Project**
   - From Vercel dashboard, click "Add New Project"
   - Import the same GitHub repository
   - Select "vgt-bookstore"

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `packages/admin-dash`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/vgt-bookstore
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   JWT_SECRET=your_very_secure_random_string_here
   ADMIN_EMAIL=admin.vgt@gmail.com
   ADMIN_PASSWORD=Admin@12345
   NEXT_PUBLIC_BASE_URL=https://your-admin-dash.vercel.app
   ```

   **Important**: Generate a strong JWT_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your admin dashboard is live! 🎉

## 🌱 Step 6: Seed the Database

After deployment, you need to seed the database with initial data:

**Option 1: Local Seeding (Recommended)**
```bash
# Update shared package .env or use environment variables
MONGODB_URI=your_atlas_connection_string npm run seed
```

**Option 2: Create Initial Admin via MongoDB Atlas**
1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. Select your database
4. Create "admins" collection manually with:
   ```json
   {
     "email": "admin.vgt@gmail.com",
     "password": "$2a$10$...", // Use bcrypt to hash "Admin@12345"
     "name": "VGT Admin",
     "role": "super_admin"
   }
   ```

## 🔍 Step 7: Verify Deployment

1. **Test E-commerce Site**
   - Visit your Vercel URL
   - Browse books
   - Test checkout flow
   - Verify email notifications

2. **Test Admin Dashboard**
   - Visit admin Vercel URL
   - Login with credentials
   - Add a test book
   - Verify image upload
   - Check orders management

## 🎯 Optional: Custom Domain

1. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Click "Add"
   - Enter your domain
   - Update DNS records as instructed

2. **Update Environment Variables**
   - Update `NEXT_PUBLIC_BASE_URL` for both projects
   - Redeploy

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 🐛 Troubleshooting

### Build Fails

**Issue**: "Module not found" errors
- **Solution**: Ensure all dependencies are in package.json
- Run `npm install` locally first

**Issue**: TypeScript errors
- **Solution**: Fix TypeScript errors locally
- Run `npm run build` to test

### Database Connection Fails

**Issue**: "Failed to connect to MongoDB"
- **Solution**: 
  - Check MongoDB URI is correct
  - Verify network access allows 0.0.0.0/0
  - Ensure database user has correct permissions

### Image Upload Fails

**Issue**: Cloudinary upload not working
- **Solution**:
  - Verify Cloud Name and Upload Preset
  - Check upload preset is "unsigned"
  - Ensure CORS is configured properly

### Email Not Sending

**Issue**: Resend emails not being sent
- **Solution**:
  - Verify Resend API key is correct
  - Check sender email domain
  - Review Resend logs in dashboard

### JWT Errors

**Issue**: "Invalid token" or authentication issues
- **Solution**:
  - Verify JWT_SECRET is set in environment
  - Ensure token is being sent in headers
  - Check token hasn't expired (7 days)

## 📊 Performance Optimization

1. **Enable Vercel Analytics**
   - Go to Project Settings → Analytics
   - Enable Web Analytics

2. **Add Database Indexes**
   - MongoDB Atlas → Browse Collections
   - Add indexes on frequently queried fields

3. **Enable Caching**
   - Next.js automatically caches static pages
   - Use ISR for dynamic content

## 🔒 Security Checklist

- [ ] Changed default admin password
- [ ] Generated strong JWT_SECRET
- [ ] Enabled HTTPS only
- [ ] Set up MongoDB network access properly
- [ ] Configured CORS if needed
- [ ] Review and limit API rate limits
- [ ] Enable Vercel security headers

## 📈 Monitoring

1. **Vercel Logs**
   - Project → Deployments → View logs
   - Check for runtime errors

2. **MongoDB Monitoring**
   - Atlas Dashboard → Metrics
   - Monitor connections and queries

3. **Error Tracking**
   - Consider adding Sentry or similar
   - Track client-side errors

## 🎉 Success!

Your VGT Bookstore is now deployed and running in production!

**E-commerce Site**: https://your-ecomm-site.vercel.app
**Admin Dashboard**: https://your-admin-dash.vercel.app

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Resend Docs](https://resend.com/docs)

---

**Need Help?** Open an issue on GitHub or contact the VGT Bookstore team.
