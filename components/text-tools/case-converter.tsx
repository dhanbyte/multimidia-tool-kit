"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Type, Copy } from "lucide-react"

export default function CaseConverter() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeCase, setActiveCase] = useState("")
  const { toast } = useToast()

  const convertCase = (type: string) => {
    let result = ""
    
    switch (type) {
      case "upper":
        result = inputText.toUpperCase()
        break
      case "lower":
        result = inputText.toLowerCase()
        break
      case "title":
        result = inputText.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
        break
      case "sentence":
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => 
          c.toUpperCase()
        )
        break
      case "camel":
        result = inputText
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '')
        break
      case "pascal":
        result = inputText
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '')
        break
      case "snake":
        result = inputText
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_')
        break
      case "kebab":
        result = inputText
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-')
        break
      case "alternating":
        result = inputText
          .split('')
          .map((char, index) => 
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join('')
        break
      case "inverse":
        result = inputText
          .split('')
          .map(char => 
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          )
          .join('')
        break
      default:
        result = inputText
    }
    
    setOutputText(result)
    setActiveCase(type)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
    toast({ title: "Copied!", description: "Text copied to clipboard" })
  }

  const caseOptions = [
    { id: "upper", label: "UPPERCASE", description: "Convert to all uppercase letters" },
    { id: "lower", label: "lowercase", description: "Convert to all lowercase letters" },
    { id: "title", label: "Title Case", description: "Capitalize the first letter of each word" },
    { id: "sentence", label: "Sentence case", description: "Capitalize the first letter of each sentence" },
    { id: "camel", label: "camelCase", description: "First word lowercase, subsequent words capitalized" },
    { id: "pascal", label: "PascalCase", description: "All words capitalized, no spaces" },
    { id: "snake", label: "snake_case", description: "All lowercase with underscores" },
    { id: "kebab", label: "kebab-case", description: "All lowercase with hyphens" },
    { id: "alternating", label: "aLtErNaTiNg CaSe", description: "Alternating upper and lowercase" },
    { id: "inverse", label: "iNVERSE cASE", description: "Swap upper and lowercase" }
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Case Converter
        </CardTitle>
        <CardDescription>Convert text between different case formats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Input Text</label>
          <Textarea
            placeholder="Enter your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {caseOptions.map((option) => (
            <Button
              key={option.id}
              variant={activeCase === option.id ? "default" : "outline"}
              onClick={() => convertCase(option.id)}
              disabled={!inputText.trim()}
              className="h-auto p-3 text-left flex flex-col items-start"
              title={option.description}
            >
              <span className="font-medium text-xs">{option.label}</span>
            </Button>
          ))}
        </div>
        
        {outputText && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Output Text</label>
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              value={outputText}
              readOnly
              className="min-h-[120px] bg-gray-50"
            />
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <h3 className="font-medium mb-2">Case Types Explained:</h3>
          <ul className="space-y-1">
            <li><strong>UPPERCASE:</strong> ALL LETTERS IN CAPITAL</li>
            <li><strong>lowercase:</strong> all letters in small case</li>
            <li><strong>Title Case:</strong> First Letter Of Each Word Capitalized</li>
            <li><strong>Sentence case:</strong> First letter of each sentence capitalized</li>
            <li><strong>camelCase:</strong> firstWordLowercase, subsequentWordsCapitalized</li>
            <li><strong>PascalCase:</strong> AllWordsCapitalizedNoSpaces</li>
            <li><strong>snake_case:</strong> all_words_lowercase_with_underscores</li>
            <li><strong>kebab-case:</strong> all-words-lowercase-with-hyphens</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}