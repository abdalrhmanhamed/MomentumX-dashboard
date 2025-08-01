export interface LicenseValidation {
  valid: boolean
  tier: "starter" | "coach" | "business"
  message: string
  features: readonly string[]
  expiresAt?: Date
  productId?: string
  licenseId?: string
}

export interface GumroadLicenseResponse {
  success: boolean
  license?: {
    id: string
    product_id: string
    product_permalink: string
    product_name: string
    license_key: string
    created_at: string
    custom_fields?: {
      tier?: string
      [key: string]: any
    }
    metadata?: {
      tier?: string
      [key: string]: any
    }
  }
  message?: string
}
