import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Download, Trash2, MessageSquare, Mic, Calendar, Clock, Star, Search, Copy, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useConversationStore, type Conversation } from '@/stores/conversation-store'
import { getConfidenceColor, formatConfidence } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const HistoryView: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { conversations, clearConversations, exportConversations } = useConversationStore()
  const { toast } = useToast()

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation =>
    conversation.input.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: Date | string) => {
    // Handle both Date objects and date strings from localStorage
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  const handleExport = () => {
    exportConversations()
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all conversation history? This cannot be undone.')) {
      clearConversations()
    }
  }

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleCloseDetail = () => {
    setSelectedConversation(null)
  }

  const handleCopyConversation = async () => {
    if (!selectedConversation) return
    
    try {
      const conversationText = `
Conversation Details
===================
Input: ${selectedConversation.input}
Type: ${selectedConversation.type}
Date: ${formatDate(selectedConversation.timestamp)}

Suggestions:
${selectedConversation.suggestions.map((suggestion, index) => `
${index + 1}. ${suggestion.text}
   Confidence: ${formatConfidence(suggestion.confidence)}
   Reasoning: ${suggestion.reasoning}
`).join('')}
      `.trim()
      
      await navigator.clipboard.writeText(conversationText)
      
      toast({
        title: "Conversation copied",
        description: "Conversation details copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy conversation to clipboard",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <History className="h-8 w-8" />
            <span>Conversation History</span>
          </h1>
          <p className="text-muted-foreground">
            Review your past conversations and suggestions
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={conversations.length === 0}
            className="flex items-center space-x-2"
            title="Export all conversations as JSON file"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={conversations.length === 0}
            className="flex items-center space-x-2"
            title="Delete all conversation history"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Conversations</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {filteredConversations.length} of {conversations.length}
                </Badge>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    {conversations.length === 0 ? 'No conversations yet' : 'No matches found'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {conversations.length === 0 
                      ? 'Start chatting to see your conversation history here.'
                      : 'Try adjusting your search terms.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {filteredConversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 group ${
                          selectedConversation?.id === conversation.id ? 'bg-muted border-primary' : 'border-border'
                        }`}
                        onClick={() => handleConversationClick(conversation)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {conversation.type === 'voice' ? (
                              <Mic className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-green-600 flex-shrink-0" />
                            )}
                            <span 
                              className="text-sm font-medium truncate"
                              title={conversation.input}
                            >
                              {conversation.input.split(' ').slice(0, 8).join(' ')}
                              {conversation.input.split(' ').length > 8 && '...'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity opacity-50" title="Favorite (coming soon)">
                              <Star className="h-3 w-3 text-muted-foreground hover:text-yellow-500 cursor-pointer" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span title={formatDate(conversation.timestamp)}>
                              {formatDate(conversation.timestamp)}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {conversation.suggestions.length} suggestions
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedConversation ? (
              <motion.div
                key={selectedConversation.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {selectedConversation.type === 'voice' ? (
                          <Mic className="h-5 w-5 text-blue-600" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-green-600" />
                        )}
                        <CardTitle>Conversation Details</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Copy conversation to clipboard"
                          onClick={handleCopyConversation}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {/* Share functionality coming in future update */}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Share conversation (coming soon)"
                          disabled
                          className="opacity-50"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCloseDetail}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(selectedConversation.timestamp)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Original Input */}
                    <div>
                      <h3 className="font-semibold mb-2">Your Input</h3>
                      <div className="p-3 bg-muted/50 rounded-md">
                        <p className="text-foreground">{selectedConversation.input}</p>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <h3 className="font-semibold mb-4">Clarity's Suggestions</h3>
                      <div className="space-y-4">
                        {selectedConversation.suggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="border-l-4 border-l-primary">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <h4 className="font-semibold">
                                      Suggestion {index + 1}
                                    </h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                                      {formatConfidence(suggestion.confidence)} confidence
                                    </span>
                                  </div>
                                  
                                  <p className="text-foreground">
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a conversation from the list to view its details and suggestions.
                </p>
                <p className="text-xs text-muted-foreground">
                  e.g., see all suggestions for your "small talk" prompt
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default HistoryView 