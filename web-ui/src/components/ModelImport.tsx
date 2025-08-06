import React, { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, File, CheckCircle, AlertCircle, Shield, Hash, Info, X, RefreshCw } from 'lucide-react'

// Import brand icons
import OllamaIcon from '@/assets/brands/ollama.svg'
import GemmaIcon from '@/assets/brands/gemma.svg'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useModelStore } from '@/stores/model-store'
import { useOllamaStore } from '@/stores/ollama-store'
import { formatFileSize } from '@/lib/utils'
import { KNOWN_MODEL_HASHES, UI_MESSAGES } from '@/lib/constants'


interface ModelImportProps {
  onImportSuccess: () => void
  onBack?: () => void
  onSkip?: () => void
}

const ModelImport: React.FC<ModelImportProps> = ({ onImportSuccess, onBack, onSkip }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { toast } = useToast()
  const { modelStatus, importModel, resetModel } = useModelStore()
  const { 
    ollamaStatus, 
    updateConfig, 
    testConnection, 
    testModel, 
    setOllamaMode 
  } = useOllamaStore()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFileSelect(files[0])
    }
  }, [])

  const handleFileSelect = async (file: File) => {
    // Reset previous state
    setSelectedFile(null)
    
    try {
      // Basic validation
      if (!file.name.endsWith('.gguf')) {
        toast({
          title: "Invalid file type",
          description: UI_MESSAGES.INVALID_FILE_TYPE,
          variant: "destructive"
        })
        return
      }

      if (file.size < 100 * 1024 * 1024) { // 100MB minimum
        toast({
          title: "File too small",
          description: "Please select a valid model file (minimum 100MB)",
          variant: "destructive"
        })
        return
      }

      if (file.size > 15 * 1024 * 1024 * 1024) { // 15GB maximum
        toast({
          title: "File too large",
          description: UI_MESSAGES.FILE_TOO_LARGE,
          variant: "destructive"
        })
        return
      }

      // Check for duplicate import
      if (modelStatus.isImported && modelStatus.fileName === file.name && modelStatus.fileSize === file.size) {
        toast({
          title: "Model already imported",
          description: "This model file has already been imported and verified. No action needed.",
        })
        return
      }

      // Set selected file for preview
      setSelectedFile(file)
    } catch (error) {
      toast({
        title: "File selection failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      })
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a model file first",
        variant: "destructive"
      })
      return
    }
    
    setIsImporting(true)
    
    try {
      await importModel(selectedFile)
      
      const isVerified = modelStatus.verificationStatus === 'verified'
      const knownModel = KNOWN_MODEL_HASHES[modelStatus.sha256 || '']
      
      toast({
        title: "Model imported successfully!",
        description: isVerified 
          ? `Model verified: ${knownModel?.name || 'Unknown model'}`
          : UI_MESSAGES.IMPORT_UNVERIFIED,
      })
      
      onImportSuccess()
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : UI_MESSAGES.IMPORT_ERROR,
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileSelect(file)
    }
  }



  const handleReset = async () => {
    try {
      await resetModel()
      setSelectedFile(null)
      toast({
        title: "Model reset",
        description: "You can now import a new model file.",
      })
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "Failed to reset model. Please refresh the page.",
        variant: "destructive"
      })
    }
  }

  const getVerificationBadge = () => {
    if (!modelStatus.sha256) return null
    
    const isVerified = modelStatus.verificationStatus === 'verified'
    const knownModel = KNOWN_MODEL_HASHES[modelStatus.sha256]
    
    if (isVerified && knownModel) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified: {knownModel.name}
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary">
          <Info className="h-3 w-3 mr-1" />
          Unverified Model
        </Badge>
      )
    }
  }

  // Ollama handlers
  const handleOllamaConfigChange = (field: 'serverUrl' | 'modelName', value: string) => {
    const newServerUrl = field === 'serverUrl' ? value : ollamaStatus.serverUrl
    const newModelName = field === 'modelName' ? value : ollamaStatus.modelName
    updateConfig(newServerUrl, newModelName)
  }

  const handleTestConnection = async () => {
    try {
      const result = await testConnection()
      if (result.connected) {
        toast({
          title: "Connection successful",
          description: "Ollama server is running and accessible.",
        })
      } else {
        toast({
          title: "Connection failed",
          description: result.error || "Could not connect to Ollama server.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Connection test failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    }
  }

  const handleTestModel = async () => {
    try {
      const result = await testModel()
      if (result.available) {
        toast({
          title: "Model test successful",
          description: "Ollama model is available and ready to use.",
        })
      } else {
        toast({
          title: "Model test failed",
          description: result.error || "Could not test Ollama model.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Model test failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    }
  }

  const handleUseOllama = () => {
    if (!ollamaStatus.isConnected) {
      toast({
        title: "Not connected",
        description: "Please test the connection first.",
        variant: "destructive"
      })
      return
    }

    if (!ollamaStatus.isModelAvailable) {
      toast({
        title: "Model not available",
        description: "Please test the model first.",
        variant: "destructive"
      })
      return
    }

    setOllamaMode(true)
    onImportSuccess()
    toast({
      title: "Ollama mode enabled",
      description: "You're now using Clarity with local Ollama inference.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <img src={GemmaIcon} alt="Gemma" className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Import Model
            </CardTitle>
            <CardDescription className="text-lg">
              Import your Gemma 3n model file to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs defaultValue="ollama" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ollama" className="flex items-center space-x-2">
                  <img src={OllamaIcon} alt="Ollama" className="h-4 w-4" />
                  <span>Run Locally with Ollama</span>
                </TabsTrigger>
                <TabsTrigger value="import" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Import Model</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ollama" className="space-y-4">
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <img src={OllamaIcon} alt="Ollama" className="h-5 w-5" />
                      <span>Run Locally with Ollama</span>
                    </CardTitle>
                    <CardDescription>
                      Connect to a local Ollama server for 100% offline inference
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ollama Server URL</label>
                        <Input
                          value={ollamaStatus.serverUrl}
                          onChange={(e) => handleOllamaConfigChange('serverUrl', e.target.value)}
                          placeholder="http://localhost:11434"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Model Name</label>
                        <Input
                          value={ollamaStatus.modelName}
                          onChange={(e) => handleOllamaConfigChange('modelName', e.target.value)}
                          placeholder="gemma3n:latest"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleTestConnection}
                        className="flex-1"
                      >
                        Test Connection
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleTestModel}
                        className="flex-1"
                        disabled={!ollamaStatus.isConnected}
                      >
                        Test Model
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          ollamaStatus.isConnected ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm">
                          {ollamaStatus.isConnected ? 'Connected' : 'Not connected'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          ollamaStatus.isModelAvailable ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm">
                          {ollamaStatus.isModelAvailable ? 'Model ready' : 'Model not found'}
                        </span>
                      </div>
                    </div>

                    {ollamaStatus.lastError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-800">
                          <strong>Error:</strong> {ollamaStatus.lastError}
                        </p>
                      </div>
                    )}

                    <Button
                      variant="default"
                      onClick={handleUseOllama}
                      disabled={!ollamaStatus.isConnected || !ollamaStatus.isModelAvailable}
                      className="w-full"
                    >
                      Use Ollama
                    </Button>

                    <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                      <p>• <strong>100% Local:</strong> All inference runs on your device</p>
                      <p>• <strong>No Upload:</strong> No files uploaded to any server</p>
                      <p>• <strong>Privacy First:</strong> Data never leaves your device</p>
                      <p>• <strong>Ollama Prize:</strong> Official mode for Ollama Prize submission</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="import" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <span>Import Model</span>
                    </CardTitle>
                    <CardDescription>
                      Select and import your Gemma 3n model file for 100% offline processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* File Selection */}
                      {!selectedFile && (
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            isDragOver 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted-foreground/25 hover:border-primary/50'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">
                            Drop your model file here
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            or click to browse files
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isImporting}
                          >
                            <File className="h-4 w-4 mr-2" />
                            Choose File
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".gguf"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                        </div>
                      )}

                      {/* Selected File Preview */}
                      {selectedFile && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3"
                        >
                          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <File className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">{selectedFile.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatFileSize(selectedFile.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFile(null)}
                              disabled={isImporting}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              onClick={handleImport}
                              disabled={isImporting}
                              className="flex-1"
                            >
                              {isImporting ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Importing...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Import Model
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Progress */}
                      {isImporting && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span>Importing model...</span>
                            <span>{modelStatus.importProgress}%</span>
                          </div>
                          <Progress value={modelStatus.importProgress} />
                          <p className="text-xs text-muted-foreground">
                            This may take a few minutes. Please don't close the browser.
                          </p>
                        </motion.div>
                      )}

                      {/* Error */}
                      {modelStatus.error && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                        >
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-destructive">{modelStatus.error}</span>
                        </motion.div>
                      )}

                      {/* Success */}
                      {modelStatus.isImported && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-800">Model imported successfully!</p>
                              <p className="text-xs text-green-600">
                                {modelStatus.fileName} ({formatFileSize(modelStatus.fileSize || 0)})
                              </p>
                            </div>
                            {getVerificationBadge()}
                          </div>
                          
                          {modelStatus.sha256 && (
                            <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                              <Hash className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-blue-800">SHA256 Verification</p>
                                <p className="text-xs text-blue-600 font-mono">
                                  {modelStatus.sha256.substring(0, 16)}...
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              onClick={handleReset}
                              className="flex-1"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reset Model
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Privacy Guarantee */}
                      <div className="border-t pt-4">
                        <div className="flex items-start space-x-3">
                          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="space-y-2">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Privacy Guarantee</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Once imported, the model runs entirely on your device. No data is ever transmitted to external servers.
                            </p>
                            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                              <p>• <strong>100% Offline:</strong> Model stored in your browser's IndexedDB</p>
                              <p>• <strong>No Upload:</strong> File never leaves your device</p>
                              <p>• <strong>No Tracking:</strong> No analytics or data collection</p>
                              <p>• <strong>Verifiable:</strong> Check Network tab - zero requests during import</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between space-x-3 pt-4">
              {onBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  disabled={isImporting}
                >
                  Back
                </Button>
              )}
              {onSkip && (
                <div className="text-right">
                  <Button
                    variant="default"
                    onClick={() => {
                      // Skip to main app
                      onSkip()
                    }}
                    disabled={isImporting}
                  >
                    Skip to Online Demo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requires internet, data leaves your device
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ModelImport 