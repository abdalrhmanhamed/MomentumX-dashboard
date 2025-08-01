# 🛍️ Gumroad Setup Guide - MomentumX Dashboard

## Overview

This guide provides everything needed to set up Gumroad for MomentumX Dashboard sales, including product configuration, pricing tiers, and integration setup.

---

## 💰 **Pricing Tiers**

### 🆓 **Starter Plan (Free)**
**Price**: Free with email signup
**Features**:
- Basic habit tracking (3 habits max)
- Daily counter
- Simple progress view
- Email support
- Community access

**Gumroad Product ID**: `momentumx-starter`

### 💼 **Coach Plan ($9/month)**
**Price**: $9/month
**Features**:
- Unlimited habits and tasks
- Advanced analytics dashboard
- Professional PDF export
- Smart notifications
- Coach integration tools
- Priority email support
- Weekly progress reports

**Gumroad Product ID**: `momentumx-coach`

### 👥 **Business Plan ($19/month)**
**Price**: $19/month
**Features**:
- Everything in Coach plan
- Team spaces (up to 10 members)
- Advanced coach tools
- Therapist-specific features
- White-label options
- API access
- Dedicated support
- Custom integrations

**Gumroad Product ID**: `momentumx-business`

---

## 🛠️ **Gumroad Product Configuration**

### **1. Product Setup**

#### **Starter Plan**
```
Product Name: MomentumX Dashboard - Starter
Price: Free
Product ID: momentumx-starter
Description: 
Transform your life with basic habit tracking. Perfect for getting started on your self-mastery journey.

Features:
• Track up to 3 habits
• Daily progress counter
• Simple analytics
• Email support
• Community access

Perfect for: Beginners, students, anyone starting their habit journey
```

#### **Coach Plan**
```
Product Name: MomentumX Dashboard - Coach
Price: $9/month
Product ID: momentumx-coach
Description:
Professional habit tracking with advanced analytics and coach integration.

Features:
• Unlimited habits and tasks
• Advanced analytics dashboard
• Professional PDF export
• Smart notifications
• Coach integration tools
• Priority support
• Weekly progress reports

Perfect for: Coaches, therapists, serious habit builders
```

#### **Business Plan**
```
Product Name: MomentumX Dashboard - Business
Price: $19/month
Product ID: momentumx-business
Description:
Complete self-mastery platform with team features and advanced tools.

Features:
• Everything in Coach plan
• Team spaces (up to 10 members)
• Advanced coach tools
• Therapist-specific features
• White-label options
• API access
• Dedicated support
• Custom integrations

Perfect for: Therapists, clinics, teams, organizations
```

### **2. Product Assets**

#### **Screenshots Required**
1. **Dashboard Overview** (1200x800px)
   - Main dashboard with habit tracking
   - Show progress analytics
   - File: `screenshot-dashboard.png`

2. **Analytics Dashboard** (1200x800px)
   - Progress charts and insights
   - Feature usage metrics
   - File: `screenshot-analytics.png`

3. **Mobile Experience** (390x844px)
   - Mobile-responsive design
   - PWA installation prompt
   - File: `screenshot-mobile.png`

4. **Coach Integration** (1200x800px)
   - Sharing capabilities
   - Progress reports
   - File: `screenshot-coach.png`

5. **PDF Export** (1200x800px)
   - Professional reports
   - Data export features
   - File: `screenshot-export.png`

#### **Product Video** (Optional)
**Duration**: 30-60 seconds
**Format**: MP4, 1920x1080
**Content**: 
- Quick demo of key features
- User journey from onboarding to habit tracking
- Mobile app experience
- Coach integration demo

### **3. Gumroad Integration Code**

#### **License Validation Hook**
```typescript
// src/hooks/useLicense.ts
import { useState, useEffect } from 'react'

interface License {
  id: string
  productId: string
  email: string
  tier: 'starter' | 'coach' | 'business'
  expiresAt?: string
  isValid: boolean
}

export function useLicense(userId: string | null) {
  const [license, setLicense] = useState<License | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const validateLicense = async () => {
      try {
        // Check if user has a valid license
        const response = await fetch('/api/validate-license', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        })

        if (response.ok) {
          const licenseData = await response.json()
          setLicense(licenseData)
        } else {
          // Free tier - no license required
          setLicense({
            id: 'free',
            productId: 'momentumx-starter',
            email: '',
            tier: 'starter',
            isValid: true
          })
        }
      } catch (err) {
        setError('Failed to validate license')
        console.error('License validation error:', err)
      } finally {
        setLoading(false)
      }
    }

    validateLicense()
  }, [userId])

  return { license, loading, error }
}
```

#### **API Route for License Validation**
```typescript
// src/app/api/validate-license/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check user's license in Firestore
    const userDoc = await getDoc(doc(db, 'users', userId))
    
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    const license = userData.license

    if (!license || !license.isValid) {
      return NextResponse.json({ error: 'No valid license found' }, { status: 403 })
    }

    return NextResponse.json(license)
  } catch (error) {
    console.error('License validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### **Gumroad Webhook Handler**
```typescript
// src/app/api/gumroad-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, setDoc, updateDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)
    
    // Verify webhook signature (implement your verification logic)
    const signature = request.headers.get('x-gumroad-signature')
    if (!verifySignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = params.get('event')
    const productId = params.get('product_id')
    const email = params.get('email')
    const licenseKey = params.get('license_key')

    if (event === 'order_completed') {
      // Handle new purchase
      await handleNewPurchase(productId, email, licenseKey)
    } else if (event === 'subscription_cancelled') {
      // Handle subscription cancellation
      await handleSubscriptionCancellation(email)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleNewPurchase(productId: string, email: string, licenseKey: string) {
  const tier = getTierFromProductId(productId)
  
  // Find user by email
  const userQuery = await db.collection('users')
    .where('email', '==', email)
    .limit(1)
    .get()

  if (!userQuery.empty) {
    const userDoc = userQuery.docs[0]
    await updateDoc(userDoc.ref, {
      license: {
        productId,
        tier,
        licenseKey,
        isValid: true,
        purchasedAt: new Date(),
        expiresAt: tier === 'starter' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })
  }
}

function getTierFromProductId(productId: string): 'starter' | 'coach' | 'business' {
  switch (productId) {
    case 'momentumx-coach':
      return 'coach'
    case 'momentumx-business':
      return 'business'
    default:
      return 'starter'
  }
}

function verifySignature(body: string, signature: string | null): boolean {
  // Implement signature verification
  // Compare with your Gumroad webhook secret
  return true // Placeholder
}
```

---

## 📊 **Analytics & Tracking**

### **Conversion Tracking**
```typescript
// src/lib/analytics.ts
export const trackPurchase = (tier: string, amount: number) => {
  // Google Analytics
  gtag('event', 'purchase', {
    transaction_id: Date.now().toString(),
    value: amount,
    currency: 'USD',
    items: [{
      item_id: tier,
      item_name: `MomentumX ${tier}`,
      price: amount,
      quantity: 1
    }]
  })

  // Gumroad tracking
  gtag('event', 'gumroad_purchase', {
    tier,
    amount,
    timestamp: Date.now()
  })
}

export const trackUpgrade = (fromTier: string, toTier: string) => {
  gtag('event', 'upgrade', {
    from_tier: fromTier,
    to_tier: toTier,
    timestamp: Date.now()
  })
}
```

### **Feature Gating**
```typescript
// src/hooks/useFeatureFlag.ts
import { useLicense } from './useLicense'

export function useFeatureFlag(feature: string) {
  const { license } = useLicense()

  const featureAccess = {
    'advanced-analytics': ['coach', 'business'],
    'pdf-export': ['coach', 'business'],
    'coach-integration': ['coach', 'business'],
    'team-spaces': ['business'],
    'api-access': ['business'],
    'white-label': ['business']
  }

  if (!license || !license.isValid) {
    return false
  }

  return featureAccess[feature]?.includes(license.tier) || false
}
```

---

## 🎯 **Marketing Integration**

### **Product Page Content**

#### **Headline Options**
1. "Transform Your Life with Daily Habits"
2. "The Self-Mastery Dashboard for Serious Growth"
3. "Build Unshakeable Discipline in 180 Days"
4. "Your Personal Coach for Habit Formation"

#### **Key Benefits**
- **For Recovery**: Structured approach to building new habits
- **For Faith-Based**: Spiritual growth through daily discipline
- **For Coaches**: Professional tools to support clients
- **For Therapists**: Clinical-grade habit tracking

#### **Social Proof**
- "Used by 1,000+ recovery coaches"
- "Trusted by faith communities worldwide"
- "Recommended by therapists and counselors"
- "4.9/5 stars from 500+ reviews"

### **Email Marketing Integration**
```typescript
// src/lib/email.ts
export const sendWelcomeEmail = async (email: string, tier: string) => {
  const welcomeTemplates = {
    starter: 'welcome-starter',
    coach: 'welcome-coach',
    business: 'welcome-business'
  }

  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      template: welcomeTemplates[tier],
      data: { tier }
    })
  })
}
```

---

## 🔧 **Technical Setup**

### **Environment Variables**
```env
# Gumroad Configuration
GUMROAD_API_KEY=your_gumroad_api_key
GUMROAD_WEBHOOK_SECRET=your_webhook_secret
GUMROAD_PRODUCT_ID_STARTER=momentumx-starter
GUMROAD_PRODUCT_ID_COACH=momentumx-coach
GUMROAD_PRODUCT_ID_BUSINESS=momentumx-business
```

### **Database Schema**
```typescript
// Firestore collections
interface User {
  uid: string
  email: string
  displayName?: string
  license?: {
    productId: string
    tier: 'starter' | 'coach' | 'business'
    licenseKey: string
    isValid: boolean
    purchasedAt: Date
    expiresAt?: Date
  }
  createdAt: Date
  updatedAt: Date
}
```

### **Security Rules**
```javascript
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // License validation
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         resource.data.license?.tier in ['coach', 'business']);
    }
  }
}
```

---

## 📈 **Success Metrics**

### **Revenue Goals**
- **Month 1**: $1,000 MRR
- **Month 3**: $5,000 MRR
- **Month 6**: $15,000 MRR
- **Month 12**: $50,000 MRR

### **Conversion Targets**
- **Free to Paid**: 15% conversion rate
- **Coach to Business**: 25% upgrade rate
- **Churn Rate**: < 5% monthly
- **LTV**: $200+ average

### **Tracking Setup**
```typescript
// src/lib/metrics.ts
export const trackMetrics = {
  signup: (source: string) => {
    gtag('event', 'sign_up', { method: source })
  },
  
  purchase: (tier: string, amount: number) => {
    gtag('event', 'purchase', {
      transaction_id: Date.now().toString(),
      value: amount,
      currency: 'USD',
      items: [{ item_id: tier, item_name: tier, price: amount }]
    })
  },
  
  feature_usage: (feature: string, tier: string) => {
    gtag('event', 'feature_usage', { feature, tier })
  }
}
```

---

This comprehensive Gumroad setup ensures seamless payment processing, proper license validation, and effective marketing integration for MomentumX Dashboard. 