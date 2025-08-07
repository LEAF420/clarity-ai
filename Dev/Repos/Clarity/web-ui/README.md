# Clarity Web UI

> **Privacy-First Cognitive Partner - Modern SPA Interface**

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

## 🎯 Overview

Clarity Web UI is a modern Single Page Application (SPA) that provides a beautiful, accessible interface for the Clarity cognitive partner. Built with React, TypeScript, ShadCN UI, and Lucide icons, it offers a seamless user experience while maintaining the core privacy-first principles.

## 🚀 Features

### **Privacy-First Architecture**
- ✅ **100% Offline**: No network requests after model import
- ✅ **Local Processing**: All AI processing happens on your device
- ✅ **Verifiable Privacy**: Check browser Network tab - zero outgoing requests

### **Modern UI/UX**
- ✅ **ShadCN UI**: Consistent, accessible components
- ✅ **Framer Motion**: Smooth animations and transitions
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Voice Input**: Speech-to-text with accessibility support

### **User Experience**
- ✅ **Onboarding Flow**: Clear privacy explanation and model setup
- ✅ **Model Import**: Drag-and-drop with progress tracking
- ✅ **Structured Output**: Confidence-scored suggestions with reasoning
- ✅ **Conversation History**: Review and export past conversations

## 🛠️ Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **ShadCN UI** + **Tailwind CSS** + **Lucide Icons**
- **Zustand** (state management) + **React Router**
- **Framer Motion** (animations)

## 📦 Installation

```bash
cd web-ui
npm install
npm run dev
```

## 🎯 Usage

1. **Onboarding**: Complete privacy-first setup
2. **Model Import**: Drag-and-drop Gemma 3n model file
3. **Chat**: Text/voice input with structured suggestions
4. **History**: Review and export conversations

## 🔧 Development

### **Key Components**
- **Onboarding.tsx**: Multi-step privacy-first setup
- **ModelImport.tsx**: Drag-and-drop with SHA256 verification
- **ChatInterface.tsx**: Text/voice input with structured output
- **HistoryView.tsx**: Conversation management and export

### **State Management**
- **Zustand stores**: Model, conversation, and toast state
- **localStorage**: Persistence for user preferences
- **IndexedDB**: Model file storage and conversation history

## 🔒 Privacy & Security

- **100% Offline**: No network requests after model import
- **Local Storage**: All data in browser localStorage/IndexedDB
- **SHA256 Verification**: Model file integrity checks
- **Verifiable**: Check Network tab - zero outgoing requests

## 🎨 Design System

- **ShadCN UI**: Consistent component library
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Responsive**: Mobile-first design

## 🚀 Performance

- **Vite**: Fast development and optimized builds
- **Code Splitting**: Lazy-loaded components
- **Production**: ~500KB bundle size

## 🧪 Testing

```bash
npm run dev
# Test in Chrome, Firefox, Safari, Edge
# Test responsive design and accessibility
```

## 📱 Browser Support

- **Chrome 113+**: Full support with WebGPU
- **Edge 113+**: Full support with WebGPU
- **Firefox 115+**: Limited WebGPU support
- **Safari 16.4+**: Limited WebGPU support

## 🔧 Configuration

- **Vite**: Fast development and optimized builds
- **TypeScript**: Strict type checking
- **ESLint**: Code quality and consistency

## 📚 API Integration

Currently offline-only. Future integration with Python inference engine planned.

## 🎯 Competition Features

- **Privacy-First**: Unique 100% offline approach
- **Modern SPA**: React + TypeScript + Vite
- **Accessibility**: WCAG compliant design
- **User Experience**: Smooth onboarding and clear interface

## 🚀 Deployment

### **Netlify Deployment (Recommended)**

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com) and sign up/login
   - Click "New site from Git" → "GitHub"
   - Select your Clarity repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   - In Netlify dashboard, go to Site settings → Environment variables
   - Add the following variables:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   VITE_OPENROUTER_MODEL=google/gemma-3n-e4b-it:free
   VITE_OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
   VITE_DEMO_MODE_ENABLED=true
   VITE_APP_URL=https://your-site-name.netlify.app
   ```

3. **Deploy**
   - Netlify will automatically build and deploy your site
   - Your site will be available at `https://your-site-name.netlify.app`

### **Other Platforms**

```bash
npm run build
# Deploy dist/ folder to any static host (Vercel, GitHub Pages, etc.)
```

### **Local Testing**

```bash
npm run build
npm run preview
# Test at http://localhost:4173
```

### **Troubleshooting Netlify Deployment**

**Build Fails**
- Ensure all dependencies are in `package.json`
- Check that `npm run build` works locally
- Verify Node.js version (use 18+ in Netlify settings)

**Blank Page / 404 Errors**
- Check that `netlify.toml` is in the root of `web-ui/`
- Verify SPA redirects are working
- Check browser console for JavaScript errors

**Environment Variables Not Working**
- Ensure all variables are prefixed with `VITE_`
- Check Netlify environment variable settings
- Redeploy after adding environment variables

**PWA Not Installing**
- Verify `manifest.json` is accessible
- Check that all icon files exist in `/public`
- Test on HTTPS (required for PWA installation)

## 📄 License

Licensed under the [Gemma Use Policy](LICENSES/Gemma_Use_Policy.md).

---

**Built with ❤️ for the Kaggle Gemma 3n Showcase Competition**

*Clarity Web UI: Empowering communication through privacy-first AI*