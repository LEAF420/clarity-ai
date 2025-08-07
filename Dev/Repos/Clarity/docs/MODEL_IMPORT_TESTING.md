# Model Import Testing Guide

This guide helps you test and verify the Clarity Web UI model import functionality.

## 🧪 Testing Overview

The model import system is designed to be **100% offline** and **privacy-first**. All testing should verify these core principles.

## 📋 Pre-Test Checklist

- [ ] Browser supports IndexedDB (Chrome, Edge, Firefox, Safari)
- [ ] At least 2GB free storage space
- [ ] Developer Tools open (F12) for console monitoring
- [ ] Network tab open to verify no requests during import

## 🔍 Test Scenarios

### 1. Basic File Selection

**Test**: File picker and drag-and-drop functionality

**Steps**:
1. Open the app and complete onboarding
2. Navigate to model import screen
3. Try clicking "Choose File" button
4. Try dragging a file onto the drop zone
5. Select a valid `.gguf` file

**Expected Results**:
- ✅ File picker opens
- ✅ Drag-and-drop highlights when file is dragged over
- ✅ Selected file shows name and size
- ✅ "Import Model" button appears

**Console Output**:
```
File selected: { name: "model.gguf", size: 1234567890, type: "application/octet-stream" }
File validated and ready for import
```

### 2. File Validation

**Test**: Invalid file rejection

**Steps**:
1. Try selecting a `.txt` file
2. Try selecting a file smaller than 100MB
3. Try selecting a file larger than 15GB

**Expected Results**:
- ✅ Invalid file types show error toast
- ✅ Files too small show error toast
- ✅ Files too large show error toast
- ✅ No file preview shown for invalid files

### 3. Model Import Process

**Test**: Complete import workflow

**Steps**:
1. Select a valid `.gguf` file
2. Click "Import Model"
3. Monitor progress bar
4. Check console for detailed logs

**Expected Results**:
- ✅ Progress bar shows: 5% → 10% → 20% → 40% → 60% → 80% → 100%
- ✅ SHA256 hash is calculated and displayed
- ✅ Model is stored in IndexedDB
- ✅ Success message shows verification status

**Console Output**:
```
Starting model import: model.gguf
Storage quota check: { usage: 123456, quota: 10737418240, hasQuota: true }
Import completed: { isVerified: false, sha256: "a1b2c3d4...", knownModel: undefined }
```

### 4. Privacy Verification

**Test**: Verify no network requests

**Steps**:
1. Open Developer Tools → Network tab
2. Clear network log
3. Import a model file
4. Check network tab

**Expected Results**:
- ✅ Zero network requests during import
- ✅ No upload requests
- ✅ No analytics or tracking requests
- ✅ All processing happens locally

### 5. Storage Quota Testing

**Test**: Handle insufficient storage

**Steps**:
1. Fill browser storage (if possible)
2. Try importing a large model
3. Check error message

**Expected Results**:
- ✅ Clear error message about insufficient storage
- ✅ Shows available space in GB
- ✅ Import process stops gracefully

### 6. Model Verification

**Test**: SHA256 hash verification

**Steps**:
1. Import a model with known hash (see constants)
2. Check verification badge
3. Import unknown model
4. Check verification badge

**Expected Results**:
- ✅ Known models show "Verified: [model name]" badge
- ✅ Unknown models show "Unverified Model" badge
- ✅ SHA256 hash is displayed (first 16 chars)

### 7. Persistence Testing

**Test**: Model survives browser restart

**Steps**:
1. Import a model successfully
2. Close browser completely
3. Reopen browser and navigate to app
4. Check if model is still available

**Expected Results**:
- ✅ Model remains imported after restart
- ✅ No re-import required
- ✅ Model status persists in localStorage

### 8. Reset Functionality

**Test**: Clear imported model

**Steps**:
1. Import a model successfully
2. Click "Reset Model" button
3. Try importing again

**Expected Results**:
- ✅ Model is cleared from storage
- ✅ Import screen shows again
- ✅ Can import new model

### 9. Error Handling

**Test**: Various error conditions

**Steps**:
1. Try importing corrupted file
2. Try importing during network issues
3. Try importing with storage quota exceeded

**Expected Results**:
- ✅ Clear, helpful error messages
- ✅ No crashes or undefined states
- ✅ User can retry after fixing issues

## 🛠️ Development Testing

### Run Automated Tests

Click the "Run Tests" button in the model import interface to run comprehensive automated tests:

```javascript
// Tests run automatically:
// 1. SHA256 Calculation
// 2. File Validation  
// 3. Storage Quota
// 4. IndexedDB Operations
// 5. Hash Verification
```

### Console Monitoring

Watch for these key log messages:

```javascript
// File selection
File selected: { name: "model.gguf", size: 1234567890, type: "application/octet-stream" }
File validated and ready for import

// Import process
Starting model import: model.gguf
Storage quota check: { usage: 123456, quota: 10737418240, hasQuota: true }
Import completed: { isVerified: false, sha256: "a1b2c3d4...", knownModel: undefined }

// Storage operations
IndexedDB store successful
IndexedDB retrieve successful
```

## 🚨 Common Issues

### Issue: "File too large" error
**Solution**: Check file size is under 15GB

### Issue: "Storage quota exceeded" error  
**Solution**: Free up browser storage space

### Issue: Import fails silently
**Solution**: Check console for detailed error messages

### Issue: Model not persisting after restart
**Solution**: Check IndexedDB support and storage permissions

## ✅ Success Criteria

A successful test should verify:

- [ ] File selection works (drag-drop + file picker)
- [ ] File validation rejects invalid files
- [ ] Import process shows accurate progress
- [ ] SHA256 hash is calculated and displayed
- [ ] Model is stored in IndexedDB
- [ ] No network requests during import
- [ ] Model persists after browser restart
- [ ] Reset functionality clears model
- [ ] Error messages are clear and helpful
- [ ] Console shows detailed debugging info

## 🔒 Privacy Verification

To verify privacy guarantees:

1. **Network Tab**: Should show zero requests during import
2. **Storage Tab**: Model should appear in IndexedDB
3. **Console**: Should show local processing logs
4. **Airplane Mode**: Import should work without internet

## 📊 Performance Benchmarks

Expected performance on different file sizes:

- **100MB model**: ~5-10 seconds import time
- **1GB model**: ~30-60 seconds import time  
- **5GB model**: ~2-5 minutes import time
- **15GB model**: ~5-10 minutes import time

*Times may vary based on device performance and storage speed.*

## 🎯 Competition Compliance

This testing ensures the model import meets Kaggle competition requirements:

- ✅ **Innovation**: Privacy-first, offline-only approach
- ✅ **Technical Excellence**: Robust error handling and validation
- ✅ **User Experience**: Clear feedback and intuitive interface
- ✅ **Impact**: Accessible to users with various technical skills 