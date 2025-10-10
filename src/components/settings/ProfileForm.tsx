'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useToastHelpers } from '@/components/ui/Toast'
import { UserIcon, CameraIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface ProfileData {
  fullName: string
  email: string
  avatar?: string
  bio?: string
  website?: string
  location?: string
}

export function ProfileForm() {
  const { user, updateUser } = useAuth()
  const { success, error: showError } = useToastHelpers()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    bio: user?.user_metadata?.bio || '',
    website: user?.user_metadata?.website || '',
    location: user?.user_metadata?.location || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would call an API to update the user profile
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      if (updateUser) {
        updateUser({
          ...user,
          user_metadata: {
            ...user?.user_metadata,
            full_name: profile.fullName,
            bio: profile.bio,
            website: profile.website,
            location: profile.location,
          }
        })
      }
      
      success('Profile Updated', 'Your profile has been successfully updated.')
    } catch (err) {
      showError('Update Failed', 'Failed to update your profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      showError('Invalid File', 'Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showError('File Too Large', 'Please select an image smaller than 5MB.')
      return
    }

    try {
      setIsLoading(true)
      // In a real app, this would upload to Supabase Storage
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }))
        success('Avatar Updated', 'Your avatar has been updated.')
      }
      reader.readAsDataURL(file)
    } catch (err) {
      showError('Upload Failed', 'Failed to upload your avatar. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and profile settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-orange-600 transition-colors"
              >
                <CameraIcon className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {profile.fullName || 'Your Name'}
              </h3>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Click the camera icon to change your avatar
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                placeholder="Email address"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="City, Country"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                id="website"
                type="url"
                value={profile.website}
                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://yourwebsite.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Tell us about yourself..."
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {profile.bio.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
