# Clarity Troubleshooting Guide

This guide helps you resolve common issues when using Clarity, the Gemma 3n-only cognitive partner.

## 🚨 Common Issues

### Web UI Model Import Issues

#### Silent Failures (Nothing happens after file selection)

**Symptoms**: File appears selected but no import starts, no error messages

**Debug Steps**:
1. **Open Developer Tools** (F12) and go to Console tab
2. **Select a file** and watch for console messages
3. **Look for error messages** in red text
4. **Check for missing logs** - should see "=== FILE SELECTION START ==="

**Common Causes**:
- **File API not supported**: Try a different browser
- **Storage quota exceeded**: Clear browser storage
- **File too large**: Browser can't handle the file size
- **Corrupted file**: Try downloading the file again

**Solutions**:
```javascript
// Check browser console for these messages:
"=== FILE SELECTION START ==="  // Should appear
"File object:"                  // Should show file details
"Validating file type..."       // Should appear
"✅ File validated and ready for import"  // Should appear
```

#### File Validation Errors

**"Invalid file type"**
- Ensure file has `.gguf` extension
- Check file name doesn't have extra extensions

**"File too small"**
- Model files should be at least 100MB
- Check if file was downloaded completely

**"File too large"**
- Files must be under 15GB
- Try a smaller quantization of the model

#### Storage Quota Errors

**"Storage quota exceeded"**
- Clear browser storage: Settings → Privacy → Clear browsing data
- Try a different browser
- Check available disk space on device

**Debug Storage**:
```javascript
// In browser console:
navigator.storage.estimate().then(console.log)
```

#### SHA256 Calculation Errors

**"Failed to read file"**
- File may be corrupted
- Browser doesn't support large files
- Try a smaller file first

**Debug Hash Calculation**:
```javascript
// Check console for:
"=== SHA256 CALCULATION START ==="
"Buffer size: [number] bytes"
"✅ SHA256 calculated successfully"
```

#### IndexedDB Storage Errors

**"IndexedDB store error"**
- Browser storage is full
- IndexedDB not supported
- Try Chrome or Edge

**Debug Storage**:
```javascript
// Check console for:
"=== INDEXEDDB STORE START ==="
"✅ IndexedDB opened successfully"
"✅ Model stored successfully in IndexedDB"
```

### CLI Model-Related Issues

#### "Model not found" Error
```bash
❌ Model not found: models/gemma-3n-e2b-it-q4_k_m.gguf
```

**Solutions:**
1. **Download the model:**
   ```bash
   python scripts/download_model.py
   ```

2. **Check file location:**
   ```bash
   ls -la models/
   ```

3. **Verify file name:**
   ```bash
   # Should be exactly: gemma-3n-e2b-it-q4_k_m.gguf
   ls models/gemma-3n-e2b-it-q4_k_m.gguf
   ```

4. **Manual download:**
   - Visit Hugging Face
   - Search for "gemma-3n-2b-it GGUF"
   - Download the Q4_K_M variant
   - Place in `models/` directory

#### "Model integrity check failed" Error
```bash
❌ Model integrity check failed
Expected: a1b2c3d4e5f6...
Actual:   x1y2z3a4b5c6...
```

**Solutions:**
1. **Re-download the model** - File may be corrupted
2. **Update expected hash** - Edit `inference.py` with correct SHA256
3. **Check file size** - Should be ~1.2GB
4. **Verify download source** - Use trusted repositories

#### "Out of memory" Error
```bash
RuntimeError: CUDA out of memory
```

**Solutions:**
1. **Close other applications** - Free up RAM
2. **Restart the application**
3. **Use CPU mode** - Edit `inference.py` to force CPU
4. **Reduce model size** - Try smaller quantization
5. **Check system requirements:**
   ```bash
   # Check available RAM
   free -h
   
   # Check GPU memory
   nvidia-smi
   ```

### Audio Processing Issues

#### "Audio file not found" Error
```bash
❌ Audio file not found: samples/sample_audio.wav
```

**Solutions:**
1. **Check file exists:**
   ```bash
   ls -la samples/
   ```

2. **Create sample audio:**
   ```bash
   # Record a test file
   ffmpeg -f avfoundation -i ":0" -ar 16000 samples/sample_audio.wav
   ```

3. **Use your own audio:**
   ```bash
   python inference.py --audio /path/to/your/audio.wav
   ```

#### "Unsupported audio format" Error
```bash
❌ Error processing audio: Unsupported format
```

**Solutions:**
1. **Convert to WAV format:**
   ```bash
   ffmpeg -i input.mp3 -ar 16000 output.wav
   ```

2. **Check audio specifications:**
   - Format: WAV
   - Sample rate: 16kHz
   - Channels: Mono (preferred)
   - Duration: < 30 seconds

3. **Use librosa for conversion:**
   ```python
   import librosa
   audio, sr = librosa.load('input.mp3', sr=16000)
   librosa.output.write_wav('output.wav', audio, sr)
   ```

### System Requirements Issues

#### "Insufficient RAM" Warning
```bash
⚠️  Warning: Only 2.5GB RAM available. Minimum 4GB recommended.
```

**Solutions:**
1. **Close unnecessary applications**
2. **Restart your computer**
3. **Use smaller model variant**
4. **Upgrade RAM if possible**

#### "WebGPU not supported" Error
```bash
❌ WebGPU not supported in this browser
```

**Solutions:**
1. **Update browser:**
   - Chrome: Version 113+
   - Edge: Version 113+
   - Firefox: Not yet supported

2. **Enable hardware acceleration:**
   - Chrome: Settings → Advanced → System → Hardware acceleration
   - Edge: Settings → System and performance → Hardware acceleration

3. **Update GPU drivers:**
   ```bash
   # Linux
   sudo apt update && sudo apt upgrade
   
   # Windows
   # Download latest drivers from manufacturer
   ```

### Performance Issues

#### Slow Response Times
```bash
# Taking more than 10 seconds for responses
```

**Solutions:**
1. **Check system resources:**
   ```bash
   # Monitor CPU and RAM usage
   htop
   ```

2. **Optimize settings:**
   - Reduce `max_length` in `inference.py`
   - Lower `temperature` for faster responses
   - Use smaller model variant

3. **Close background applications**
4. **Use SSD storage** for faster model loading

#### High Memory Usage
```bash
# Using more than 4GB RAM
```

**Solutions:**
1. **Monitor memory usage:**
   ```bash
   # Check memory usage
   ps aux | grep python
   ```

2. **Optimize model loading:**
   - Use `device_map="auto"` for better memory management
   - Consider CPU-only mode for lower memory usage

3. **Batch processing:**
   - Process one request at a time
   - Clear memory between requests

### Dependency Issues

#### "Module not found" Errors
```bash
ModuleNotFoundError: No module named 'transformers'
```

**Solutions:**
1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv clarity_env
   source clarity_env/bin/activate  # Linux/Mac
   # or
   clarity_env\Scripts\activate     # Windows
   pip install -r requirements.txt
   ```

3. **Check Python version:**
   ```bash
   python --version  # Should be 3.8+
   ```

#### "CUDA not available" Warning
```bash
⚠️  CUDA not available, using CPU
```

**Solutions:**
1. **Install CUDA toolkit** (if you have NVIDIA GPU)
2. **Install PyTorch with CUDA:**
   ```bash
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```

3. **Use CPU mode** - Performance will be slower but functional

## 🔧 Advanced Troubleshooting

### Web UI Debug Mode

#### Console Logging
All import steps are logged to the browser console:

```javascript
// File Selection
"=== FILE SELECTION START ==="
"File object: { name: 'model.gguf', size: 1234567890 }"
"✅ File validated and ready for import"

// Import Process
"=== MODEL IMPORT START ==="
"🚀 Starting import process..."
"=== MODEL STORE IMPORT START ==="
"Step 1: Validating file type and size..."
"Step 2: Checking storage quota..."
"Step 3: Calculating SHA256 hash..."
"Step 4: Verifying against known hashes..."
"Step 5: Storing model in IndexedDB..."
"Step 6: Updating final status..."
"✅ Model import completed successfully"
```

#### Error Simulation
Use the "Simulate Error" button to test error handling:
- Click the button in the model import interface
- Should see error toast and console messages
- Verifies error paths work correctly

#### Reset Function
Use "Reset Model" to clear imported model:
- Removes model from IndexedDB
- Clears selected file
- Allows re-import for testing

#### Privacy Verification
1. **Network Tab Monitoring**:
   - Open Developer Tools → Network tab
   - Clear network log
   - Import a model file
   - Verify **zero network requests** during import

2. **Airplane Mode Testing**:
   - Enable airplane mode
   - Try importing a model file
   - Import should work without internet

### CLI Debug Mode
Enable verbose logging:
```bash
# Add debug flag to inference.py
python inference.py --text "test" --debug
```

### Model Verification
```bash
# Verify model integrity
python inference.py --verify-model

# Check model file size
ls -lh models/gemma-3n-e2b-it-q4_k_m.gguf

# Calculate SHA256 manually
sha256sum models/gemma-3n-e2b-it-q4_k_m.gguf
```

### System Diagnostics
```bash
# Check system resources
python -c "
import psutil
import torch
print(f'RAM: {psutil.virtual_memory().total / (1024**3):.1f}GB')
print(f'CPU: {psutil.cpu_count()} cores')
print(f'GPU: {torch.cuda.is_available()}')
print(f'CUDA: {torch.cuda.get_device_name() if torch.cuda.is_available() else \"None\"}')
"
```

### Network Testing (Privacy Verification)
```bash
# Verify no network requests during inference
# 1. Open browser dev tools
# 2. Go to Network tab
# 3. Run inference
# 4. Confirm no outgoing requests
```

## 📞 Getting Help

### Before Asking for Help
1. **Check this troubleshooting guide**
2. **Try the solutions above**
3. **Check system requirements**
4. **Verify model installation**

### When Reporting Issues
Include:
- **Error message** (exact text)
- **System specifications** (OS, RAM, GPU)
- **Steps to reproduce**
- **Model file details** (size, hash)
- **Python version** and dependencies

### Support Channels
- **GitHub Issues**: For bug reports
- **Documentation**: Check README.md first
- **Community**: Kaggle discussion forums

## 🛡️ Prevention Tips

### Regular Maintenance
1. **Update dependencies** monthly
2. **Verify model integrity** after downloads
3. **Monitor system resources**
4. **Backup important data**

### Best Practices
1. **Use virtual environments**
2. **Keep system updated**
3. **Monitor disk space**
4. **Test with sample files first**

---

**Need more help? Check the main README.md or create a GitHub issue.**

*Clarity: Empowering communication through privacy-first AI* 