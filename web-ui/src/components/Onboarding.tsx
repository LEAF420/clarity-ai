import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Shield, 
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react'

// Import brand icons
import HuggingFaceIcon from '@/assets/brands/huggingface.svg'
import LMStudioIcon from '@/assets/brands/lmstudio.svg'
import OllamaIcon from '@/assets/brands/ollama.svg'

import OpenRouterIcon from '@/assets/brands/openrouter.svg'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


interface OnboardingProps {
  onComplete: () => void
}

type AcquisitionMethod = 'lmstudio' | 'ollama' | 'huggingface'

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState<AcquisitionMethod | null>(null)
  


  // Model import is now handled by the separate ModelImport component
  // This prevents conflicts and ensures consistent behavior
  const handleCompleteOnboarding = () => {
    onComplete()
  }

  const steps = [
    {
      title: "Welcome to Clarity",
      description: "Find Your Voice. Stay in Control.",
      content: (
        <div className="space-y-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="p-5 bg-primary/10 rounded-full">
                  <Brain className="h-20 w-20 text-primary" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">
                Gemma 3n Impact Challenge Edition
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Connection. Confidence. The freedom to be understood—these should belong to everyone.
                <br />
                For millions, communication is a daily challenge. Cloud-based tools often promise help but trade privacy for support, adding new anxieties.
                <br /><br />
                <strong className="text-foreground">Clarity is different:</strong>
                <br />
                Your AI-powered cognitive partner, running entirely on your device.
                <br />
                Empowered by Google’s Gemma 3n, Clarity offers proven strategies, professional frameworks, and peace of mind—no data ever leaves your control.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center tracking-tight">How do you want to run Clarity?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Run 100% On-Device */}
              <Card className="text-center border-2 border-muted-foreground/20 hover:border-primary/40 transition-all duration-300 cursor-pointer hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 tracking-tight">Run 100% On-Device</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Import the official Gemma 3n model file (GGUF) for total offline privacy.
                  </p>
                </CardContent>
              </Card>

              {/* Connect to Local Ollama */}
              <Card className="text-center border-2 border-muted-foreground/20 hover:border-primary/40 transition-all duration-300 cursor-pointer hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <img src={OllamaIcon} alt="Ollama" className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 tracking-tight">Connect to Local Ollama</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Instantly run Clarity using your own Ollama AI server—no downloads, no cloud.
                  </p>
                </CardContent>
              </Card>

              {/* Try Demo Mode */}
              <Card className="text-center border-2 border-muted-foreground/20 hover:border-primary/40 transition-all duration-300 cursor-pointer hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                      <img src={OpenRouterIcon} alt="OpenRouter" className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 tracking-tight">Try Demo Mode (Online)</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Skip setup and experience Clarity instantly using the OpenRouter Gemma 3n API.
                  </p>
                </CardContent>
              </Card>
            </div>


          </div>
        </div>
      )
    },
    {
      title: "Choose Your Method",
      description: "Select how you'd like to get the Gemma 3n model",
      content: (
        <div className="space-y-6">
          <p className="text-center text-muted-foreground">
            Choose the method that works best for you. We recommend LM Studio for beginners.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LM Studio */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg flex flex-col ${
                selectedMethod === 'lmstudio' ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMethod('lmstudio')}
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <img src={LMStudioIcon} alt="LM Studio" className="h-5 w-5" />
                  <CardTitle className="text-base">LM Studio</CardTitle>
                  <Badge variant="secondary" className="text-xs">Easy</Badge>
                </div>
                <CardDescription>
                  Easy-to-use desktop app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="text-sm space-y-2 flex-1">
                  <p>✅ User-friendly interface</p>
                  <p>✅ Automatic model management</p>
                  <p>✅ Works on Mac, Windows, Linux</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open('https://huggingface.co/google/gemma-3n-E4B-it', '_blank')
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download Model
                </Button>
              </CardContent>
            </Card>

            {/* Ollama */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg flex flex-col ${
                selectedMethod === 'ollama' ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMethod('ollama')}
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <img src={OllamaIcon} alt="Ollama" className="h-5 w-5" />
                  <CardTitle className="text-base">Ollama</CardTitle>
                  <Badge variant="outline" className="text-xs">CLI</Badge>
                </div>
                <CardDescription>
                  Command-line tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="text-sm space-y-2 flex-1">
                  <p>⚡ Fast command-line interface</p>
                  <p>🔧 Developer-friendly</p>
                  <p>📦 Simple one-command install</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open('https://huggingface.co/google/gemma-3n-E4B-it', '_blank')
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download Model
                </Button>
              </CardContent>
            </Card>

            {/* Hugging Face */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg flex flex-col ${
                selectedMethod === 'huggingface' ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMethod('huggingface')}
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <img src={HuggingFaceIcon} alt="Hugging Face" className="h-5 w-5" />
                  <CardTitle className="text-base">Hugging Face</CardTitle>
                  <Badge variant="outline" className="text-xs">Manual</Badge>
                </div>
                <CardDescription>
                  Direct download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="text-sm space-y-2 flex-1">
                  <p>🌐 Direct from source</p>
                  <p>📁 Manual file management</p>
                  <p>🔍 Multiple quantization options</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open('https://huggingface.co/google/gemma-3n-E4B-it', '_blank')
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Repository
                </Button>
              </CardContent>
            </Card>
          </div>

          {selectedMethod && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg"
            >
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                    {selectedMethod === 'lmstudio' && 'LM Studio Instructions'}
                    {selectedMethod === 'ollama' && 'Ollama Instructions'}
                    {selectedMethod === 'huggingface' && 'Hugging Face Instructions'}
                  </h4>
                                     <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                     {selectedMethod === 'lmstudio' && (
                       <>
                         <p><strong>1.</strong> Download and install <strong>LM Studio</strong> from <em>lmstudio.ai</em></p>
                         <p><strong>2.</strong> Search for <code className="bg-blue-100 px-1 rounded">"google/gemma-3n-E4B-it"</code></p>
                         <p><strong>3.</strong> Download the <strong>official Google model</strong> from Hugging Face</p>
                         <p><strong>4.</strong> Find the <code className="bg-blue-100 px-1 rounded">.gguf</code> file in your LM Studio models folder</p>
                       </>
                     )}
                     {selectedMethod === 'ollama' && (
                       <>
                         <p><strong>1.</strong> Install <strong>Ollama</strong> from <em>ollama.com</em></p>
                         <p><strong>2.</strong> Run: <code className="bg-blue-100 px-1 rounded">ollama pull gemma3n:e4b</code></p>
                         <p><strong>3.</strong> Find the model in: <code className="bg-blue-100 px-1 rounded">~/.ollama/models</code></p>
                         <p><strong>4.</strong> Copy the <code className="bg-blue-100 px-1 rounded">.gguf</code> file to your desired location</p>
                       </>
                     )}
                     {selectedMethod === 'huggingface' && (
                       <>
                         <p><strong>1.</strong> Visit the <strong>official Google Gemma 3n repository</strong> on <em>Hugging Face</em></p>
                         <p><strong>2.</strong> Accept the <strong>Gemma license terms</strong></p>
                         <p><strong>3.</strong> Download the <strong>official model files</strong> or GGUF versions</p>
                         <p><strong>4.</strong> Save it to a location you can easily find</p>
                       </>
                     )}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-8">
                      <CardTitle className="text-3xl font-bold">
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription className="text-lg">
            {steps[currentStep].description}
          </CardDescription>

          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          <div className="flex items-center justify-between px-8 pb-8">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="text-muted-foreground"
                >
                  Back
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip
              </Button>
              {currentStep === 0 && (
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3"
                >
                  <span>Try Clarity — 100% Private, Always Yours</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !selectedMethod}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  onClick={handleCompleteOnboarding}
                  className="flex items-center space-x-2"
                >
                  <span>Continue to Model Import</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Onboarding 