#!/usr/bin/env python3
"""
Clarity Model Download Script

This script helps you download the required Gemma 3n model for Clarity.
Due to licensing restrictions, we cannot directly download the model,
but we provide clear instructions and verification tools.

Usage:
    python scripts/download_model.py
"""

import os
import sys
import hashlib
import requests
from pathlib import Path
import click


class ModelDownloader:
    """Helper class for model acquisition and verification."""
    
    def __init__(self):
        self.models_dir = Path("models")
        self.target_model = "gemma-3n-e2b-it-q4_k_m.gguf"
        self.model_path = self.models_dir / self.target_model
        
        # Expected SHA256 (update when you get the actual model)
        self.expected_sha256 = "a1b2c3d4e5f6..."  # Placeholder
        
        # Model info
        self.model_info = {
            "name": "Gemma 3n E2B-it Q4_K_M",
            "size_gb": "~1.2GB",
            "format": "GGUF",
            "license": "Gemma Use Policy",
            "source": "Hugging Face / Community"
        }
    
    def create_directories(self):
        """Create necessary directories."""
        self.models_dir.mkdir(exist_ok=True)
        print(f"✅ Created directory: {self.models_dir}")
    
    def check_existing_model(self) -> bool:
        """Check if model already exists."""
        if self.model_path.exists():
            print(f"✅ Model already exists: {self.model_path}")
            return True
        return False
    
    def verify_model_integrity(self) -> bool:
        """Verify model file integrity."""
        if not self.model_path.exists():
            print(f"❌ Model not found: {self.model_path}")
            return False
        
        print("🔍 Verifying model integrity...")
        
        sha256_hash = hashlib.sha256()
        with open(self.model_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        
        actual_hash = sha256_hash.hexdigest()
        file_size = self.model_path.stat().st_size / (1024**3)
        
        print(f"📊 Model details:")
        print(f"   Size: {file_size:.2f} GB")
        print(f"   SHA256: {actual_hash}")
        
        if self.expected_sha256 == "a1b2c3d4e5f6...":  # Placeholder
            print("⚠️  Expected hash not set - please update in code")
            return True
        elif actual_hash == self.expected_sha256:
            print("✅ Model integrity verified")
            return True
        else:
            print("❌ Model integrity check failed")
            return False
    
    def print_download_instructions(self):
        """Print detailed download instructions."""
        print("\n" + "="*60)
        print("📥 GEMMA 3N MODEL DOWNLOAD INSTRUCTIONS")
        print("="*60)
        print()
        print("Due to licensing restrictions, you need to download the model manually.")
        print("Follow these steps:")
        print()
        print("1. 📋 MODEL SPECIFICATIONS:")
        print(f"   • Model: {self.model_info['name']}")
        print(f"   • Size: {self.model_info['size_gb']}")
        print(f"   • Format: {self.model_info['format']}")
        print(f"   • License: {self.model_info['license']}")
        print()
        print("2. 🌐 DOWNLOAD SOURCES:")
        print("   • Hugging Face: Search for 'gemma-3n-2b-it' GGUF models")
        print("   • TheBloke: Look for 'TheBloke/gemma-3n-2b-it-GGUF'")
        print("   • Community: Check r/LocalLLaMA for latest releases")
        print()
        print("3. 📁 PLACEMENT:")
        print(f"   • Save the model as: {self.target_model}")
        print(f"   • Place it in: {self.models_dir}")
        print(f"   • Full path: {self.model_path}")
        print()
        print("4. ✅ VERIFICATION:")
        print("   • Run: python inference.py --verify-model")
        print("   • Check file size matches expected (~1.2GB)")
        print("   • Verify SHA256 checksum (when available)")
        print()
        print("5. 🔒 PRIVACY REMINDER:")
        print("   • Model runs entirely on your device")
        print("   • No data transmitted to external servers")
        print("   • All processing happens locally")
        print()
        print("6. 🚀 TESTING:")
        print("   • Text mode: python inference.py --text 'Hello'")
        print("   • Audio mode: python inference.py --audio samples/sample_audio.wav")
        print()
        print("="*60)
    
    def print_byom_guide(self):
        """Print Bring Your Own Model guide."""
        print("\n" + "="*60)
        print("🔄 BRING YOUR OWN MODEL (BYOM) GUIDE")
        print("="*60)
        print()
        print("If you have a different Gemma 3n model:")
        print()
        print("1. 📝 UPDATE CONFIGURATION:")
        print("   • Edit inference.py: update model_path")
        print("   • Update expected SHA256 if known")
        print("   • Adjust model loading parameters if needed")
        print()
        print("2. 🔧 COMPATIBLE MODELS:")
        print("   • Any Gemma 3n GGUF format model")
        print("   • Recommended: Q4_K_M quantization")
        print("   • Size: 1-2GB for optimal performance")
        print()
        print("3. ⚙️  CUSTOMIZATION:")
        print("   • Modify temperature, top_p in inference.py")
        print("   • Adjust max_length based on your model")
        print("   • Update prompt templates if needed")
        print()
        print("4. 🧪 TESTING CUSTOM MODELS:")
        print("   • Always verify model integrity")
        print("   • Test with sample inputs")
        print("   • Monitor memory usage")
        print()
        print("="*60)
    
    def run(self):
        """Main execution method."""
        print("🧠 Clarity Model Download Helper")
        print("🔒 Gemma 3n-Only Setup")
        print()
        
        # Create directories
        self.create_directories()
        
        # Check if model exists
        if self.check_existing_model():
            if self.verify_model_integrity():
                print("✅ Model is ready to use!")
                print("Test with: python inference.py --text 'Hello'")
                return True
            else:
                print("❌ Model verification failed")
                print("Please re-download the model")
        
        # Print instructions
        self.print_download_instructions()
        self.print_byom_guide()
        
        print("\n📞 Need help? Check the README.md for troubleshooting.")
        return False


@click.command()
def main():
    """Clarity Model Download Helper"""
    downloader = ModelDownloader()
    success = downloader.run()
    
    if success:
        print("\n✅ Setup complete! You can now use Clarity.")
    else:
        print("\n📋 Please follow the instructions above to download the model.")
        print("After downloading, run this script again to verify.")


if __name__ == "__main__":
    main() 