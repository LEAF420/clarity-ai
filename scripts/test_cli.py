#!/usr/bin/env python3
"""
Test script for CLI formatting and structure.
This tests the CLI interface without requiring model dependencies.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Mock the inference module for testing
class MockClarityInference:
    """Mock inference class for CLI testing."""
    
    def __init__(self):
        self.model_path = "models/test-model.gguf"
    
    def print_header(self):
        """Print Clarity header with branding."""
        print("╔══════════════════════════════════════════════════════════════╗")
        print("║                    🧠 CLARITY CLI                           ║")
        print("║              Privacy-First Cognitive Partner                ║")
        print("║                    Gemma 3n-Only                            ║")
        print("╚══════════════════════════════════════════════════════════════╝")
    
    def print_status(self, message: str, status: str = "info"):
        """Print formatted status message."""
        symbols = {
            "info": "ℹ️",
            "success": "✅",
            "warning": "⚠️",
            "error": "❌"
        }
        symbol = symbols.get(status, "ℹ️")
        print(f"{symbol} {message}")
    
    def check_system_requirements(self) -> bool:
        """Mock system requirements check."""
        self.print_status("Checking system requirements...", "info")
        self.print_status("System requirements met", "success")
        return True
    
    def verify_model_integrity(self) -> bool:
        """Mock model verification."""
        self.print_status("Verifying model integrity...", "info")
        self.print_status("Model verification completed successfully", "success")
        return True
    
    def display_structured_output(self, result: dict):
        """Display structured output with confidence and reasoning."""
        print("\n" + "="*60)
        print("🤖 CLARITY RESPONSE")
        print("="*60)
        
        if result.get("success", False):
            suggestions = result["data"]["suggestions"]
            
            for i, suggestion in enumerate(suggestions, 1):
                print(f"\n💡 Suggestion {i}:")
                print(f"   Text: {suggestion['text']}")
                print(f"   Confidence: {suggestion['confidence']}")
                print(f"   Reasoning: {suggestion['reasoning']}")
                print("-" * 40)
            
            print(f"\n📊 Model: {result.get('model', 'unknown')}")
            
        else:
            self.print_status("Error occurred during processing:", "error")
            print(f"   {result.get('error', 'Unknown error')}")
        
        print("="*60)
        
        # Privacy guarantee
        print("\n🔒 PRIVACY GUARANTEE")
        print("All processing happened locally on your device.")
        print("No data was transmitted or stored externally.")


def test_cli_formatting():
    """Test CLI formatting and structure."""
    print("🧪 Testing Clarity CLI Formatting")
    print("=" * 50)
    
    # Create mock inference engine
    engine = MockClarityInference()
    
    # Test header
    print("\n1. Testing Header:")
    engine.print_header()
    
    # Test status messages
    print("\n2. Testing Status Messages:")
    engine.print_status("This is an info message", "info")
    engine.print_status("This is a success message", "success")
    engine.print_status("This is a warning message", "warning")
    engine.print_status("This is an error message", "error")
    
    # Test system requirements
    print("\n3. Testing System Requirements:")
    engine.check_system_requirements()
    
    # Test model verification
    print("\n4. Testing Model Verification:")
    engine.verify_model_integrity()
    
    # Test structured output
    print("\n5. Testing Structured Output:")
    mock_result = {
        "success": True,
        "data": {
            "suggestions": [
                {
                    "text": "Try taking a deep breath and counting to three before speaking.",
                    "confidence": "high",
                    "reasoning": "Deep breathing can help calm anxiety and give you time to organize your thoughts."
                },
                {
                    "text": "Consider writing down key points before your conversation.",
                    "confidence": "medium",
                    "reasoning": "Preparation can reduce anxiety and improve communication clarity."
                }
            ]
        },
        "model": "gemma-3n-e2b-it"
    }
    engine.display_structured_output(mock_result)
    
    print("\n✅ CLI formatting test completed successfully!")


if __name__ == "__main__":
    test_cli_formatting() 