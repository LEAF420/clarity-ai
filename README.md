# Clarity: Privacy-First Cognitive Partner

> **Gemma 3n-Only AI Assistant - 100% Offline Processing**

[![Kaggle Competition](https://img.shields.io/badge/Kaggle-Gemma%203n%20Showcase-blue)](https://www.kaggle.com/competitions/gemma-3n-showcase)
[![License](https://img.shields.io/badge/License-Gemma%20Use%20Policy-green)](LICENSES/Gemma_Use_Policy.md)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline-orange)](https://github.com/your-org/clarity)

## 🎯 For Judges - Quick Demo Guide

**Clarity** is a revolutionary cognitive partner that runs entirely on your device using Google's Gemma 3n model. No cloud, no data transmission, no privacy compromises.

### 🚀 3-Minute Demo Setup:
1. **Live Demo**: Visit [https://clarity-ai.netlify.app](https://clarity-ai.netlify.app) (coming soon)
2. **Local Setup**: `git clone [repo] && cd web-ui && npm install && npm run dev`
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Complete Onboarding**: Follow the privacy-first setup flow
5. **Import Model**: Drag-and-drop a Gemma 3n `.gguf` file OR use "Skip to Demo Mode"
6. **Start Chatting**: Try the animated example prompts or voice input

### 🏆 Competition Highlights:
- **Privacy Champion**: Only 100% offline AI assistant in the competition
- **Universal Access**: Works on any device with 4GB+ RAM
- **Cognitive Support**: Specifically designed for communication challenges
- **Verifiable Privacy**: Check Network tab - zero outgoing requests

---

## 📋 Table of Contents
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)
- [Model Setup](#-model-setup)
- [Usage Guide](#-usage-guide)
- [Privacy & Data](#-privacy--data)
- [Ollama Local Mode](#-ollama-local-mode)
- [Documentation](#-documentation)
- [FAQ & Troubleshooting](#-faq--troubleshooting)
- [Credits & Licensing](#-credits--licensing)
- [Contact & Feedback](#-contact--feedback)

## ✨ Features

### **Privacy-First Architecture**
- 🔒 **100% Offline Processing**: All AI inference happens on your device
- 🛡️ **No Data Transmission**: Your conversations never leave your device
- ✅ **Verifiable Privacy**: Check browser Network tab - zero outgoing requests
- 🌐 **Airplane Mode Compatible**: Works completely offline

### **Multiple Inference Modes**
- **Local Model Mode**: Import Gemma 3n `.gguf` files for maximum privacy
- **Ollama Mode**: Connect to local Ollama server for high performance
- **Demo Mode**: Quick testing with OpenRouter API (privacy warning)

### **User Experience**
- 🎯 **Animated Example Prompts**: Interactive carousel with curated communication prompts
- 🎤 **Voice Input**: Speech-to-text with accessibility support
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 📊 **Structured Output**: Confidence-scored suggestions with reasoning
- 📚 **Conversation History**: Search, filter, and export capabilities
- ♿ **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### **Technical Excellence**
- ⚡ **Modern SPA**: React 18 + TypeScript + Vite
- 🎨 **Beautiful UI**: ShadCN UI + Tailwind CSS + Framer Motion
- 🔧 **Robust Architecture**: Zustand state management + React Router
- 🧪 **Comprehensive Testing**: Model verification and integrity checks

## 🔄 How It Works

### **Simple 3-Step Process**
1. **Onboard** → Learn about privacy-first approach and model requirements
2. **Import/Connect** → Choose your preferred mode (local model, Ollama, or demo)
3. **Chat** → Start communicating with confidence-scored suggestions and reasoning

### **Architecture Overview**
```
User Input → Privacy Check → Model Selection → Local Processing → Structured Output
```

- **Local Model Mode**: Gemma 3n runs entirely in your browser
- **Ollama Mode**: Local server provides high-performance inference
- **Demo Mode**: OpenRouter API for quick testing (privacy warning)

---

## 🚀 Getting Started

### **Live Demo**
- **🌐 Netlify Deployment**: [https://clarity-ai.netlify.app](https://clarity-ai.netlify.app) (coming soon)
- **📱 PWA Installable**: Add to home screen on mobile devices
- **🔒 Privacy Verified**: Check Network tab - zero outgoing requests

### **System Requirements**
- **RAM**: 4GB minimum, 8GB+ recommended
- **Storage**: 2GB free space for model files
- **Browser**: Chrome 113+, Edge 113+, Firefox 115+, Safari 16.4+
- **OS**: Windows 10+, macOS 10.15+, Linux

### **Quick Installation**
```bash
# Clone repository
git clone https://github.com/your-org/clarity.git
cd clarity

# Install dependencies
cd web-ui
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### **Production Build**
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Model Setup

### **Option 1: Local Model (Maximum Privacy)**
1. **Download Gemma 3n**: Get from [Hugging Face](https://huggingface.co/ggml-org/gemma-3n-E4B-it-GGUF) or [LM Studio](https://lmstudio.ai/)
2. **Import Model**: Drag-and-drop `.gguf` file into the web interface
3. **Verify**: SHA256 checksum verification ensures model integrity
4. **Start Chatting**: Model runs entirely in your browser

### **Option 2: Ollama Mode (High Performance)**
1. **Install Ollama**: Download from [ollama.com](https://ollama.com/)
2. **Pull Model**: `ollama pull gemma3n:e4b`
3. **Start Server**: `ollama serve`
4. **Connect**: Use "Ollama Mode" in the web interface
5. **Configure**: Server URL: `http://localhost:11434`, Model: `gemma3n:e4b`

### **Option 3: Demo Mode (Quick Testing)**
1. **Skip Model Import**: Click "Skip to Online Demo" during onboarding
2. **API Setup**: Configure OpenRouter API key in `.env` (optional)
3. **Start Chatting**: Uses OpenRouter's Gemma 3n API
4. **⚠️ Privacy Warning**: Data leaves your device in demo mode

### **Environment Variables** (Optional)
```bash
# Create .env file in web-ui directory
VITE_OPENROUTER_API_KEY=your_api_key_here
VITE_OPENROUTER_MODEL=google/gemma-3n-e4b-it:free
VITE_OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
```

## 📖 Usage Guide

### **Chat Interface**
- **Text Input**: Type your communication challenges or questions
- **Voice Input**: Click microphone button for speech-to-text
- **Example Prompts**: Click animated carousel prompts to auto-fill input
- **Structured Output**: View confidence-scored suggestions with reasoning

### **Conversation Management**
- **History View**: Browse past conversations and suggestions
- **Search**: Filter conversations by input text
- **Export**: Download conversation history as JSON
- **Clear**: Remove all stored conversations

### **Privacy Verification**
- **Network Tab**: Check browser dev tools - zero outgoing requests
- **Airplane Mode**: Test full offline functionality
- **Storage Inspection**: Verify local data in IndexedDB

### **Keyboard Shortcuts**
- `Enter`: Send message
- `Shift + Enter`: New line
- `Escape`: Clear input
- `Tab`: Navigate between elements
- `Space`: Activate buttons

### **Accessibility Features**
- **Screen Reader**: Full ARIA support and semantic HTML
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast**: WCAG compliant color schemes
- **Reduced Motion**: Respects user motion preferences

## 🔒 Privacy & Data

### **Privacy Guarantees by Mode**

#### **Local Model Mode (Maximum Privacy)**
- ✅ **100% Offline**: No network requests after model import
- ✅ **Local Processing**: All AI inference happens on your device
- ✅ **No Data Transmission**: Conversations never leave your device
- ✅ **Verifiable**: Check Network tab - zero outgoing requests

#### **Ollama Mode (High Privacy)**
- ✅ **Local Processing**: All inference via local Ollama server
- ✅ **No Cloud Dependencies**: No external API calls
- ✅ **Local Storage**: Conversations stored in browser only
- ✅ **Privacy Verified**: No data leaves your device

#### **Demo Mode (Privacy Warning)**
- ⚠️ **Data Transmission**: Conversations sent to OpenRouter servers
- ⚠️ **API Logging**: Requests may be logged by OpenRouter
- ⚠️ **Internet Required**: Won't work offline
- ⚠️ **Use Only For**: Testing and demonstrations

### **Data Storage**
- **Model Files**: Stored in browser IndexedDB (local model mode)
- **Conversations**: Stored in browser localStorage/IndexedDB
- **Settings**: Stored in browser localStorage
- **No Cloud Storage**: All data remains on your device

### **Data Deletion**
- **App Reset**: Click Clarity logo → Confirm reset
- **Browser Clear**: Clear site data in browser settings
- **Export First**: Download conversations before clearing

For detailed privacy information, see [Privacy Guide](docs/PRIVACY.md).

## ⚙️ Ollama Local Mode

### **Setup Instructions**
1. **Install Ollama**: Download from [ollama.com](https://ollama.com/)
2. **Pull Model**: `ollama pull gemma3n:e4b`
3. **Start Server**: `ollama serve` (keep terminal open)
4. **Connect**: Use "Ollama Mode" in web interface
5. **Configure**: Server URL: `http://localhost:11434`, Model: `gemma3n:e4b`

### **Performance Benefits**
- **Faster Inference**: Local server processing
- **Better Memory Management**: Optimized for large models
- **GPU Acceleration**: Hardware acceleration support
- **High Privacy**: 100% local processing

### **Troubleshooting**
- **Connection Failed**: Ensure `ollama serve` is running
- **Model Not Found**: Run `ollama pull gemma3n:e4b`
- **Port Issues**: Check firewall allows port 11434
- **Memory Issues**: Use smaller model (`gemma3n:e2b`)

For detailed setup instructions, see [Ollama Guide](docs/OLLAMA.md).

## 📚 Documentation

### **For Judges & Quick Start**
- **[📋 FAQ](docs/FAQ.md)** - Common issues, browser compatibility, troubleshooting
- **[🏗️ Architecture](docs/ARCHITECTURE.md)** - System overview, data flow, extensibility
- **[🔒 Privacy](docs/PRIVACY.md)** - Privacy guarantees, data handling, verification
- **[⚙️ Ollama Setup](docs/OLLAMA.md)** - Local AI inference with Ollama

### **For Developers**
- **[🔧 Troubleshooting](docs/TROUBLESHOOTING.md)** - Comprehensive debugging guide
- **[📦 Model Acquisition](docs/MODEL_ACQUISITION.md)** - How to get Gemma 3n models
- **[🧪 Testing Guide](docs/MODEL_IMPORT_TESTING.md)** - Validation and testing procedures

## ❓ FAQ & Troubleshooting

### **Common Issues**

#### **Model Import Fails**
- **File Format**: Ensure `.gguf` extension
- **File Size**: Between 100MB and 15GB
- **Browser Storage**: Clear browser data if quota exceeded
- **Browser Support**: Use Chrome/Edge for best compatibility

#### **Voice Input Not Working**
- **Browser Support**: Chrome/Edge (best), Safari (limited), Firefox (not supported)
- **Permissions**: Allow microphone access when prompted
- **HTTPS Required**: Some browsers require secure connection
- **Fallback**: Use text input if voice doesn't work

#### **Ollama Connection Issues**
- **Server Running**: Ensure `ollama serve` is active
- **Port Access**: Check firewall allows port 11434
- **Model Downloaded**: Run `ollama pull gemma3n:e4b`
- **Network**: Verify localhost connectivity

#### **Performance Issues**
- **Memory**: Close other applications to free RAM
- **Model Size**: Use smaller model (`gemma3n:e2b`) for limited resources
- **Browser**: Update to latest version for WebGPU support
- **Storage**: Ensure sufficient disk space

### **Privacy Verification**
- **Network Tab**: Check browser dev tools for zero outgoing requests
- **Airplane Mode**: Test full offline functionality
- **Storage Inspection**: Verify local data in IndexedDB
- **Demo Mode Warning**: Only use for testing, not sensitive conversations

For detailed troubleshooting, see [FAQ](docs/FAQ.md) and [Troubleshooting Guide](docs/TROUBLESHOOTING.md).

## 🏆 Competition Advantages

### **Unique Value Proposition**
- **Privacy Champion**: Only 100% offline AI assistant in the competition
- **Universal Access**: Works on any device with 4GB+ RAM
- **Cognitive Support**: Specifically designed for communication challenges
- **Verifiable Privacy**: Check Network tab - zero outgoing requests

### **Technical Excellence**
- **Modern SPA**: React 18 + TypeScript + Vite
- **Beautiful UI**: ShadCN UI + Tailwind CSS + Framer Motion
- **Robust Architecture**: Zustand state management + React Router
- **Comprehensive Testing**: Model verification and integrity checks

### **User Experience**
- **Smooth Onboarding**: Privacy-first setup with clear explanations
- **Multiple Modes**: Local model, Ollama, and demo options
- **Accessibility**: WCAG compliant with keyboard navigation
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📄 Credits & Licensing

### **AI Model**
- **Gemma 3n**: Google's Gemma 3n E2B-it/E4B-it models
- **License**: [Gemma Use Policy](LICENSES/Gemma_Use_Policy.md)
- **Attribution**: Google/Gemma for model architecture and training

### **Technology Stack**
- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: ShadCN UI, Tailwind CSS, Lucide Icons
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Voice Input**: Web Speech API
- **Local Storage**: IndexedDB, localStorage

### **Third-Party Services**
- **OpenRouter**: Demo mode API provider
- **Ollama**: Local inference server
- **Hugging Face**: Model distribution platform

### **Competition Submission**
- **Kaggle Gemma 3n Showcase**: [Competition Link](https://www.kaggle.com/competitions/gemma-3n-showcase)
- **Prize Tracks**: Ollama Prize, Edge Prize, Unsloth Prize
- **Submission Category**: Privacy-First AI Assistant

### **Open Source Licenses**
- **Code**: MIT License (open source)
- **Documentation**: Creative Commons
- **Models**: Gemma Use Policy (Google)

## 📞 Contact & Feedback

### **Support Channels**
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check [FAQ](docs/FAQ.md) and [Troubleshooting](docs/TROUBLESHOOTING.md)
- **Community**: Join discussions and get help

### **Competition Feedback**
- **Demo Video**: [Link to demo video] (coming soon)
- **Live Demo**: Available during competition judging
- **Technical Questions**: Contact via GitHub issues

### **Contributing**
We welcome contributions! Please see our contributing guidelines for:
- Code improvements and bug fixes
- Documentation updates
- Feature suggestions
- Accessibility enhancements

## 🚀 Deployment

### **Netlify Deployment (Recommended)**
- **🌐 Live Demo**: [https://clarity-ai.netlify.app](https://clarity-ai.netlify.app) (coming soon)
- **📱 PWA Ready**: Installable on mobile devices
- **🔒 Privacy Verified**: Zero network requests after model import

### **Deployment Steps**
1. **Connect Repository**: Link GitHub repo to Netlify
2. **Configure Build**: Set build command to `npm run build`
3. **Set Environment Variables**: Add OpenRouter API key and settings
4. **Deploy**: Automatic deployment with live updates

### **Environment Variables**
```bash
VITE_OPENROUTER_API_KEY=your_api_key_here
VITE_OPENROUTER_MODEL=google/gemma-3n-e4b-it:free
VITE_OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
VITE_DEMO_MODE_ENABLED=true
VITE_APP_URL=https://your-site-name.netlify.app
```

For detailed deployment instructions, see [web-ui/README.md](web-ui/README.md#deployment).

---

**Built with ❤️ for the Kaggle Gemma 3n Showcase Competition**

*Clarity: Empowering communication through privacy-first AI*

 