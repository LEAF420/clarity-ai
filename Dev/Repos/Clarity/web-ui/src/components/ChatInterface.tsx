import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, MessageSquare, Brain, Shield, Globe, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react'

// Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: new () => any
    webkitSpeechRecognition: new () => any
  }
}

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useConversationStore, type Suggestion } from '@/stores/conversation-store'
import { useDemoStore } from '@/stores/demo-store'
import { useModelStore } from '@/stores/model-store'
import { useOllamaStore } from '@/stores/ollama-store'
import { getConfidenceColor, formatConfidence } from '@/lib/utils'

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  
  const { toast } = useToast()
  const { addConversation } = useConversationStore()
  const { demoStatus, getSuggestions } = useDemoStore()
  const { modelStatus } = useModelStore()
  const { ollamaStatus, getSuggestions: getOllamaSuggestions } = useOllamaStore()
  const inputRef = useRef<HTMLInputElement>(null)

  // Example prompts for interactive chips
  const examplePrompts = [
    "I get stuck during small talk—what can I say next?",
    "How do I politely interrupt someone in a meeting?",
    "Can you help me rephrase this for clarity?",
    "What should I do if I forget someone's name?",
    "Suggest ways to ask for feedback at work.",
    "How can I show I'm actively listening in a conversation?",
    "How should I respond to a difficult email?",
    "I need help wording a message for my team.",
    "How can I politely end a conversation that's going on too long?",
    "Help me write an email declining a meeting invitation.",
    "What's a diplomatic way to say 'I don't know' in a meeting?",
    "Someone told a joke I didn't understand. What can I say?",
    "Suggest phrases for delegating a task to a team member.",
    "How do I ask for a raise without sounding demanding?",
    "What should I say when someone asks about my salary?",
    "Help me write a professional thank you email."
  ]

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  // Carousel state and logic
  const [currentPage, setCurrentPage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  
  // Calculate items per page based on screen size
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 2 : 4
    }
    return 2
  }
  
  const [itemsPerPage, setItemsPerPage] = useState(() => getItemsPerPage())
  const totalPages = Math.ceil(examplePrompts.length / itemsPerPage)
  
  // Update items per page on window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Get current page items
  const getCurrentPageItems = () => {
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    return examplePrompts.slice(start, end)
  }
  
  // Auto-rotation logic
  useEffect(() => {
    if (isPaused || isHovered) return
    
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 6000)
    
    return () => clearInterval(interval)
  }, [isPaused, isHovered, totalPages])
  
  // Pause on input focus
  useEffect(() => {
    const handleFocus = () => setIsPaused(true)
    const handleBlur = () => setIsPaused(false)
    
    const input = inputRef.current
    if (input) {
      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
      
      return () => {
        input.removeEventListener('focus', handleFocus)
        input.removeEventListener('blur', handleBlur)
      }
    }
  }, [])
  
  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }
  
  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  // Get the actual model name being used
  const getCurrentModelName = () => {
    if (ollamaStatus.isOllamaMode) {
      return ollamaStatus.modelName || 'Ollama Local'
    } else if (demoStatus.isDemoMode) {
      return 'OpenRouter Gemma 3n'
    } else if (modelStatus.isImported) {
      return modelStatus.fileName || 'Local Gemma 3n'
    } else {
      return 'Gemma 3n'
    }
  }

  // Speech recognition setup
  const [recognition, setRecognition] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    setIsProcessing(true)
    
    try {
      let generatedSuggestions: Suggestion[]

      // Check if we have a local model, Ollama mode, or are in demo mode
      if (ollamaStatus.isOllamaMode) {
        // Use Ollama local inference
        generatedSuggestions = await getOllamaSuggestions(input.trim())
      } else if (modelStatus.isImported && modelStatus.verificationStatus === 'verified') {
        // Use local model (placeholder - needs real implementation)
        throw new Error('Local model inference not yet implemented. Please use Ollama mode or demo mode.')
      } else if (demoStatus.isDemoMode) {
        // Use demo mode API
        generatedSuggestions = await getSuggestions(input.trim())
      } else {
        throw new Error('No model available. Please import a model, enable Ollama mode, or enable demo mode.')
      }
      
      setSuggestions(generatedSuggestions)
      
      // Add to conversation history
      addConversation({
        input: input.trim(),
        suggestions: generatedSuggestions,
        type: 'text'
      })

      setInput('')
      toast({
        title: "Response generated",
        description: ollamaStatus.isOllamaMode
          ? "Clarity has provided suggestions using local Ollama inference."
          : demoStatus.isDemoMode 
            ? "Clarity has provided suggestions using online demo mode."
            : "Clarity has provided suggestions to help with your communication.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate response"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsRecording(false)
        
        // Announce for screen readers
        const announcement = document.createElement('div')
        announcement.setAttribute('aria-live', 'polite')
        announcement.textContent = `Voice input received: ${transcript}`
        document.body.appendChild(announcement)
        setTimeout(() => document.body.removeChild(announcement), 1000)
      }
      
      recognition.onerror = (event: any) => {
        setIsRecording(false)
        toast({
          title: "Voice input failed",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive"
        })
      }
      
      recognition.onend = () => {
        setIsRecording(false)
      }
      
      setRecognition(recognition)
    }
  }, [])

  const handleVoiceInput = async () => {
    if (!recognition) {
      toast({
        title: "Voice input not supported",
        description: "Speech recognition is not available in your browser.",
        variant: "destructive"
      })
      return
    }

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
      return
    }

    setIsRecording(true)
    
    try {
      recognition.start()
      
      // Announce for screen readers
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.textContent = 'Listening... Speak now'
      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 1000)
      
      toast({
        title: "Listening...",
        description: "Speak your message now",
      })
    } catch (error) {
      setIsRecording(false)
      toast({
        title: "Voice input failed",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Clarity Space</h1>
        <p className="text-muted-foreground">
            Your privacy-first partner for confident communication
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Brain className="h-4 w-4" />
            <span>{getCurrentModelName()}</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            demoStatus.isDemoMode && !ollamaStatus.isOllamaMode 
              ? 'text-orange-600 dark:text-orange-400' 
              : 'text-green-600 dark:text-green-400'
          }`}>
            <Shield className="h-4 w-4" />
            <span>{demoStatus.isDemoMode && !ollamaStatus.isOllamaMode ? 'Demo Mode' : '100% Offline'}</span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>How can Clarity help you today?</span>
          </CardTitle>
          <CardDescription>
              Share your challenge, and Clarity will help you find the right words.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., I'm having trouble finding the right words when I'm nervous..."
                className="flex-1"
                disabled={isProcessing}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                onClick={handleVoiceInput}
                disabled={isProcessing}
                className="flex items-center space-x-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span>Voice</span>
                  </>
                )}
              </Button>
            </div>
            
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md"
              >
                <div className="animate-pulse">
                  <Mic className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm text-red-800">Recording... Speak now</span>
              </motion.div>
            )}
          </form>

          {/* Example Prompts Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
            role="region"
            aria-label="Example prompts to get started"
            aria-live="polite"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-medium text-muted-foreground">
                {demoStatus.isDemoMode 
                  ? "Try these examples:" 
                  : "Try these examples:"}
              </h3>
            </div>
            
            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Arrows (hidden on mobile) */}
              <div className="hidden md:flex absolute left-0 right-0 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-10">
                <button
                  onClick={handlePrev}
                  className="p-2 bg-background/80 backdrop-blur-sm rounded-full border border-border hover:bg-background/90 transition-all duration-200 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Previous examples"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 bg-background/80 backdrop-blur-sm rounded-full border border-border hover:bg-background/90 transition-all duration-200 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Next examples"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              {/* Carousel Content */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex flex-wrap gap-2 justify-center"
                  >
                    {getCurrentPageItems().map((prompt, index) => (
                      <motion.button
                        key={`${currentPage}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.2, duration: 0.5, ease: "easeOut" }}
                        onClick={() => handleExampleClick(prompt)}
                        className="px-3 py-2 text-sm bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full border border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        aria-label={`Try example: ${prompt}`}
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
              

            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold">Clarity's Suggestions</h2>
              <p className="text-sm text-muted-foreground">
                Based on your input, here are some helpful strategies:
              </p>
            </div>

            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold">
                            Suggestion {index + 1}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                            {formatConfidence(suggestion.confidence)} confidence
                          </span>
                        </div>
                        
                        <p className="text-foreground leading-relaxed">
                          {suggestion.text}
                        </p>
                        
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm text-muted-foreground">
                            <strong>Why this helps:</strong> {suggestion.reasoning}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Ollama Mode Notice */}
            {ollamaStatus.isOllamaMode && (
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Brain className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Ollama Local Mode (100% On-Device)</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        All inference runs locally on your device via Ollama. No data ever leaves your device.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Demo Mode Warning */}
            {demoStatus.isDemoMode && !ollamaStatus.isOllamaMode && (
              <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">Demo Mode (Online)</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        Data leaves your device. Privacy not guaranteed. Import a model for full offline functionality.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Notice */}
            {!demoStatus.isDemoMode && !ollamaStatus.isOllamaMode && (
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Privacy Guarantee</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        All processing happened locally on your device. No data was transmitted or stored externally.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {suggestions.length === 0 && !isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Ready to help with communication
          </h3>
          <p className="text-sm text-muted-foreground">
            Share your communication challenge and Clarity will provide personalized suggestions.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default ChatInterface 