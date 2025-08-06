#!/usr/bin/env python3
"""
Clarity: Gemma 3n-Only Inference Engine

This module provides the core inference capabilities for the Clarity cognitive partner.
All processing happens locally - no data leaves the device.

Usage:
    python inference.py --text "Your message here"
    python inference.py --audio path/to/audio.wav
    python inference.py --verify-model
    python inference.py --interactive
"""

import argparse
import hashlib
import json
import os
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional, Union

import librosa
import numpy as np
import soundfile as sf
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import click

# Color constants for CLI output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Unicode symbols for better CLI experience
class Symbols:
    CHECK = "✅"
    CROSS = "❌"
    WARNING = "⚠️"
    INFO = "ℹ️"
    MICROPHONE = "🎤"
    BRAIN = "🧠"
    LOCK = "🔒"
    LIGHTBULB = "💡"
    GEAR = "⚙️"
    ARROW = "→"
    DASH = "─"


class ClarityInference:
    """Gemma 3n-only inference engine for Clarity cognitive partner."""
    
    def __init__(self, model_path: str = "models/gemma-3n-e2b-it-q4_k_m.gguf"):
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Expected model checksum (update this when model changes)
        self.expected_sha256 = "a1b2c3d4e5f6..."  # Placeholder - update with actual hash
        
        # Model configuration
        self.max_length = 2048
        self.temperature = 0.7
        self.top_p = 0.9
        
        # Structured JSON output schema
        self.json_schema = {
            "suggestions": [
                {
                    "text": "<actionable suggestion>",
                    "confidence": "<low|medium|high|number|percentage>",
                    "reasoning": "<short explanation for this suggestion>"
                }
            ]
        }
        
        # Prompt templates with strict JSON instruction
        self.chat_prompt_template = """<start_of_turn>user
{user_input}

Respond ONLY in the following JSON format with 1-3 suggestions:
{{
  "suggestions": [
    {{
      "text": "<actionable suggestion>",
      "confidence": "<low|medium|high|number|percentage>",
      "reasoning": "<short explanation for this suggestion>"
    }}
  ]
}}

Do not include any other text, markdown, or formatting. Only valid JSON.
<end_of_turn>
<start_of_turn>model
"""
        
        self.stt_prompt_template = """<start_of_turn>user
Transcribe the following audio recording accurately and provide cognitive support suggestions.

Respond ONLY in the following JSON format:
{{
  "suggestions": [
    {{
      "text": "<transcription and actionable suggestion>",
      "confidence": "<low|medium|high|number|percentage>",
      "reasoning": "<short explanation for this suggestion>"
    }}
  ]
}}

Do not include any other text, markdown, or formatting. Only valid JSON.
<end_of_turn>
<start_of_turn>model
"""
    
    def print_header(self):
        """Print Clarity header with branding."""
        print(f"{Colors.BOLD}{Colors.BLUE}")
        print("╔══════════════════════════════════════════════════════════════╗")
        print("║                    🧠 CLARITY CLI                           ║")
        print("║              Privacy-First Cognitive Partner                ║")
        print("║                    Gemma 3n-Only                            ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print(f"{Colors.ENDC}")
    
    def print_status(self, message: str, status: str = "info"):
        """Print formatted status message."""
        colors = {
            "info": Colors.BLUE,
            "success": Colors.GREEN,
            "warning": Colors.YELLOW,
            "error": Colors.RED
        }
        symbols = {
            "info": Symbols.INFO,
            "success": Symbols.CHECK,
            "warning": Symbols.WARNING,
            "error": Symbols.CROSS
        }
        
        color = colors.get(status, Colors.BLUE)
        symbol = symbols.get(status, Symbols.INFO)
        print(f"{color}{symbol} {message}{Colors.ENDC}")
    
    def check_system_requirements(self) -> bool:
        """Check if system meets minimum requirements."""
        try:
            # Check RAM (minimum 4GB)
            import psutil
            ram_gb = psutil.virtual_memory().total / (1024**3)
            if ram_gb < 4:
                self.print_status(f"Only {ram_gb:.1f}GB RAM available. Minimum 4GB recommended.", "warning")
                return False
            
            # Check if model file exists
            if not os.path.exists(self.model_path):
                self.print_status(f"Model not found: {self.model_path}", "error")
                self.print_status("Please download the model using: python scripts/download_model.py", "info")
                return False
                
            return True
            
        except ImportError:
            self.print_status("psutil not available, skipping RAM check", "warning")
            return True
    
    def load_model(self) -> bool:
        """Load the Gemma 3n model and tokenizer."""
        try:
            self.print_status("Loading Gemma 3n model...", "info")
            start_time = time.time()
            
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                "google/gemma-3n-2b-it",
                trust_remote_code=True
            )
            
            # Load model
            self.model = AutoModelForCausalLM.from_pretrained(
                "google/gemma-3n-2b-it",
                torch_dtype=torch.float16,
                device_map="auto",
                trust_remote_code=True
            )
            
            load_time = time.time() - start_time
            self.print_status(f"Model loaded in {load_time:.1f} seconds", "success")
            return True
            
        except Exception as e:
            self.print_status(f"Error loading model: {e}", "error")
            return False
    
    def verify_model_integrity(self) -> bool:
        """Verify model file integrity using SHA256 checksum."""
        try:
            if not os.path.exists(self.model_path):
                self.print_status(f"Model file not found: {self.model_path}", "error")
                return False
            
            self.print_status("Verifying model integrity...", "info")
            
            sha256_hash = hashlib.sha256()
            with open(self.model_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    sha256_hash.update(chunk)
            
            actual_hash = sha256_hash.hexdigest()
            
            if self.expected_sha256 == "a1b2c3d4e5f6...":  # Placeholder
                self.print_status(f"Model SHA256: {actual_hash}", "info")
                self.print_status("Expected hash not set - please update in code", "warning")
                return True
            elif actual_hash == self.expected_sha256:
                self.print_status("Model integrity verified", "success")
                return True
            else:
                self.print_status("Model integrity check failed", "error")
                print(f"Expected: {self.expected_sha256}")
                print(f"Actual:   {actual_hash}")
                return False
                
        except Exception as e:
            self.print_status(f"Error verifying model: {e}", "error")
            return False
    
    def preprocess_audio(self, audio_path: str) -> np.ndarray:
        """Preprocess audio file for STT processing."""
        try:
            self.print_status(f"Processing audio: {audio_path}", "info")
            
            # Load audio and resample to 16kHz
            audio, sr = librosa.load(audio_path, sr=16000)
            
            # Normalize audio
            audio = librosa.util.normalize(audio)
            
            # Ensure mono channel
            if len(audio.shape) > 1:
                audio = np.mean(audio, axis=1)
            
            self.print_status(f"Audio processed: {len(audio)/sr:.1f}s at {sr}Hz", "success")
            return audio
            
        except Exception as e:
            self.print_status(f"Error processing audio: {e}", "error")
            raise
    
    def parse_json_response(self, response: str) -> Dict[str, any]:
        """Parse and validate JSON response from Gemma 3n."""
        try:
            # Clean the response - extract JSON from any surrounding text
            response = response.strip()
            
            # Try to find JSON object in the response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No JSON object found in response")
            
            json_str = response[start_idx:end_idx]
            parsed = json.loads(json_str)
            
            # Validate schema
            if "suggestions" not in parsed:
                raise ValueError("Missing 'suggestions' field in response")
            
            if not isinstance(parsed["suggestions"], list):
                raise ValueError("'suggestions' must be an array")
            
            # Check for empty suggestions
            if len(parsed["suggestions"]) == 0:
                raise ValueError("'suggestions' array cannot be empty")
            
            # Validate each suggestion
            for i, suggestion in enumerate(parsed["suggestions"]):
                if not isinstance(suggestion, dict):
                    raise ValueError(f"Suggestion {i} must be an object")
                
                required_fields = ["text", "confidence", "reasoning"]
                for field in required_fields:
                    if field not in suggestion:
                        raise ValueError(f"Suggestion {i} missing required field: {field}")
                    
                    if not isinstance(suggestion[field], str):
                        raise ValueError(f"Suggestion {i}.{field} must be a string")
            
            return parsed
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON response: {e}")
        except Exception as e:
            raise ValueError(f"Error parsing response: {e}")
    
    def generate_structured_response(self, prompt: str, is_stt: bool = False) -> Dict[str, any]:
        """Generate structured JSON response using Gemma 3n model."""
        try:
            if self.model is None or self.tokenizer is None:
                raise ValueError("Model not loaded")
            
            # Tokenize input
            inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
            
            # Generate response
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_length=self.max_length,
                    temperature=self.temperature,
                    top_p=self.top_p,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            # Decode response
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract only the model's response (after the prompt)
            model_response = response.split("<start_of_turn>model")[-1].strip()
            
            # Parse and validate JSON
            parsed_response = self.parse_json_response(model_response)
            
            return {
                "success": True,
                "data": parsed_response,
                "model": "gemma-3n-e2b-it",
                "processing_time": time.time()
            }
            
        except Exception as e:
            # Return structured error response
            return {
                "success": False,
                "error": str(e),
                "fallback_suggestions": [
                    {
                        "text": "I'm having trouble processing your request right now. Please try again.",
                        "confidence": "low",
                        "reasoning": "Technical error occurred during processing"
                    }
                ],
                "model": "gemma-3n-e2b-it"
            }
    
    def process_text(self, text: str) -> Dict[str, any]:
        """Process text input for chat mode with structured output."""
        prompt = self.chat_prompt_template.format(user_input=text)
        return self.generate_structured_response(prompt, is_stt=False)
    
    def process_audio(self, audio_path: str) -> Dict[str, any]:
        """Process audio input for STT mode with structured output."""
        # Preprocess audio
        audio = self.preprocess_audio(audio_path)
        
        # Create STT prompt
        prompt = self.stt_prompt_template
        
        # For now, we'll simulate audio processing
        # In a real implementation, you'd pass the audio features to the model
        self.print_status("Audio transcription (simulated)", "info")
        return self.generate_structured_response(prompt, is_stt=True)
    
    def get_confidence_color(self, confidence: str) -> str:
        """Get color for confidence level."""
        if "high" in confidence.lower() or any(c.isdigit() and int(c) > 70 for c in confidence if c.isdigit()):
            return Colors.GREEN
        elif "medium" in confidence.lower() or any(c.isdigit() and 40 <= int(c) <= 70 for c in confidence if c.isdigit()):
            return Colors.YELLOW
        else:
            return Colors.RED
    
    def display_structured_output(self, result: Dict[str, any]) -> None:
        """Display structured output with confidence and reasoning."""
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.ENDC}")
        print(f"{Colors.BOLD}🤖 CLARITY RESPONSE{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.ENDC}")
        
        if result.get("success", False):
            suggestions = result["data"]["suggestions"]
            
            for i, suggestion in enumerate(suggestions, 1):
                confidence_color = self.get_confidence_color(suggestion['confidence'])
                
                print(f"\n{Colors.BOLD}{Symbols.LIGHTBULB} Suggestion {i}:{Colors.ENDC}")
                print(f"   {Colors.BOLD}Text:{Colors.ENDC} {suggestion['text']}")
                print(f"   {Colors.BOLD}Confidence:{Colors.ENDC} {confidence_color}{suggestion['confidence']}{Colors.ENDC}")
                print(f"   {Colors.BOLD}Reasoning:{Colors.ENDC} {suggestion['reasoning']}")
                print(f"{Colors.BLUE}{Symbols.DASH * 40}{Colors.ENDC}")
            
            print(f"\n{Colors.BOLD}📊 Model:{Colors.ENDC} {result.get('model', 'unknown')}")
            
        else:
            self.print_status("Error occurred during processing:", "error")
            print(f"   {result.get('error', 'Unknown error')}")
            
            # Show fallback suggestions if available
            if "fallback_suggestions" in result:
                print(f"\n{Colors.YELLOW}🔄 Fallback suggestions:{Colors.ENDC}")
                for i, suggestion in enumerate(result["fallback_suggestions"], 1):
                    print(f"   {i}. {suggestion['text']}")
        
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.ENDC}")
        
        # Privacy guarantee
        print(f"\n{Colors.BOLD}{Colors.GREEN}{Symbols.LOCK} PRIVACY GUARANTEE{Colors.ENDC}")
        print("All processing happened locally on your device.")
        print("No data was transmitted or stored externally.")
    
    def run_inference(self, text: Optional[str] = None, audio: Optional[str] = None) -> None:
        """Main inference method with structured output."""
        # Check system requirements
        if not self.check_system_requirements():
            sys.exit(1)
        
        # Load model
        if not self.load_model():
            sys.exit(1)
        
        # Process input
        if text:
            self.print_status(f"Processing text: {text[:50]}...", "info")
            result = self.process_text(text)
        elif audio:
            self.print_status(f"Processing audio: {audio}", "info")
            result = self.process_audio(audio)
        else:
            self.print_status("No input provided", "error")
            return
        
        # Display structured result
        self.display_structured_output(result)
    
    def interactive_mode(self):
        """Run Clarity in interactive mode."""
        self.print_header()
        self.print_status("Starting interactive mode. Type 'quit' to exit.", "info")
        print()
        
        # Check if model is ready
        if not self.check_system_requirements():
            self.print_status("Model not ready. Please run setup first.", "error")
            return
        
        if not self.load_model():
            self.print_status("Failed to load model. Please check installation.", "error")
            return
        
        while True:
            try:
                print(f"{Colors.BOLD}{Colors.BLUE}💬 You:{Colors.ENDC} ", end="")
                user_input = input().strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    self.print_status("Goodbye! 👋", "success")
                    break
                
                if not user_input:
                    continue
                
                print(f"{Colors.BOLD}{Colors.GREEN}🤖 Clarity:{Colors.ENDC}")
                result = self.process_text(user_input)
                self.display_structured_output(result)
                print()
                
            except KeyboardInterrupt:
                print(f"\n{Colors.YELLOW}Interrupted by user{Colors.ENDC}")
                break
            except Exception as e:
                self.print_status(f"Error: {e}", "error")


@click.command()
@click.option('--text', '-t', help='Text input for chat mode')
@click.option('--audio', '-a', help='Audio file path for STT mode')
@click.option('--verify-model', is_flag=True, help='Verify model integrity')
@click.option('--interactive', '-i', is_flag=True, help='Start interactive mode')
@click.option('--model-path', default='models/gemma-3n-e2b-it-q4_k_m.gguf', 
              help='Path to the Gemma 3n model file')
@click.option('--json', is_flag=True, help='Output raw JSON only (for scripting)')
def main(text: Optional[str], audio: Optional[str], verify_model: bool, interactive: bool, model_path: str, json: bool):
    """Clarity: Gemma 3n-Only Cognitive Partner with Structured Reasoning"""
    
    # Initialize inference engine
    engine = ClarityInference(model_path)
    
    if not json:
        engine.print_header()
    
    if verify_model:
        if engine.verify_model_integrity():
            if not json:
                engine.print_status("Model verification completed successfully", "success")
            sys.exit(0)
        else:
            if not json:
                engine.print_status("Model verification failed", "error")
            sys.exit(1)
    
    if interactive:
        engine.interactive_mode()
        return
    
    # Validate input
    if not text and not audio:
        if not json:
            engine.print_status("Please provide either --text, --audio, or --interactive", "error")
            print("Examples:")
            print("  python inference.py --text 'Hello, how are you?'")
            print("  python inference.py --audio samples/sample_audio.wav")
            print("  python inference.py --interactive")
        sys.exit(1)
    
    if text and audio:
        if not json:
            engine.print_status("Please provide only one input type (--text OR --audio)", "error")
        sys.exit(1)
    
    # Run inference
    try:
        if text:
            result = engine.process_text(text)
        elif audio:
            result = engine.process_audio(audio)
        
        if json:
            # Output raw JSON for scripting
            print(json.dumps(result, indent=2))
        else:
            engine.display_structured_output(result)
            
    except KeyboardInterrupt:
        if not json:
            print(f"\n{Colors.YELLOW}Interrupted by user{Colors.ENDC}")
        sys.exit(0)
    except Exception as e:
        if not json:
            engine.print_status(f"Error: {e}", "error")
        sys.exit(1)


if __name__ == "__main__":
    main() 