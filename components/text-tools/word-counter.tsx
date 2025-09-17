"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Hash, Clock, Eye } from "lucide-react"

export default function WordCounter() {
  const [text, setText] = useState("")
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  })

  useEffect(() => {
    const calculateStats = () => {
      const characters = text.length
      const charactersNoSpaces = text.replace(/\s/g, '').length
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0
      const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0
      const readingTime = Math.ceil(words / 200) // Average reading speed: 200 words per minute

      setStats({
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        readingTime
      })
    }

    calculateStats()
  }, [text])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Word Counter & Text Analyzer
        </CardTitle>
        <CardDescription>Count words, characters, and analyze your text</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[300px] text-base"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.words}</div>
            <div className="text-sm text-gray-600">Words</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.characters}</div>
            <div className="text-sm text-gray-600">Characters</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.charactersNoSpaces}</div>
            <div className="text-sm text-gray-600">No Spaces</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.sentences}</div>
            <div className="text-sm text-gray-600">Sentences</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.paragraphs}</div>
            <div className="text-sm text-gray-600">Paragraphs</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{stats.readingTime}</div>
            <div className="text-sm text-gray-600">Min Read</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Text Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Average words per sentence:</span>
                <Badge variant="outline">
                  {stats.sentences > 0 ? Math.round(stats.words / stats.sentences) : 0}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Average characters per word:</span>
                <Badge variant="outline">
                  {stats.words > 0 ? Math.round(stats.charactersNoSpaces / stats.words) : 0}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Longest word:</span>
                <Badge variant="outline">
                  {text.trim() ? Math.max(...text.split(/\s+/).map(word => word.replace(/[^\w]/g, '').length)) : 0} chars
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Reading Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Slow reader (150 WPM):</span>
                <Badge variant="outline">
                  {Math.ceil(stats.words / 150)} min
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Average reader (200 WPM):</span>
                <Badge variant="outline">
                  {Math.ceil(stats.words / 200)} min
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Fast reader (250 WPM):</span>
                <Badge variant="outline">
                  {Math.ceil(stats.words / 250)} min
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}