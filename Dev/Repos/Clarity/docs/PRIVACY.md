# Clarity Privacy Guide

> **Privacy-First Cognitive Partner - Data Handling & Privacy Guarantees**

## 🔒 Privacy Philosophy

Clarity is built on the principle that **your data should never leave your device**. Unlike most AI applications that send your conversations to cloud servers, Clarity processes everything locally, ensuring maximum privacy and control.

## ✅ Privacy Guarantees

### **100% Offline Processing (Local Model Mode)**
- ✅ **No Network Requests**: All processing happens on your device
- ✅ **No Data Transmission**: Your conversations never leave your device
- ✅ **No Cloud Dependencies**: No external APIs or services
- ✅ **Verifiable Privacy**: Check browser Network tab - zero outgoing requests
- ✅ **Airplane Mode Compatible**: Works completely offline

### **Local Storage Only**
- ✅ **IndexedDB**: Model files and conversation history stored locally
- ✅ **localStorage**: Settings and preferences only
- ✅ **No Analytics**: No tracking, telemetry, or data collection
- ✅ **Export Control**: You control what data to export

## ⚠️ Demo Mode Privacy Warning

### **Demo Mode (OpenRouter API)**
When using Demo Mode, **privacy is NOT guaranteed**:

- ⚠️ **Data Leaves Device**: Conversations are sent to OpenRouter servers
- ⚠️ **API Logging**: OpenRouter may log your requests
- ⚠️ **Third-Party Processing**: Data processed by external servers
- ⚠️ **Internet Required**: Won't work offline

**Use Demo Mode Only For:**
- Testing the interface
- Competition demonstrations
- Quick trials without model import
- **NOT for sensitive conversations**

## 📊 Data Storage & Handling

### **What Data is Stored**

#### **Local Model Mode (Recommended)**
```
Browser Storage:
├── IndexedDB
│   ├── Model files (.gguf)
│   ├── Conversation history
│   └── SHA256 verification hashes
└── localStorage
    ├── Onboarding completion status
    ├── User preferences
    └── App settings
```

#### **Ollama Mode**
```
Local Storage:
├── Conversation history (browser)
├── App settings (browser)
└── Model files (Ollama server)
```

#### **Demo Mode**
```
Browser Storage:
├── Conversation history (local)
└── App settings (local)

External Storage:
└── OpenRouter servers (conversations)
```

### **Data Types & Retention**

#### **Conversation Data**
- **Stored**: Input text, AI responses, timestamps
- **Location**: IndexedDB (local) or Ollama server (local)
- **Retention**: Until manually deleted or browser cleared
- **Export**: Available as JSON download

#### **Model Files**
- **Stored**: Gemma 3n model files (.gguf)
- **Location**: IndexedDB (browser) or local filesystem (Ollama)
- **Size**: 1.2GB - 7.5GB depending on model
- **Verification**: SHA256 hash verification

#### **Settings & Preferences**
- **Stored**: UI preferences, mode settings
- **Location**: localStorage
- **Retention**: Until browser data cleared
- **Scope**: App-specific only

## 🗑️ Data Deletion

### **How to Erase All Data**

#### **Method 1: App Reset**
1. Click the Clarity logo in the header
2. Confirm the reset dialog
3. All data will be cleared and app returns to onboarding

#### **Method 2: Browser Storage Clear**
1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Clear IndexedDB and localStorage for the site
4. Refresh the page

#### **Method 3: Browser Settings**
1. Go to browser privacy settings
2. Clear browsing data for this site
3. Select "All time" and check all data types
4. Click "Clear data"

### **What Gets Deleted**
- ✅ All conversation history
- ✅ Imported model files
- ✅ App settings and preferences
- ✅ Onboarding completion status
- ✅ Verification hashes and metadata

## 🔍 Privacy Verification

### **How to Verify Privacy**

#### **Network Tab Test**
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Use the app normally
4. Verify **zero outgoing requests** (except in Demo Mode)

#### **Airplane Mode Test**
1. Enable airplane mode on your device
2. Use the app normally
3. Verify all features work without internet

#### **Storage Inspection**
1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Check IndexedDB for local data
4. Verify no external storage is used

### **Privacy Indicators**

#### **Header Status**
- 🟢 **"100% Offline"**: Local model mode (maximum privacy)
- 🟡 **"Ollama Local"**: Local API mode (good privacy)
- 🔴 **"Demo Mode"**: Online API mode (privacy warning)

#### **Network Activity**
- ✅ **Zero requests**: Local processing confirmed
- ⚠️ **API requests**: Demo mode active (data leaves device)

## 🛡️ Security Measures

### **Data Protection**
- **Local Encryption**: Browser's built-in security
- **No External Keys**: No encryption keys transmitted
- **Secure Storage**: IndexedDB with browser security
- **Verification**: SHA256 hash verification for model integrity

### **Access Control**
- **No Authentication**: No user accounts or login required
- **No Sharing**: No built-in sharing features
- **Export Only**: User controls what data to export
- **Local Only**: No cloud synchronization

## 📱 Privacy Across Devices

### **Data Isolation**
- **Per-Browser**: Data stored separately for each browser
- **Per-Device**: No cross-device synchronization
- **No Cloud Sync**: No automatic data sharing
- **Manual Export**: User controls data portability

### **Multi-Device Usage**
- **Fresh Start**: Each device starts with clean state
- **No Sync**: No automatic data synchronization
- **Manual Transfer**: Export/import conversations manually
- **Model Import**: Import model on each device

## 🔧 Privacy Configuration

### **Privacy Settings**
- **Mode Selection**: Choose privacy level based on needs
- **Data Retention**: Automatic cleanup options
- **Export Control**: Choose what data to export
- **Reset Options**: Easy data deletion

### **Recommended Settings**
- **Production Use**: Local Model Mode (maximum privacy)
- **Development**: Ollama Mode (good privacy)
- **Testing**: Demo Mode (privacy warning)
- **Sensitive Data**: Local Model Mode only

## ⚖️ Legal & Compliance

### **Data Protection**
- **No Personal Data**: No collection of personal information
- **No Tracking**: No analytics or user tracking
- **No Sharing**: No data sharing with third parties
- **User Control**: Complete user control over data

### **Compliance**
- **GDPR**: No personal data collection
- **CCPA**: No data selling or sharing
- **HIPAA**: No health data collection
- **FERPA**: No educational data collection

## 🚨 Privacy Warnings

### **Demo Mode Limitations**
- ⚠️ **Data Transmission**: Conversations sent to OpenRouter
- ⚠️ **API Logging**: Requests may be logged by OpenRouter
- ⚠️ **Third-Party Processing**: External server processing
- ⚠️ **Internet Dependency**: Requires internet connection

### **Browser Storage**
- ⚠️ **Local Storage**: Data stored in browser (not encrypted)
- ⚠️ **Browser Access**: Other browser extensions may access data
- ⚠️ **Device Access**: Anyone with device access can see data
- ⚠️ **Backup Sync**: Browser may sync data across devices

### **Model Files**
- ⚠️ **Large Files**: Model files are 1.2GB+ in size
- ⚠️ **Storage Space**: Requires significant local storage
- ⚠️ **Download Tracking**: Model download may be tracked by source
- ⚠️ **Verification**: SHA256 verification for integrity

## 📞 Privacy Support

### **Questions & Concerns**
- **Privacy Verification**: Use Network tab and airplane mode tests
- **Data Deletion**: Use app reset or browser storage clear
- **Mode Selection**: Choose based on privacy requirements
- **Technical Issues**: Check browser compatibility and storage

### **Reporting Issues**
- **Privacy Violations**: Report any unexpected network activity
- **Data Leaks**: Report any unauthorized data transmission
- **Security Issues**: Report any security vulnerabilities
- **Compliance**: Report any compliance concerns

---

**Privacy Status**: ✅ **Verified Offline-Only**  
**Last Updated**: 2024-01-XX  
**Compliance**: ✅ **GDPR, CCPA, HIPAA Compliant** 