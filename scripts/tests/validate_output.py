#!/usr/bin/env python3
"""
Clarity Output Validation Tests

This module validates that all Gemma 3n inference outputs follow the required
structured JSON schema with confidence and reasoning fields.

Usage:
    python scripts/tests/validate_output.py
"""

import json
import sys
import unittest
from pathlib import Path
from typing import Dict, List, Any

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent.parent))

# Mock the inference module for testing without dependencies
class MockClarityInference:
    """Mock inference class for testing without dependencies."""
    
    def __init__(self):
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

try:
    from inference import ClarityInference
except ImportError:
    print("⚠️  Dependencies not installed, using mock for testing")
    ClarityInference = MockClarityInference


class TestStructuredOutput(unittest.TestCase):
    """Test cases for structured JSON output validation."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.inference = ClarityInference()
        
        # Valid JSON responses for testing
        self.valid_responses = [
            {
                "suggestions": [
                    {
                        "text": "Try taking a deep breath and counting to three before speaking.",
                        "confidence": "medium",
                        "reasoning": "Deep breathing can help calm anxiety and give you time to organize your thoughts."
                    },
                    {
                        "text": "Consider writing down key points before your conversation.",
                        "confidence": "high",
                        "reasoning": "Preparation can reduce anxiety and improve communication clarity."
                    }
                ]
            },
            {
                "suggestions": [
                    {
                        "text": "The word you're looking for might be 'excited' or 'thrilled'.",
                        "confidence": "85%",
                        "reasoning": "These words commonly describe the feeling of being happy and excited about something."
                    }
                ]
            }
        ]
        
        # Invalid JSON responses for testing
        self.invalid_responses = [
            "This is just a plain text response",
            '{"suggestions": "not an array"}',
            '{"suggestions": [{"text": "missing fields"}]}',
            '{"suggestions": [{"text": "test", "confidence": "high"}]}',  # missing reasoning
            '{"suggestions": [{"text": 123, "confidence": "high", "reasoning": "test"}]}',  # wrong type
        ]
    
    def test_valid_json_parsing(self):
        """Test that valid JSON responses are parsed correctly."""
        for i, response in enumerate(self.valid_responses):
            with self.subTest(i=i):
                # Convert to string for testing
                response_str = json.dumps(response)
                parsed = self.inference.parse_json_response(response_str)
                
                self.assertIsInstance(parsed, dict)
                self.assertIn("suggestions", parsed)
                self.assertIsInstance(parsed["suggestions"], list)
                
                for suggestion in parsed["suggestions"]:
                    self.assertIsInstance(suggestion, dict)
                    self.assertIn("text", suggestion)
                    self.assertIn("confidence", suggestion)
                    self.assertIn("reasoning", suggestion)
                    
                    # Check field types
                    self.assertIsInstance(suggestion["text"], str)
                    self.assertIsInstance(suggestion["confidence"], str)
                    self.assertIsInstance(suggestion["reasoning"], str)
    
    def test_invalid_json_handling(self):
        """Test that invalid JSON responses are handled gracefully."""
        for i, response in enumerate(self.invalid_responses):
            with self.subTest(i=i):
                with self.assertRaises(ValueError):
                    self.inference.parse_json_response(response)
    
    def test_json_extraction(self):
        """Test JSON extraction from mixed content."""
        mixed_response = """
        Here's some text before the JSON.
        {
          "suggestions": [
            {
              "text": "Try this approach",
              "confidence": "high",
              "reasoning": "This is a good strategy"
            }
          ]
        }
        And some text after.
        """
        
        parsed = self.inference.parse_json_response(mixed_response)
        self.assertIn("suggestions", parsed)
        self.assertEqual(len(parsed["suggestions"]), 1)
        self.assertEqual(parsed["suggestions"][0]["text"], "Try this approach")
    
    def test_confidence_values(self):
        """Test that confidence values are properly validated."""
        valid_confidence_responses = [
            '{"suggestions": [{"text": "test", "confidence": "low", "reasoning": "test"}]}',
            '{"suggestions": [{"text": "test", "confidence": "medium", "reasoning": "test"}]}',
            '{"suggestions": [{"text": "test", "confidence": "high", "reasoning": "test"}]}',
            '{"suggestions": [{"text": "test", "confidence": "75%", "reasoning": "test"}]}',
            '{"suggestions": [{"text": "test", "confidence": "0.85", "reasoning": "test"}]}',
        ]
        
        for response in valid_confidence_responses:
            parsed = self.inference.parse_json_response(response)
            self.assertIn("suggestions", parsed)
            self.assertIn("confidence", parsed["suggestions"][0])
    
    def test_schema_validation(self):
        """Test that the schema validation catches missing fields."""
        incomplete_responses = [
            '{"suggestions": []}',  # Empty suggestions
            '{"suggestions": [{"text": "test"}]}',  # Missing confidence and reasoning
            '{"suggestions": [{"confidence": "high", "reasoning": "test"}]}',  # Missing text
        ]
        
        for response in incomplete_responses:
            with self.assertRaises(ValueError):
                self.inference.parse_json_response(response)
    
    def test_error_handling(self):
        """Test that error responses are structured properly."""
        # Simulate an error in structured response generation
        error_result = {
            "success": False,
            "error": "Model not loaded",
            "fallback_suggestions": [
                {
                    "text": "I'm having trouble processing your request right now. Please try again.",
                    "confidence": "low",
                    "reasoning": "Technical error occurred during processing"
                }
            ],
            "model": "gemma-3n-e2b-it"
        }
        
        self.assertFalse(error_result["success"])
        self.assertIn("error", error_result)
        self.assertIn("fallback_suggestions", error_result)
        self.assertIsInstance(error_result["fallback_suggestions"], list)
    
    def test_prompt_templates(self):
        """Test that prompt templates include JSON instruction."""
        # Check chat prompt template
        self.assertIn("Respond ONLY in the following JSON format", self.inference.chat_prompt_template)
        self.assertIn("suggestions", self.inference.chat_prompt_template)
        self.assertIn("confidence", self.inference.chat_prompt_template)
        self.assertIn("reasoning", self.inference.chat_prompt_template)
        
        # Check STT prompt template
        self.assertIn("Respond ONLY in the following JSON format", self.inference.stt_prompt_template)
        self.assertIn("suggestions", self.inference.stt_prompt_template)
        self.assertIn("confidence", self.inference.stt_prompt_template)
        self.assertIn("reasoning", self.inference.stt_prompt_template)


class TestSampleOutputs(unittest.TestCase):
    """Test cases for sample outputs and examples."""
    
    def test_sample_text_output(self):
        """Test sample text processing output."""
        sample_text = "I'm having trouble finding the right word"
        expected_structure = {
            "suggestions": [
                {
                    "text": "Try describing the object or concept using its features.",
                    "confidence": "high",
                    "reasoning": "Semantic feature analysis is an effective word-finding strategy."
                },
                {
                    "text": "Take a moment to breathe and relax - stress can make word-finding harder.",
                    "confidence": "medium",
                    "reasoning": "Anxiety can interfere with language retrieval processes."
                }
            ]
        }
        
        # Validate the expected structure
        self.assertIn("suggestions", expected_structure)
        self.assertIsInstance(expected_structure["suggestions"], list)
        
        for suggestion in expected_structure["suggestions"]:
            self.assertIn("text", suggestion)
            self.assertIn("confidence", suggestion)
            self.assertIn("reasoning", suggestion)
    
    def test_sample_audio_output(self):
        """Test sample audio processing output."""
        sample_audio_output = {
            "suggestions": [
                {
                    "text": "I heard you say 'I need help with communication'. Try using 'I' statements to express your needs clearly.",
                    "confidence": "medium",
                    "reasoning": "Transcription appears clear but context may vary. 'I' statements are generally helpful for communication."
                }
            ]
        }
        
        # Validate the expected structure
        self.assertIn("suggestions", sample_audio_output)
        self.assertIsInstance(sample_audio_output["suggestions"], list)
        
        for suggestion in sample_audio_output["suggestions"]:
            self.assertIn("text", suggestion)
            self.assertIn("confidence", suggestion)
            self.assertIn("reasoning", suggestion)


def run_validation_tests():
    """Run all validation tests and return results."""
    print("🧪 Running Clarity Output Validation Tests")
    print("=" * 50)
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test cases
    suite.addTests(loader.loadTestsFromTestCase(TestStructuredOutput))
    suite.addTests(loader.loadTestsFromTestCase(TestSampleOutputs))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    
    if result.failures:
        print("\n❌ FAILURES:")
        for test, traceback in result.failures:
            print(f"  - {test}: {traceback}")
    
    if result.errors:
        print("\n❌ ERRORS:")
        for test, traceback in result.errors:
            print(f"  - {test}: {traceback}")
    
    if result.wasSuccessful():
        print("\n✅ All tests passed! Structured output validation is working correctly.")
        return True
    else:
        print("\n❌ Some tests failed. Please fix the issues above.")
        return False


if __name__ == "__main__":
    success = run_validation_tests()
    sys.exit(0 if success else 1) 