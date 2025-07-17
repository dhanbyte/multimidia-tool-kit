"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceSearchProps {
  onResult: (text: string) => void
}

export function VoiceSearch({ onResult }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const { toast } = useToast()

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser",
        variant: "destructive",
      })
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
      toast({
        title: "Listening...",
        description: "Speak now to search for tools",
      })
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
      setIsListening(false)
      toast({
        title: "Voice Captured",
        description: `Searching for: "${transcript}"`,
      })
    }

    recognition.onerror = (event: any) => {
      setIsListening(false)
      toast({
        title: "Error",
        description: "Could not capture voice. Please try again.",
        variant: "destructive",
      })
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={startListening}
      disabled={isListening}
      className={`h-8 w-8 p-0 ${isListening ? "text-red-500 animate-pulse" : ""}`}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}
