# 🚀 MomentumX Dashboard - Deployment Guide

## Quick Start (5 Minutes)

### 1. Extract and Install
```bash
# Extract the ZIP file
unzip momentumx-dashboard.zip
cd momentumx-dashboard

# Install dependencies
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your credentials
```

### 3. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

## 🔥 Firebase Setup (Required)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `momentumx-dashboard`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Enable "Google" (optional)
6. Save changes

### Step 3: Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Step 4: Get Firebase Config
1. In Firebase Console, go to "Project settings"
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with name: `momentumx-dashboard`
5. Copy the config object

### Step 5: Update Environment Variables
Edit `.env.local` and add your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🛒 Gumroad Setup (Optional)

### Step 1: Create Gumroad Product
1. Go to [Gumroad](https://gumroad.com/)
2. Create a new product
3. Set price and details
4. Note your product ID

### Step 2: Get API Key
1. In Gumroad, go to "Settings" → "API"
2. Generate a new API key
3. Copy the key

### Step 3: Update Environment Variables
Add to `.env.local`:
```env
GUMROAD_API_KEY=your_gumroad_api_key
GUMROAD_PRODUCT_ID=your_product_id
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Automatic Deployment
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables in Vercel dashboard
6. Click "Deploy"

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
```

### Option 2: Netlify

#### Automatic Deployment
1. Push code to GitHub
2. Go to [Netlify](https://netlify.com/)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Add environment variables
6. Click "Deploy site"

#### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload the 'out' folder to Netlify
```

### Option 3: AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings
5. Add environment variables
6. Deploy

### Option 4: DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy

## 🔧 Custom Domain Setup

### Vercel
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## 🔒 Security Configuration

### Firestore Security Rules
Update your Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /habits/{habitId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /journal/{entryId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /reviews/{reviewId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /licenses/{licenseId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Environment Variables Security
- Never commit `.env.local` to version control
- Use environment variables in production
- Rotate API keys regularly
- Monitor for unauthorized access

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
# Check the output for optimization opportunities
```

### Image Optimization
- Use Next.js Image component
- Optimize images before upload
- Use appropriate formats (WebP, AVIF)

### Caching Strategy
- Enable CDN caching
- Use service workers for offline support
- Implement proper cache headers

## 🔍 Monitoring & Analytics

### Firebase Analytics
1. Enable Google Analytics in Firebase
2. Track user engagement
3. Monitor performance metrics

### Error Tracking
- Set up error monitoring (Sentry, LogRocket)
- Monitor application performance
- Track user feedback

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

#### Environment Variables
- Ensure all variables are set correctly
- Check for typos in variable names
- Verify Firebase configuration

#### Deployment Issues
- Check build logs for errors
- Verify environment variables are set
- Ensure Firebase project is configured correctly

### Support
- Check the README.md for detailed instructions
- Review the SALES_PACKAGE.md for business setup
- Contact support if issues persist

## 🎯 Production Checklist

- [ ] Firebase project created and configured
- [ ] Environment variables set correctly
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled
- [ ] Error monitoring set up
- [ ] Analytics configured
- [ ] Performance optimized
- [ ] Security rules implemented
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

## 🚀 Go Live!

Once everything is configured:

1. **Test thoroughly** on staging environment
2. **Deploy to production**
3. **Monitor performance** and errors
4. **Gather user feedback**
5. **Iterate and improve**

---

**Your MomentumX Dashboard is now ready to help people transform their lives! 🎉** 