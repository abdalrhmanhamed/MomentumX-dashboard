# 🚀 MomentumX Dashboard

**Transform your life with daily habits, unwavering discipline, and spiritual growth.**

A premium self-mastery platform that combines habit tracking, goal setting, and spiritual growth into one powerful tool designed for recovery communities, faith-based users, and anyone committed to deep personal transformation.

## ✨ Features

### 🎯 **Core Functionality**
- **Intelligent Onboarding**: 7-step guided setup with habit presets
- **Advanced Analytics**: GitHub-style heatmaps and progress visualization
- **Professional PDF Export**: Coach-ready reports and data portability
- **Smart Notifications**: Context-aware reminders with personalized motivation
- **Coach Integration**: Secure sharing and communication tools
- **PWA Support**: Native app experience on mobile and desktop
- **Data Ownership**: Complete control over your personal data

### 🏗️ **Technical Stack**
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Security Rules)
- **Payments**: Gumroad integration
- **Deployment**: Vercel
- **PWA**: Progressive Web App with offline support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Gumroad account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/momentumx-dashboard.git
cd momentumx-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gumroad Integration
GUMROAD_API_KEY=your_gumroad_key
GUMROAD_PRODUCT_ID=your_product_id

# App Configuration
NEXT_PUBLIC_APP_NAME=MomentumX Dashboard
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

4. **Run development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
momentumx-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── app/               # Main app pages
│   │   ├── auth/              # Authentication pages
│   │   ├── landing/           # Marketing pages
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   └── ...               # Feature components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript definitions
├── public/                   # Static assets
├── docs/                     # Documentation
└── scripts/                  # Build and deployment scripts
```

## 💰 Pricing Tiers

### 🆓 **Starter (Free)**
- Basic habit tracking
- Daily counter
- Simple analytics
- Email support

### 💼 **Coach ($9/month)**
- Advanced analytics dashboard
- Professional PDF export
- Smart notifications
- Coach integration
- Priority support

### 👥 **Business ($19/month)**
- Everything in Coach plan
- Team spaces
- Advanced coach tools
- Therapist-specific features
- White-label options

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Deployment
npm run deploy       # Deploy to Vercel
```

### Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

### Testing Strategy

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and database testing
- **E2E Tests**: User journey testing
- **Performance Tests**: Lighthouse and Core Web Vitals

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
```bash
npm i -g vercel
vercel login
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set Environment Variables**
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... add all other environment variables
```

### Custom Domain Setup

1. **Add domain in Vercel dashboard**
2. **Update DNS records**
3. **Configure SSL certificate**
4. **Update environment variables**

## 🔒 Security

### Firebase Security Rules
```javascript
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /habits/{habitId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Similar rules for tasks, journal entries, etc.
  }
}
```

### Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Authentication**: Firebase Auth with multiple providers
- **Authorization**: User-based access control
- **GDPR Compliance**: Data export and deletion capabilities

## 📊 Analytics & Monitoring

### User Analytics
- **Google Analytics**: Page views and user behavior
- **Custom Events**: Feature usage tracking
- **Conversion Funnels**: User journey analysis
- **A/B Testing**: Feature optimization

### Performance Monitoring
- **Vercel Analytics**: Real-time performance data
- **Lighthouse**: Core Web Vitals tracking
- **Error Tracking**: Sentry integration
- **Uptime Monitoring**: Status page and alerts

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
4. **Add tests for new functionality**
5. **Commit your changes**
```bash
git commit -m 'Add amazing feature'
```

6. **Push to the branch**
```bash
git push origin feature/amazing-feature
```

7. **Open a Pull Request**

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Conventional Commits**: Standard commit messages

## 📈 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Habit tracking
- [x] Task management
- [x] Basic analytics
- [x] PDF export

### Phase 2: Advanced Features 🚧
- [ ] AI Journal Coach
- [ ] Referral system
- [ ] Team spaces
- [ ] Advanced analytics

### Phase 3: Enterprise Features 📋
- [ ] White-label options
- [ ] API access
- [ ] Custom integrations
- [ ] Advanced reporting

## 📞 Support

### Getting Help

- **Documentation**: [docs.momentumx.app](https://docs.momentumx.app)
- **Email**: support@momentumx.app
- **Discord**: [Join our community](https://discord.gg/momentumx)
- **GitHub Issues**: [Report bugs](https://github.com/yourusername/momentumx-dashboard/issues)

### Feature Requests

We welcome feature requests! Please:

1. Check existing issues first
2. Create a detailed issue with use case
3. Include mockups if possible
4. Vote on existing requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Firebase Team**: For the robust backend
- **Tailwind CSS**: For the utility-first styling
- **Our Beta Users**: For valuable feedback and testing

---

**Built with ❤️ for the recovery and faith communities**

*Transform your life, one habit at a time.* 