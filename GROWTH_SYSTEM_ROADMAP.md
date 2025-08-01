# 💡 Growth System Roadmap - MomentumX Dashboard

## Overview

Comprehensive roadmap for next sprint features that will transform MomentumX Dashboard into a complete growth platform with AI capabilities, referral systems, and enterprise features.

---

## 🧠 **AI Journal Coach**

### **Core Features**
- **Intelligent Journal Analysis**: AI-powered insights from user journal entries
- **Personalized Prompts**: Context-aware journaling prompts based on user patterns
- **Emotion Tracking**: Sentiment analysis and mood correlation
- **Progress Insights**: AI-generated progress reports and recommendations
- **Recovery Support**: Specialized prompts for recovery journey

### **Technical Implementation**
```typescript
// src/lib/ai-journal-coach.ts
interface JournalAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  themes: string[]
  insights: string[]
  recommendations: string[]
  progressScore: number
}

export class AIJournalCoach {
  async analyzeEntry(content: string, userId: string): Promise<JournalAnalysis> {
    // OpenAI GPT-4 integration
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive AI coach analyzing journal entries for self-improvement and recovery.'
        },
        {
          role: 'user',
          content: `Analyze this journal entry: ${content}`
        }
      ]
    })

    return this.parseAnalysis(response.choices[0].message.content)
  }

  async generatePrompt(userId: string, context: string): Promise<string> {
    // Generate personalized prompts based on user history
    const userHistory = await this.getUserJournalHistory(userId)
    const prompt = await this.createContextualPrompt(userHistory, context)
    return prompt
  }

  async generateInsights(userId: string): Promise<string[]> {
    // Generate weekly/monthly insights from journal entries
    const entries = await this.getRecentEntries(userId)
    const analysis = await this.analyzeMultipleEntries(entries)
    return this.formatInsights(analysis)
  }
}
```

### **UI Components**
```typescript
// src/components/AIJournalCoach.tsx
export default function AIJournalCoach() {
  const [analysis, setAnalysis] = useState<JournalAnalysis | null>(null)
  const [prompt, setPrompt] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleJournalSubmit = async (content: string) => {
    setLoading(true)
    try {
      const analysis = await aiCoach.analyzeEntry(content, userId)
      setAnalysis(analysis)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          AI Journal Coach
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Today's Prompt
            </label>
            <div className="glass-input p-4 rounded-lg">
              {prompt || "How are you feeling about your progress today?"}
            </div>
          </div>

          <JournalEditor onSubmit={handleJournalSubmit} />
          
          {analysis && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-text-primary">AI Insights</h4>
              <div className="space-y-2">
                {analysis.insights.map((insight, index) => (
                  <div key={index} className="text-sm text-text-secondary">
                    • {insight}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## 🎯 **Referral Leaderboard**

### **Core Features**
- **Referral Tracking**: Track user referrals and conversions
- **Leaderboard System**: Gamified leaderboard with rewards
- **Reward Tiers**: Different rewards for different referral levels
- **Social Sharing**: Easy sharing of referral links
- **Analytics Dashboard**: Referral performance tracking

### **Technical Implementation**
```typescript
// src/lib/referral-system.ts
interface Referral {
  id: string
  referrerId: string
  referredId: string
  status: 'pending' | 'completed' | 'expired'
  rewardTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  createdAt: Date
  completedAt?: Date
}

interface ReferralReward {
  tier: string
  requirements: number
  rewards: {
    freeMonths: number
    features: string[]
    badges: string[]
  }
}

export class ReferralSystem {
  async createReferralLink(userId: string): Promise<string> {
    const referralCode = this.generateReferralCode()
    await this.saveReferralCode(userId, referralCode)
    return `${process.env.NEXT_PUBLIC_APP_URL}/ref/${referralCode}`
  }

  async trackReferral(referralCode: string, newUserId: string): Promise<void> {
    const referrerId = await this.getUserIdFromCode(referralCode)
    if (referrerId) {
      await this.createReferral(referrerId, newUserId)
      await this.checkRewardEligibility(referrerId)
    }
  }

  async getLeaderboard(): Promise<ReferralLeader[]> {
    const referrals = await this.getReferralStats()
    return referrals
      .sort((a, b) => b.totalReferrals - a.totalReferrals)
      .slice(0, 50)
  }

  async getRewards(userId: string): Promise<ReferralReward[]> {
    const userReferrals = await this.getUserReferrals(userId)
    return this.calculateRewards(userReferrals)
  }
}
```

### **UI Components**
```typescript
// src/components/ReferralLeaderboard.tsx
export default function ReferralLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<ReferralLeader[]>([])
  const [userRank, setUserRank] = useState<number>(0)
  const [userRewards, setUserRewards] = useState<ReferralReward[]>([])

  useEffect(() => {
    loadLeaderboard()
    loadUserRewards()
  }, [])

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          Referral Leaderboard
        </h3>
        
        <div className="space-y-4">
          {/* User's Current Rank */}
          <div className="bg-gradient-primary p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Your Rank</div>
            <div className="text-2xl font-bold">#{userRank}</div>
            <div className="text-sm opacity-90">
              {userRewards.length} rewards unlocked
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-2">
            {leaderboard.map((leader, index) => (
              <div key={leader.userId} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-500 text-black' :
                    'bg-background-tertiary text-text-secondary'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">
                      {leader.displayName}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {leader.totalReferrals} referrals
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-secondary">
                    {leader.rewardTier} tier
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 💳 **Stripe Integration**

### **Core Features**
- **Direct Checkout**: Seamless payment processing
- **Subscription Management**: Handle recurring payments
- **Multiple Plans**: Support for all pricing tiers
- **Proration**: Handle plan changes and upgrades
- **Webhook Handling**: Real-time payment event processing

### **Technical Implementation**
```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export class StripeService {
  async createCheckoutSession(userId: string, priceId: string): Promise<string> {
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/pricing?canceled=true`,
      metadata: {
        userId: userId
      }
    })

    return session.url!
  }

  async createCustomerPortalSession(customerId: string): Promise<string> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/dashboard`
    })

    return session.url
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }
  }
}
```

### **API Routes**
```typescript
// src/app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripeService } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { userId, priceId } = await request.json()
    
    const sessionUrl = await stripeService.createCheckoutSession(userId, priceId)
    
    return NextResponse.json({ url: sessionUrl })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}

// src/app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripeService } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  try {
    const event = Stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    await stripeService.handleWebhook(event)
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }
}
```

---

## 👥 **Team Spaces**

### **Core Features**
- **Team Management**: Create and manage teams
- **Role-Based Access**: Admin, coach, member roles
- **Shared Analytics**: Team-wide progress tracking
- **Communication Tools**: Built-in messaging and notifications
- **White-Label Options**: Custom branding for organizations

### **Technical Implementation**
```typescript
// src/lib/team-spaces.ts
interface Team {
  id: string
  name: string
  description: string
  ownerId: string
  members: TeamMember[]
  settings: TeamSettings
  createdAt: Date
}

interface TeamMember {
  userId: string
  role: 'admin' | 'coach' | 'member'
  joinedAt: Date
  permissions: string[]
}

interface TeamSettings {
  allowMemberInvites: boolean
  requireApproval: boolean
  customBranding: {
    logo?: string
    colors?: {
      primary: string
      secondary: string
    }
  }
}

export class TeamSpacesService {
  async createTeam(ownerId: string, teamData: Partial<Team>): Promise<Team> {
    const team: Team = {
      id: generateId(),
      ownerId,
      members: [{
        userId: ownerId,
        role: 'admin',
        joinedAt: new Date(),
        permissions: ['all']
      }],
      settings: {
        allowMemberInvites: true,
        requireApproval: false,
        customBranding: {}
      },
      createdAt: new Date(),
      ...teamData
    }

    await this.saveTeam(team)
    return team
  }

  async inviteMember(teamId: string, email: string, role: TeamMember['role']): Promise<void> {
    const invitation = {
      id: generateId(),
      teamId,
      email,
      role,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }

    await this.saveInvitation(invitation)
    await this.sendInvitationEmail(invitation)
  }

  async getTeamAnalytics(teamId: string): Promise<TeamAnalytics> {
    const members = await this.getTeamMembers(teamId)
    const analytics = await this.aggregateMemberAnalytics(members)
    return analytics
  }
}
```

### **UI Components**
```typescript
// src/components/TeamSpaces.tsx
export default function TeamSpaces() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">Team Spaces</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                {team.name}
              </h3>
              <div className="text-sm text-text-secondary">
                {team.members.length} members
              </div>
            </div>
            
            <p className="text-text-secondary mb-4">
              {team.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Owner:</span>
                <span className="text-text-primary">
                  {team.members.find(m => m.role === 'admin')?.userId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Created:</span>
                <span className="text-text-primary">
                  {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedTeam(team)}
              className="w-full mt-4 btn-secondary"
            >
              View Team
            </button>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <CreateTeamModal 
          onClose={() => setShowCreateModal(false)}
          onTeamCreated={(team) => {
            setTeams([...teams, team])
            setShowCreateModal(false)
          }}
        />
      )}

      {/* Team Details Modal */}
      {selectedTeam && (
        <TeamDetailsModal 
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  )
}
```

---

## 📊 **Implementation Timeline**

### **Sprint 1 (2 weeks)**
- [ ] **AI Journal Coach**: Basic analysis and prompts
- [ ] **Referral System**: Core tracking and leaderboard
- [ ] **Stripe Integration**: Basic checkout and subscriptions

### **Sprint 2 (2 weeks)**
- [ ] **Team Spaces**: Basic team management
- [ ] **Advanced AI**: Sentiment analysis and insights
- [ ] **Referral Rewards**: Reward system implementation

### **Sprint 3 (2 weeks)**
- [ ] **White-Label Options**: Custom branding
- [ ] **Advanced Analytics**: Team-wide insights
- [ ] **API Access**: Public API for integrations

### **Sprint 4 (2 weeks)**
- [ ] **Enterprise Features**: Advanced team management
- [ ] **AI Coaching**: Personalized coaching recommendations
- [ ] **Integration Hub**: Third-party integrations

---

## 🎯 **Success Metrics**

### **AI Journal Coach**
- **Adoption Rate**: 70% of users use AI features
- **Engagement**: 3+ journal entries per week
- **Satisfaction**: 4.5+ star rating for AI insights

### **Referral System**
- **Referral Rate**: 25% of users refer others
- **Conversion Rate**: 15% of referrals convert to paid
- **Viral Coefficient**: 0.3+ (each user brings 0.3 new users)

### **Stripe Integration**
- **Payment Success Rate**: 95%+ successful payments
- **Churn Rate**: < 5% monthly churn
- **Revenue Growth**: 50%+ month-over-month growth

### **Team Spaces**
- **Team Adoption**: 30% of business users create teams
- **Member Engagement**: 5+ active members per team
- **Enterprise Sales**: 20% of revenue from team plans

---

This comprehensive growth system roadmap will transform MomentumX Dashboard into a complete platform with AI capabilities, viral growth mechanisms, and enterprise features. 