# Model Acquisition Guide

> **How to Get the Gemma 3n Model for Clarity**

## 🎯 Overview

Clarity requires the Gemma 3n model to run locally on your device. This guide provides three different methods to obtain the model, suitable for users of different technical skill levels.

## 🔒 Privacy-First Approach

**Why do you need to download a model?**
- Clarity runs 100% on your device for maximum privacy
- No data ever leaves your computer
- No network requests after model import
- Complete offline operation

## 📋 Model Requirements

- **Model**: Gemma 3n E2B-it or E4B-it (GGUF format)
- **Quantization**: Q4_K_M recommended (good balance of size/quality)
- **File Size**: ~1.2GB - 3GB depending on quantization
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 5GB free space

## 🚀 Method 1: LM Studio (Recommended for Beginners)

### Step 1: Download LM Studio
1. Visit [lmstudio.ai](https://lmstudio.ai/)
2. Download the version for your operating system (Mac/Windows/Linux)
3. Install and launch LM Studio

### Step 2: Find the Model
1. In LM Studio, go to the "Search" tab
2. Search for "gemma-3n-e2b-it" or "gemma-3n-e4b-it"
3. Look for models with "Q4_K_M" in the name
4. Click "Download" on your preferred model

### Step 3: Locate the File
**Mac:**
```
~/Library/Application Support/LM Studio/models/
```

**Windows:**
```
%APPDATA%\LM Studio\models\
```

**Linux:**
```
~/.config/LM Studio/models/
```

### Step 4: Import to Clarity
1. Find the `.gguf` file in the models folder
2. Copy it to a location you can easily access
3. Use Clarity's import feature to load the file

## ⚡ Method 2: Ollama (For Developers)

### Step 1: Install Ollama
1. Visit [ollama.com](https://ollama.com/)
2. Download and install Ollama for your platform
3. Open terminal/command prompt

### Step 2: Pull the Model
```bash
# Pull the E4B model (recommended)
ollama pull gemma3n:e4b

# Or pull the E2B model (smaller)
ollama pull gemma3n:e2b
```

### Step 3: Locate the Model File
**Mac/Linux:**
```bash
ls ~/.ollama/models/
```

**Windows:**
```cmd
dir %USERPROFILE%\.ollama\models\
```

### Step 4: Copy and Import
1. Find the `.gguf` file in the Ollama models directory
2. Copy it to your desired location
3. Import it into Clarity

## 🌐 Method 3: Hugging Face (Advanced Users)

### Step 1: Visit the Repository
1. Go to [Hugging Face GGUF Repository](https://huggingface.co/ggml-org/gemma-3n-E4B-it-GGUF)
2. Accept the Gemma license terms if prompted
3. Sign in to your Hugging Face account (free)

### Step 2: Choose Your Quantization
- **Q4_K_M**: Recommended (good balance)
- **Q5_K_M**: Better quality, larger file
- **Q3_K_M**: Smaller file, lower quality

### Step 3: Download
1. Click on your preferred quantization file
2. Click "Download" button
3. Save to a location you can easily find

### Step 4: Import to Clarity
1. Use Clarity's drag-and-drop import feature
2. Or click "Choose File" and select your downloaded `.gguf`

## 🔍 Model Verification

### SHA256 Checksums
For security and integrity verification, here are known SHA256 hashes for popular quantizations:

```
# Add known hashes here as they become available
# gemma-3n-e2b-it-q4_k_m.gguf: [hash]
# gemma-3n-e4b-it-q4_k_m.gguf: [hash]
```

### Verification Process
1. Clarity automatically calculates the SHA256 hash of imported files
2. Compare with known hashes to verify integrity
3. Status will show: "Verified", "Not Verified", or "Error"

## 🛠️ Troubleshooting

### Common Issues

**"File too large" error:**
- Ensure you're downloading a quantized version (Q4_K_M, Q3_K_M, etc.)
- Full models can be 10GB+ and won't work

**"Invalid file type" error:**
- Make sure the file has `.gguf` extension
- Don't rename the file - keep original filename

**"Model not found" error:**
- Check that the file is in a location Clarity can access
- Try moving the file to your Desktop or Documents folder

**"SHA256 verification failed":**
- The file may be corrupted during download
- Try downloading again
- Check your internet connection

### Platform-Specific Issues

**Mac:**
- Ensure you have sufficient disk space
- Check that the file isn't quarantined by Gatekeeper

**Windows:**
- Run as administrator if you encounter permission issues
- Check Windows Defender isn't blocking the file

**Linux:**
- Ensure you have read permissions on the model file
- Check available disk space with `df -h`

## 📱 Mobile Considerations

**Note:** Clarity is designed for desktop use. Mobile devices typically don't have sufficient RAM or storage for local model inference.

## 🔧 Advanced Configuration

### Custom Model Paths
You can specify custom model directories in Clarity settings:

1. Go to Settings in Clarity
2. Click "Model Settings"
3. Add custom model directory paths
4. Restart Clarity to apply changes

### Multiple Models
Clarity supports switching between different models:

1. Import your preferred model
2. Go to Settings > Model Settings
3. Click "Change Model" to import a different one
4. All models are stored locally on your device

## 📚 Additional Resources

- **LM Studio Documentation**: [lmstudio.ai/docs](https://lmstudio.ai/docs)
- **Ollama Documentation**: [ollama.com/docs](https://ollama.com/docs)
- **Hugging Face GGUF**: [huggingface.co/ggml-org](https://huggingface.co/ggml-org)
- **Gemma Model Card**: [huggingface.co/google/gemma-3n-E2B-it](https://huggingface.co/google/gemma-3n-E2B-it)

## 🆘 Getting Help

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Verify your system meets the requirements**
3. **Try a different acquisition method**
4. **Check Clarity's error logs**
5. **Contact support with specific error messages**

## ⚖️ Legal Notice

- Models are subject to Google's Gemma Use Policy
- Clarity does not redistribute model files
- Users must download models themselves
- All processing happens locally on your device
- No data is transmitted to external servers

---

**Happy modeling! 🚀**

*Clarity: Privacy-first cognitive support powered by Gemma 3n* 