# Ollama Setup Guide

> **Local AI Inference with Ollama - Privacy-First Setup**

## 🎯 Overview

Ollama Mode allows you to run Clarity with a local Ollama server, providing **100% local processing** while leveraging Ollama's optimized model management. This guide walks you through setting up Ollama with Gemma 3n for maximum privacy and performance.

## 🚀 Quick Start

### **1. Install Ollama**
Visit [ollama.com](https://ollama.com/) and download the installer for your platform:

**macOS:**
```bash
# Download and install from website
# Or use Homebrew
brew install ollama
```

**Windows:**
```bash
# Download installer from ollama.com
# Run the installer as administrator
```

**Linux:**
```bash
# Download and install
curl -fsSL https://ollama.com/install.sh | sh
```

### **2. Start Ollama Server**
```bash
# Start the Ollama service
ollama serve

# Keep this terminal open - Ollama runs in the background
```

### **3. Download Gemma 3n Model**
```bash
# Choose your preferred model size:
ollama pull gemma3n:e4b    # 7.5GB - Best performance (recommended)
ollama pull gemma3n:e2b    # 5.6GB - Faster, smaller
ollama pull gemma3n:latest # Latest version
```

### **4. Configure Clarity**
1. Open Clarity Web UI
2. Complete onboarding
3. Go to Model Import screen
4. Click "Use Ollama" tab
5. Configure settings:
   - **Server URL**: `http://localhost:11434`
   - **Model Name**: `gemma3n:e4b` (or your chosen model)
6. Click "Test Connection" and "Test Model"
7. Click "Use Ollama" when both tests pass

## ⚙️ Detailed Setup

### **Step 1: System Requirements**

#### **Hardware Requirements**
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space for model
- **CPU**: Multi-core processor (4+ cores recommended)
- **Network**: Local network access (no internet required after setup)

#### **Software Requirements**
- **Ollama**: Latest version from [ollama.com](https://ollama.com/)
- **Browser**: Chrome, Edge, Firefox, or Safari
- **OS**: Windows 10+, macOS 10.15+, or Linux

### **Step 2: Ollama Installation**

#### **macOS Installation**
```bash
# Method 1: Homebrew (recommended)
brew install ollama

# Method 2: Manual installation
# Download from ollama.com and install
```

#### **Windows Installation**
1. Download installer from [ollama.com](https://ollama.com/)
2. Run installer as administrator
3. Follow installation wizard
4. Restart computer if prompted

#### **Linux Installation**
```bash
# Ubuntu/Debian
curl -fsSL https://ollama.com/install.sh | sh

# CentOS/RHEL
curl -fsSL https://ollama.com/install.sh | sh

# Arch Linux
yay -S ollama
```

### **Step 3: Model Selection**

#### **Available Models**
```bash
# E4B Model (Recommended)
ollama pull gemma3n:e4b
# Size: 7.5GB
# Performance: Best quality and reasoning
# Use Case: Production, complex tasks

# E2B Model (Faster)
ollama pull gemma3n:e2b
# Size: 5.6GB
# Performance: Faster inference, good quality
# Use Case: Development, testing, limited RAM

# Latest Model
ollama pull gemma3n:latest
# Size: 7.5GB
# Performance: Latest improvements
# Use Case: Cutting-edge features
```

#### **Model Comparison**
| Model | Size | Speed | Quality | RAM Usage | Use Case |
|-------|------|-------|---------|-----------|----------|
| `gemma3n:e4b` | 7.5GB | Medium | Best | 8GB+ | Production |
| `gemma3n:e2b` | 5.6GB | Fast | Good | 6GB+ | Development |
| `gemma3n:latest` | 7.5GB | Medium | Best | 8GB+ | Latest features |

### **Step 4: Server Configuration**

#### **Start Ollama Server**
```bash
# Start the server (keep terminal open)
ollama serve

# Expected output:
# Starting Ollama server on 0.0.0.0:11434
# Server is running
```

#### **Verify Server Status**
```bash
# Check if server is running
curl http://localhost:11434/api/tags

# Expected output: JSON with available models
```

#### **Automatic Startup (Optional)**
```bash
# macOS: Create launch agent
mkdir -p ~/Library/LaunchAgents
cat > ~/Library/LaunchAgents/com.ollama.serve.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.serve</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Load the launch agent
launchctl load ~/Library/LaunchAgents/com.ollama.serve.plist
```

### **Step 5: Clarity Configuration**

#### **Web UI Setup**
1. **Open Clarity**: Navigate to the web interface
2. **Complete Onboarding**: Follow the initial setup
3. **Model Import Screen**: Click "Use Ollama" tab
4. **Configure Settings**:
   ```
   Server URL: http://localhost:11434
   Model Name: gemma3n:e4b
   ```
5. **Test Connection**: Click "Test Connection" button
6. **Test Model**: Click "Test Model" button
7. **Activate**: Click "Use Ollama" when tests pass

#### **Configuration Options**
- **Server URL**: `http://localhost:11434` (default)
- **Custom Port**: `http://localhost:8080` (if changed)
- **Network Access**: `http://192.168.1.100:11434` (remote server)
- **Model Name**: `gemma3n:e4b`, `gemma3n:e2b`, or `gemma3n:latest`

## 🔧 Troubleshooting

### **Common Issues**

#### **"Connection Failed" Error**
```bash
# 1. Check if Ollama is running
ps aux | grep ollama

# 2. Start Ollama server
ollama serve

# 3. Test connection manually
curl http://localhost:11434/api/tags

# 4. Check firewall settings
# Allow port 11434 in firewall
```

#### **"Model Not Found" Error**
```bash
# 1. List available models
ollama list

# 2. Pull the model if not available
ollama pull gemma3n:e4b

# 3. Verify model download
ollama show gemma3n:e4b
```

#### **"Port Already in Use" Error**
```bash
# 1. Find process using port 11434
lsof -i :11434

# 2. Kill existing process
kill -9 <PID>

# 3. Restart Ollama
ollama serve
```

#### **"Out of Memory" Error**
```bash
# 1. Check available RAM
free -h

# 2. Use smaller model
ollama pull gemma3n:e2b

# 3. Close other applications
# 4. Restart Ollama server
```

### **Performance Issues**

#### **Slow Response Times**
- **Use E2B Model**: `ollama pull gemma3n:e2b`
- **Close Other Apps**: Free up RAM
- **Check CPU Usage**: Monitor system resources
- **Restart Server**: `ollama serve`

#### **High Memory Usage**
- **Monitor RAM**: Use system monitor
- **Use Smaller Model**: Switch to E2B
- **Restart Periodically**: Clear memory cache
- **Check for Leaks**: Monitor Ollama process

### **Network Issues**

#### **Remote Server Setup**
```bash
# On server machine
ollama serve -H 0.0.0.0:11434

# In Clarity configuration
Server URL: http://192.168.1.100:11434
```

#### **Firewall Configuration**
```bash
# macOS
sudo pfctl -e
echo "pass in proto tcp from any to any port 11434" | sudo pfctl -f -

# Linux
sudo ufw allow 11434

# Windows
# Add port 11434 to Windows Firewall
```

## 📊 Performance Optimization

### **Hardware Recommendations**
- **RAM**: 16GB+ for optimal performance
- **CPU**: 8+ cores for faster inference
- **Storage**: SSD for faster model loading
- **GPU**: Optional, Ollama supports GPU acceleration

### **Model Selection Guide**
- **Development**: Use `gemma3n:e2b` for faster iteration
- **Production**: Use `gemma3n:e4b` for best quality
- **Testing**: Use `gemma3n:latest` for latest features
- **Limited Resources**: Use `gemma3n:e2b` for smaller footprint

### **Server Optimization**
```bash
# Set environment variables for better performance
export OLLAMA_HOST=0.0.0.0:11434
export OLLAMA_ORIGINS=*
export OLLAMA_MODELS=/path/to/models

# Start with optimized settings
ollama serve --verbose
```

## 🔒 Security Considerations

### **Local Network Security**
- **Firewall**: Configure firewall to restrict access
- **Network Isolation**: Use isolated network if needed
- **Access Control**: Limit who can access the server
- **Monitoring**: Monitor network traffic

### **Model Security**
- **Local Storage**: Models stored locally only
- **No Cloud Sync**: No automatic model synchronization
- **Verification**: SHA256 verification for model integrity
- **Updates**: Manual model updates only

### **Privacy Guarantees**
- ✅ **100% Local**: All processing on your device
- ✅ **No Data Transmission**: Conversations never leave device
- ✅ **No Cloud Dependencies**: No external services
- ✅ **Verifiable**: Check Network tab for zero requests

## 📋 Quick Reference

### **Essential Commands**
```bash
# Start server
ollama serve

# List models
ollama list

# Pull model
ollama pull gemma3n:e4b

# Run model
ollama run gemma3n:e4b

# Stop server
pkill ollama
```

### **Configuration Settings**
```
Server URL: http://localhost:11434
Model Name: gemma3n:e4b
Timeout: 30 seconds
Retry: 3 attempts
```

### **Troubleshooting Checklist**
- [ ] Ollama server running (`ollama serve`)
- [ ] Model downloaded (`ollama list`)
- [ ] Port 11434 accessible (`curl localhost:11434`)
- [ ] Firewall allows port 11434
- [ ] Sufficient RAM available (8GB+)
- [ ] Clarity configuration correct

## ❓ FAQ

### **Q: How do I stop the Ollama server?**
**A:** Press `Ctrl+C` in the terminal where `ollama serve` is running, or use `pkill ollama`

### **Q: Can I use multiple models?**
**A:** Yes, pull multiple models and switch between them in Clarity's settings

### **Q: How much RAM does Ollama use?**
**A:** Depends on model size - E4B uses ~8GB, E2B uses ~6GB

### **Q: Can I run Ollama on a different machine?**
**A:** Yes, configure Clarity to connect to the remote server IP

### **Q: How do I update models?**
**A:** Use `ollama pull gemma3n:latest` to get the latest version

### **Q: Is Ollama mode more private than Demo mode?**
**A:** Yes, Ollama mode is 100% local while Demo mode sends data to external servers

### **Q: Can I use other models besides Gemma 3n?**
**A:** Yes, but Clarity is optimized for Gemma 3n. Other models may work but aren't tested

---

**Ollama Status**: ✅ **Production Ready**  
**Last Updated**: 2024-01-XX  
**Privacy Level**: ✅ **100% Local Processing** 