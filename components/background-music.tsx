"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BackgroundMusicProps {
  musicUrl?: string
  volume?: number
  autoplay?: boolean
  onUserInteraction?: () => void
}

export function BackgroundMusic({ musicUrl, volume = 25, autoplay = true, onUserInteraction }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true
      audioRef.current.volume = volume / 100 // Convert percentage to decimal
      
      // Attempt autoplay on component mount
      if (autoplay && !audioInitialized) {
        const attemptAutoplay = async () => {
          try {
            // Set muted first to bypass autoplay restrictions, then unmute
            audioRef.current!.muted = true
            await audioRef.current?.play()
            audioRef.current!.muted = false
            setIsPlaying(true)
            setAudioInitialized(true)
            onUserInteraction?.()
            console.log("Music started automatically!")
          } catch (error) {
            console.log("Autoplay prevented by browser:", error)
            // Show controls if autoplay fails
            setShowControls(true)
          }
        }
        
        // Try multiple times with increasing delays
        setTimeout(attemptAutoplay, 50)
        setTimeout(attemptAutoplay, 200)
        setTimeout(attemptAutoplay, 500)
      }
    }
  }, [volume, autoplay, audioInitialized, onUserInteraction])

  const initializeAudio = () => {
    if (audioRef.current && !audioInitialized && autoplay) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          setAudioInitialized(true)
          onUserInteraction?.()
        })
        .catch((error) => {
          console.log("Audio autoplay prevented:", error)
          // Show controls if autoplay fails
          setShowControls(true)
        })
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((error) => console.error("Error playing audio:", error))
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleUserInteraction = () => {
    if (!audioInitialized) {
      initializeAudio()
    }
  }

  // Add multiple fallback autoplay strategies
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && autoplay && !audioInitialized && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            setAudioInitialized(true)
            onUserInteraction?.()
            console.log("Music started on visibility change!")
          })
          .catch((error) => {
            console.log("Autoplay on visibility change failed:", error)
          })
      }
    }

    const handleUserInteraction = () => {
      if (autoplay && !audioInitialized && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            setAudioInitialized(true)
            onUserInteraction?.()
            console.log("Music started on user interaction!")
          })
          .catch((error) => {
            console.log("Autoplay on user interaction failed:", error)
          })
      }
    }

    // Add event listeners for multiple interaction types
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('keydown', handleUserInteraction, { once: true })
    document.addEventListener('touchstart', handleUserInteraction, { once: true })
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [autoplay, audioInitialized, onUserInteraction])

  return (
    <>
      <audio 
        ref={audioRef} 
        src={musicUrl || "/wedding-music.mp3"} 
        preload="auto"
        autoPlay
        muted={false}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio error:", e)
          setShowControls(true)
        }}
        onCanPlayThrough={() => {
          // Try to play as soon as audio is ready
          if (autoplay && !audioInitialized && audioRef.current) {
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true)
                setAudioInitialized(true)
                onUserInteraction?.()
                console.log("Music started when audio was ready!")
              })
              .catch((error) => {
                console.log("Autoplay when ready failed:", error)
              })
          }
        }}
      />
      
      {/* Floating music controls */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={togglePlay}
                className="h-8 w-8 p-0 hover:bg-accent/10"
                title={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMute}
                className="h-8 w-8 p-0 hover:bg-accent/10"
                title={isMuted ? "Unmute music" : "Mute music"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              {!audioInitialized && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleUserInteraction}
                  className="h-8 w-8 p-0 hover:bg-accent/10"
                  title="Start background music"
                >
                  <Music className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
