/**
 * Two-Factor Authentication (2FA) Implementation
 * 
 * This file contains TOTP (Time-based One-Time Password) implementation
 * for the Creo platform using speakeasy library.
 */

import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/client'

// 2FA configuration
const TOTP_CONFIG = {
  issuer: 'Creo',
  algorithm: 'sha1',
  digits: 6,
  period: 30, // 30 seconds
  window: 1, // Allow 1 window of tolerance
}

// Generate 2FA secret for a user
export function generate2FASecret(userEmail: string): {
  secret: string
  qrCodeUrl: string
  manualEntryKey: string
} {
  const secret = speakeasy.generateSecret({
    name: userEmail,
    issuer: TOTP_CONFIG.issuer,
    length: 32,
  })
  
  return {
    secret: secret.base32,
    qrCodeUrl: secret.otpauth_url!,
    manualEntryKey: secret.base32,
  }
}

// Generate QR code for 2FA setup
export async function generateQRCode(otpauthUrl: string): Promise<string> {
  try {
    return await QRCode.toDataURL(otpauthUrl)
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

// Verify TOTP token
export function verifyTOTPToken(token: string, secret: string): boolean {
  try {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: TOTP_CONFIG.window,
    })
  } catch (error) {
    console.error('Error verifying TOTP token:', error)
    return false
  }
}

// Generate backup codes
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
  }
  return codes
}

// Hash backup codes for storage
export function hashBackupCodes(codes: string[]): string[] {
  return codes.map(code => {
    // Simple hash for demo - in production, use proper hashing
    return Buffer.from(code).toString('base64')
  })
}

// Verify backup code
export function verifyBackupCode(code: string, hashedCodes: string[]): boolean {
  const hashedCode = Buffer.from(code).toString('base64')
  return hashedCodes.includes(hashedCode)
}

// 2FA service class
export class TwoFactorAuthService {
  private supabase = createClient()
  
  // Enable 2FA for a user
  async enable2FA(userId: string, secret: string, backupCodes: string[]): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          two_factor_enabled: true,
          two_factor_secret: secret,
          two_factor_backup_codes: hashBackupCodes(backupCodes),
          two_factor_enabled_at: new Date().toISOString(),
        })
        .eq('id', userId)
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error enabling 2FA:', error)
      return { success: false, error: 'Failed to enable 2FA' }
    }
  }
  
  // Disable 2FA for a user
  async disable2FA(userId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          two_factor_enabled: false,
          two_factor_secret: null,
          two_factor_backup_codes: null,
          two_factor_disabled_at: new Date().toISOString(),
        })
        .eq('id', userId)
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error disabling 2FA:', error)
      return { success: false, error: 'Failed to disable 2FA' }
    }
  }
  
  // Check if user has 2FA enabled
  async is2FAEnabled(userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('two_factor_enabled')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error checking 2FA status:', error)
        return false
      }
      
      return data?.two_factor_enabled || false
    } catch (error) {
      console.error('Error checking 2FA status:', error)
      return false
    }
  }
  
  // Get user's 2FA secret (for verification)
  async get2FASecret(userId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('two_factor_secret')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error getting 2FA secret:', error)
        return null
      }
      
      return data?.two_factor_secret || null
    } catch (error) {
      console.error('Error getting 2FA secret:', error)
      return null
    }
  }
  
  // Verify 2FA token
  async verify2FAToken(userId: string, token: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const secret = await this.get2FASecret(userId)
      if (!secret) {
        return { success: false, error: '2FA not configured' }
      }
      
      const isValid = verifyTOTPToken(token, secret)
      if (!isValid) {
        return { success: false, error: 'Invalid 2FA token' }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error verifying 2FA token:', error)
      return { success: false, error: 'Failed to verify 2FA token' }
    }
  }
  
  // Regenerate backup codes
  async regenerateBackupCodes(userId: string): Promise<{
    success: boolean
    codes?: string[]
    error?: string
  }> {
    try {
      const newCodes = generateBackupCodes()
      const hashedCodes = hashBackupCodes(newCodes)
      
      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          two_factor_backup_codes: hashedCodes,
        })
        .eq('id', userId)
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, codes: newCodes }
    } catch (error) {
      console.error('Error regenerating backup codes:', error)
      return { success: false, error: 'Failed to regenerate backup codes' }
    }
  }
  
  // Verify backup code
  async verifyBackupCode(userId: string, code: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('two_factor_backup_codes')
        .eq('id', userId)
        .single()
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      const hashedCodes = data?.two_factor_backup_codes || []
      const isValid = verifyBackupCode(code, hashedCodes)
      
      if (!isValid) {
        return { success: false, error: 'Invalid backup code' }
      }
      
      // Remove used backup code
      const updatedCodes = hashedCodes.filter(hashedCode => 
        hashedCode !== Buffer.from(code).toString('base64')
      )
      
      await this.supabase
        .from('user_profiles')
        .update({
          two_factor_backup_codes: updatedCodes,
        })
        .eq('id', userId)
      
      return { success: true }
    } catch (error) {
      console.error('Error verifying backup code:', error)
      return { success: false, error: 'Failed to verify backup code' }
    }
  }
}

// Export singleton instance
export const twoFactorAuthService = new TwoFactorAuthService()
