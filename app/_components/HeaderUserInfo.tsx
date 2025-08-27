'use client'
import { useUser } from '@clerk/nextjs'

export default function HeaderUserInfo() {
  const { user, isSignedIn, isLoaded } = useUser()
  if (!isLoaded || !isSignedIn) return null
  const email = user.primaryEmailAddress?.emailAddress
 
  return <span className="text-sm text-gray-700 mr-3">{email || 'User'}</span>
}


