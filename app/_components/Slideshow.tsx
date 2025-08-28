'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

type Person = {
  id: string
  name: string
  enName: string
  age?: number | null
  dob?: string | null
  sex?: 'm' | 'f' | null
  source?: string | null
  createdAt: string
}

interface SlideshowProps {
  data: Person[]
  squareImageUrlForId: (id: string, size?: number) => string
  onClose: () => void
}

export default function Slideshow({ 
  data, 
  squareImageUrlForId, 
  onClose
}: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % data.length)
  }, [data.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length)
  }, [data.length])

  // Auto-advance slideshow every 3 seconds
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(nextSlide, 3000)
    return () => clearInterval(interval)
  }, [nextSlide, isPlaying])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          prevSlide()
          break
        case 'ArrowRight':
          nextSlide()
          break
        case ' ':
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [onClose, prevSlide, nextSlide, isPlaying])

  if (data.length === 0) return null

  const currentPerson = data[currentIndex]

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Play/Pause button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 left-4 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>

      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="sm"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Main image */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="max-w-4xl max-h-full flex flex-col items-center">
          <Image
            src={squareImageUrlForId(currentPerson.id, 800)}
            alt={currentPerson.name || currentPerson.enName || currentPerson.id}
            width={800}
            height={800}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
          />
          
          {/* Person info overlay - only Arabic name */}
          <div className="mt-6 text-center text-white bg-black/50 rounded-lg p-4 max-w-lg">
            <h2 className="text-xl font-semibold">{currentPerson.name}</h2>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-white text-sm bg-black/50 rounded-full px-4 py-2">
        <span>{currentIndex + 1} / {data.length}</span>
        <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
