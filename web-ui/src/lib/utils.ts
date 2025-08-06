import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatConfidence(confidence: string): string {
  if (confidence.includes('%')) {
    return confidence
  }
  
  const confidenceMap: Record<string, string> = {
    'low': '25%',
    'medium': '50%',
    'high': '75%'
  }
  
  return confidenceMap[confidence.toLowerCase()] || confidence
}

export function getConfidenceColor(confidence: string): string {
  const confidenceValue = confidence.toLowerCase()
  
  if (confidenceValue.includes('high') || confidenceValue.includes('75%') || confidenceValue.includes('8') || confidenceValue.includes('9')) {
    return 'text-green-600 bg-green-100'
  } else if (confidenceValue.includes('medium') || confidenceValue.includes('50%') || confidenceValue.includes('5') || confidenceValue.includes('6') || confidenceValue.includes('7')) {
    return 'text-yellow-600 bg-yellow-100'
  } else {
    return 'text-red-600 bg-red-100'
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function calculateSHA256(file: File): Promise<string> {
  console.log('=== SHA256 CALCULATION START ===')
  console.log('Calculating SHA256 for file:', { name: file.name, size: file.size })
  
  return new Promise((resolve, reject) => {
    console.log('Creating FileReader...')
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        console.log('File read completed, calculating hash...')
        const buffer = e.target?.result as ArrayBuffer
        console.log('Buffer size:', buffer.byteLength, 'bytes')
        
        console.log('Using crypto.subtle.digest...')
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
        console.log('Hash buffer size:', hashBuffer.byteLength, 'bytes')
        
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        
        console.log('✅ SHA256 calculated successfully:', hashHex.substring(0, 16) + '...')
        console.log('=== SHA256 CALCULATION COMPLETE ===')
        resolve(hashHex)
      } catch (error) {
        console.error('❌ SHA256 calculation failed:', error)
        reject(error)
      }
    }
    
    reader.onerror = () => {
      console.error('❌ FileReader error during SHA256 calculation:', reader.error)
      reject(new Error('Failed to read file'))
    }
    
    console.log('Starting FileReader.readAsArrayBuffer for SHA256...')
    reader.readAsArrayBuffer(file)
  })
} 