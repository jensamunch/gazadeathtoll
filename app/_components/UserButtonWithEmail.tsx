'use client'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { useState } from 'react'

export default function UserButtonWithEmail() {
  const { user } = useUser()
  const [showEmail, setShowEmail] = useState(false)
  const email = user?.primaryEmailAddress?.emailAddress

  return (
    <div className="relative flex items-center">
      <div
        onMouseEnter={() => setShowEmail(true)}
        onMouseLeave={() => setShowEmail(false)}
        className="flex items-center"
      >
        <UserButton afterSignOutUrl="/" />
      </div>
      {showEmail && email && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg whitespace-nowrap z-50">
          {email}
          <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
        </div>
      )}
    </div>
  )
}
