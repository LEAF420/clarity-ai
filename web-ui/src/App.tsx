import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, MessageSquare, History, Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'

import { useToast } from '@/hooks/use-toast'
import { useModelStore } from '@/stores/model-store'

import { useDemoStore } from '@/stores/demo-store'
import { useOllamaStore } from '@/stores/ollama-store'
import { openRouterAPI } from '@/lib/api'

import Onboarding from '@/components/Onboarding'
import ModelImport from '@/components/ModelImport'
import ChatInterface from '@/components/ChatInterface'
import HistoryView from '@/components/HistoryView'
import ErrorBoundary from '@/components/ErrorBoundary'
import ConfirmDialog from '@/components/ConfirmDialog'





function App() {
  // Onboarding and Model Import State Management
  // 
  // State Flow:
  // 1. isOnboardingComplete: false → Show Onboarding component
  // 2. isOnboardingComplete: true, isModelImported: false → Show ModelImport component  
  // 3. isOnboardingComplete: true, isModelImported: true → Show main app (Chat/History)
  //
  // Reset Triggers:
  // - User clicks header logo → Confirmation dialog → Reset both states
  // - Model verification fails → Auto-reset to onboarding
  // - Model is deleted → Auto-reset to onboarding
  // - localStorage cleared → Auto-reset to onboarding
  //
  // Persistence:
  // - onboarding status stored in localStorage
  // - model status stored in Zustand (persisted to localStorage)
  // - model files stored in IndexedDB
  
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(
    () => localStorage.getItem('clarity-onboarding-complete') === 'true'
  )
  const [isModelImported, setIsModelImported] = useState(false)
  const [currentView, setCurrentView] = useState<'chat' | 'history'>('chat')
  const [showResetDialog, setShowResetDialog] = useState(false)
  
  const { toast } = useToast()
  const { modelStatus, resetModel } = useModelStore()

  const { demoStatus, setDemoMode, checkAPIConfig, checkOnlineStatus } = useDemoStore()
  const { ollamaStatus } = useOllamaStore()

  // Get the footer text based on current mode
  const getFooterText = () => {
    if (ollamaStatus.isOllamaMode) {
      return `${ollamaStatus.modelName || 'Ollama Local'} • 100% Offline`
    } else if (demoStatus.isDemoMode) {
      return 'OpenRouter Gemma 3n • Demo Mode'
    } else if (modelStatus.isImported) {
      return `${modelStatus.fileName || 'Local Gemma 3n'} • 100% Offline`
    } else {
      return 'Gemma 3n • 100% Offline'
    }
  }

  // Check if onboarding and model import are complete on app start
  // This effect runs on component mount and when model status changes
  // This effect syncs the model import status from the Zustand store
  // to the local component state.
  useEffect(() => {
    const modelReady = modelStatus.isImported && modelStatus.verificationStatus !== 'failed'
    setIsModelImported(modelReady)
  }, [modelStatus.isImported, modelStatus.verificationStatus])

  // Handler for when user completes the onboarding flow
  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true)
    localStorage.setItem('clarity-onboarding-complete', 'true')
  }

  // Handler for when model import succeeds
  const handleModelImportSuccess = () => {
    setIsModelImported(true)
    toast({
      title: "Model imported successfully!",
      description: "Clarity is ready to help with your communication needs.",
    })
  }

  // Handler for going back from model import
  const handleModelImportBack = () => {
    setIsOnboardingComplete(false)
    localStorage.removeItem('clarity-onboarding-complete')
  }

  // Handler for skipping model import (online demo mode)
  const handleModelImportSkip = () => {
    // Skip onboarding
    
    // Check API configuration first
    checkAPIConfig()
    checkOnlineStatus()
    
    // Get fresh status after checking
    const apiConfigured = openRouterAPI.isConfigured()
    const isOnline = navigator.onLine
    
          // Check if we can enable demo mode
    
    if (!apiConfigured) {
      toast({
        title: "Demo mode not available",
        description: "API key/config missing. Please check your .env file.",
        variant: "destructive"
      })
      return
    }

    if (!isOnline) {
      toast({
        title: "No internet connection",
        description: "Demo mode requires online access.",
        variant: "destructive"
      })
      return
    }

            // Enable demo mode
    
    // Enable demo mode
    setDemoMode(true)
    setIsModelImported(true)
    
            // Demo mode is now active
    
    toast({
      title: "Online demo enabled",
      description: "You're now using Clarity's online demo. Import a model for full offline functionality.",
    })
  }

  // Handler for resetting onboarding (called from confirmation dialog)
  const handleResetOnboarding = () => {
    // Reset local state
    setIsOnboardingComplete(false)
    setIsModelImported(false)
    
    // Clear localStorage
    localStorage.removeItem('clarity-onboarding-complete')
    
    // Reset model store (this will clear IndexedDB and Zustand state)
    resetModel()
    
    toast({
      title: "Onboarding reset",
      description: "You can now go through the setup process again.",
    })
  }

  // Handler for header logo click (shows confirmation dialog)
  const handleHeaderLogoClick = () => {
    setShowResetDialog(true)
  }

  // Show onboarding if not complete
  if (!isOnboardingComplete) {
    return (
      <ToastProvider>
        <Onboarding onComplete={handleOnboardingComplete} />
        <ToastViewport />
      </ToastProvider>
    )
  }

  // Show model import if onboarding complete but model not imported
  if (!isModelImported) {
    return (
      <ToastProvider>
        <ErrorBoundary>
          <ModelImport 
            onImportSuccess={handleModelImportSuccess}
            onBack={handleModelImportBack}
            onSkip={handleModelImportSkip}
          />
        </ErrorBoundary>
        <ToastViewport />
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">Clarity</h1>
                  </div>
                </div>

                {/* Center Badge */}
                <div className="flex items-center justify-center">
                  {ollamaStatus.isOllamaMode && (
                    <button
                      onClick={handleHeaderLogoClick}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 border border-green-200 rounded-md hover:bg-green-200 transition-colors cursor-pointer"
                      title="Reset onboarding (click to reset)"
                    >
                      <Brain className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-800 font-medium">Ollama Local Mode</span>
                    </button>
                  )}
                  {demoStatus.isDemoMode && !ollamaStatus.isOllamaMode && (
                    <button
                      onClick={handleHeaderLogoClick}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 border border-orange-200 rounded-md hover:bg-orange-200 transition-colors cursor-pointer"
                      title="Reset onboarding (click to reset)"
                    >
                      <Globe className="h-3 w-3 text-orange-600" />
                      <span className="text-xs text-orange-800 font-medium">Demo Mode (Online)</span>
                    </button>
                  )}
                </div>
                
                <nav className="flex items-center space-x-2">
                  <Button
                    variant={currentView === 'chat' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView('chat')}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </Button>
                  <Button
                    variant={currentView === 'history' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView('history')}
                    className="flex items-center space-x-2"
                  >
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </Button>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              {currentView === 'chat' ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatInterface />
                </motion.div>
              ) : (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HistoryView />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>{getFooterText()}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Built for Kaggle Competition</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <ToastViewport />
      </Router>
      
      {/* Reset Onboarding Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleResetOnboarding}
        title="Reset Onboarding"
        description="This will clear your imported model and restart the onboarding process. Are you sure you want to continue?"
        confirmText="Reset Onboarding"
        cancelText="Cancel"
        variant="destructive"
      />
    </ToastProvider>
  )
}

export default App 