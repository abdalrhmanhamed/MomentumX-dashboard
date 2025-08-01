import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { toast } from 'react-hot-toast'

// Magic link configuration
const MAGIC_LINK_CONFIG = {
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.momentumx.dashboard'
  },
  android: {
    packageName: 'com.momentumx.dashboard',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: process.env.NEXT_PUBLIC_DYNAMIC_LINK_DOMAIN
}

// Email templates
const EMAIL_TEMPLATES = {
  magicLink: {
    subject: 'Your MomentumX Dashboard Login Link',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00ffff; margin: 0;">MomentumX Dashboard</h1>
          <p style="color: #888; margin: 10px 0;">Your self-mastery journey awaits</p>
        </div>
        
        <div style="background: #2a2a2a; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #00ffff; margin: 0 0 20px 0;">Login Link</h2>
          <p style="margin: 0 0 20px 0; line-height: 1.6;">
            Click the button below to securely log into your MomentumX Dashboard. 
            This link will expire in 15 minutes for your security.
          </p>
          <a href="{{LINK}}" style="
            display: inline-block; 
            background: linear-gradient(45deg, #00ffff, #00ff41); 
            color: #000; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            font-size: 16px;
            margin: 20px 0;
          ">Login to Dashboard</a>
        </div>
        
        <div style="background: #2a2a2a; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #00ffff; margin: 0 0 15px 0;">Security Notice</h3>
          <ul style="margin: 0; padding-left: 20px; color: #ccc;">
            <li>This link expires in 15 minutes</li>
            <li>Only click if you requested this login</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
        </div>
        
        <div style="text-align: center; color: #888; font-size: 14px;">
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #00ffff;">{{LINK}}</p>
        </div>
      </div>
    `
  },
  passwordReset: {
    subject: 'Reset Your MomentumX Dashboard Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00ffff; margin: 0;">MomentumX Dashboard</h1>
          <p style="color: #888; margin: 10px 0;">Password Reset Request</p>
        </div>
        
        <div style="background: #2a2a2a; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #00ffff; margin: 0 0 20px 0;">Reset Password</h2>
          <p style="margin: 0 0 20px 0; line-height: 1.6;">
            You requested a password reset for your MomentumX Dashboard account. 
            Click the button below to set a new password.
          </p>
          <a href="{{LINK}}" style="
            display: inline-block; 
            background: linear-gradient(45deg, #00ffff, #00ff41); 
            color: #000; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            font-size: 16px;
            margin: 20px 0;
          ">Reset Password</a>
        </div>
        
        <div style="text-align: center; color: #888; font-size: 14px;">
          <p>If you didn't request this reset, please ignore this email.</p>
        </div>
      </div>
    `
  }
}

// Authentication methods
export const authMethods = {
  // Email/Password authentication
  async signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await this.updateUserLastLogin(result.user)
      return result
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  },

  // Google authentication
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      const result = await signInWithPopup(auth, provider)
      await this.createOrUpdateUser(result.user)
      return result
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  },

  // Sign up with email/password
  async signUpWithEmail(email: string, password: string, displayName?: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      
      await this.createOrUpdateUser(result.user)
      return result
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  },

  // Send magic link
  async sendMagicLink(email: string) {
    try {
      // Store email in localStorage for later use
      localStorage.setItem('emailForSignIn', email)
      
      await sendSignInLinkToEmail(auth, email, MAGIC_LINK_CONFIG)
      
      toast.success('Login link sent to your email!')
      return true
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  },

  // Handle magic link sign in
  async handleMagicLinkSignIn() {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        return false
      }

      const email = localStorage.getItem('emailForSignIn')
      if (!email) {
        throw new Error('Email not found. Please try the login link again.')
      }

      const result = await signInWithEmailLink(auth, email, window.location.href)
      localStorage.removeItem('emailForSignIn')
      
      await this.createOrUpdateUser(result.user)
      return result
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  },

  // Password reset
  async sendPasswordReset(email: string) {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${MAGIC_LINK_CONFIG.url}/app/auth/login`,
        handleCodeInApp: true
      })
      
      toast.success('Password reset email sent!')
      return true
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  },

  // Create or update user in Firestore
  async createOrUpdateUser(user: FirebaseUser) {
    try {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      
      const userData = {
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL,
        tier: 'starter', // Default tier
        createdAt: userDoc.exists() ? userDoc.data()?.createdAt : serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true
        }
      }
      
      await setDoc(userRef, userData, { merge: true })
    } catch (error) {
      console.error('Error creating/updating user:', error)
    }
  },

  // Update user's last login
  async updateUserLastLogin(user: FirebaseUser) {
    try {
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        lastLoginAt: serverTimestamp()
      }, { merge: true })
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  },

  // Handle authentication errors
  handleAuthError(error: any): Error {
    let message = 'Authentication failed. Please try again.'
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email address.'
        break
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.'
        break
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists.'
        break
      case 'auth/weak-password':
        message = 'Password is too weak. Please choose a stronger password.'
        break
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.'
        break
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.'
        break
      case 'auth/popup-closed-by-user':
        message = 'Sign-in was cancelled.'
        break
      case 'auth/popup-blocked':
        message = 'Pop-up was blocked. Please allow pop-ups and try again.'
        break
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection and try again.'
        break
      default:
        message = error.message || 'Authentication failed. Please try again.'
    }
    
    return new Error(message)
  },

  // Check if current URL is a magic link
  isMagicLink(): boolean {
    return isSignInWithEmailLink(auth, window.location.href)
  },

  // Get stored email for magic link
  getStoredEmail(): string | null {
    return localStorage.getItem('emailForSignIn')
  },

  // Clear stored email
  clearStoredEmail(): void {
    localStorage.removeItem('emailForSignIn')
  }
}

export default authMethods 