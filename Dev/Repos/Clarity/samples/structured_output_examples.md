# Clarity Structured Output Examples

This document provides examples of Clarity's structured JSON responses with confidence levels and reasoning for transparency and trust.

## Text Processing Examples

### Example 1: Word-Finding Help

**Input:** "I'm having trouble finding the right word"

**Output:**
```json
{
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
    },
    {
      "text": "Think of related words or synonyms that might help you find the right one.",
      "confidence": "medium",
      "reasoning": "Associative thinking can help access the target word through related concepts."
    }
  ]
}
```

### Example 2: Social Anxiety Support

**Input:** "I feel anxious about my presentation tomorrow"

**Output:**
```json
{
  "suggestions": [
    {
      "text": "Practice your presentation out loud several times to build confidence.",
      "confidence": "high",
      "reasoning": "Repeated practice reduces anxiety and improves performance."
    },
    {
      "text": "Try deep breathing exercises before you start speaking.",
      "confidence": "medium",
      "reasoning": "Controlled breathing can help calm your nervous system."
    },
    {
      "text": "Remember that most people want you to succeed and are supportive.",
      "confidence": "medium",
      "reasoning": "Reframing the audience as supportive can reduce performance anxiety."
    }
  ]
}
```

### Example 3: Communication Skills

**Input:** "How should I respond when someone asks about my weekend?"

**Output:**
```json
{
  "suggestions": [
    {
      "text": "Share one specific activity you enjoyed, like 'I went hiking and saw a beautiful sunset.'",
      "confidence": "high",
      "reasoning": "Specific details make conversations more engaging and authentic."
    },
    {
      "text": "Ask them about their weekend too to keep the conversation flowing.",
      "confidence": "medium",
      "reasoning": "Reciprocal questions show interest and maintain conversation balance."
    },
    {
      "text": "If you had a quiet weekend, it's okay to say 'I had a relaxing weekend at home.'",
      "confidence": "medium",
      "reasoning": "Honest responses build genuine connections, even for simple activities."
    }
  ]
}
```

## Audio Processing Examples

### Example 1: Audio Transcription with Support

**Input:** Audio recording saying "I need help with communication"

**Output:**
```json
{
  "suggestions": [
    {
      "text": "I heard you say 'I need help with communication'. Try using 'I' statements to express your needs clearly.",
      "confidence": "medium",
      "reasoning": "Transcription appears clear but context may vary. 'I' statements are generally helpful for communication."
    },
    {
      "text": "Consider what specific aspect of communication you'd like to improve.",
      "confidence": "low",
      "reasoning": "Limited context from audio makes this a general suggestion."
    }
  ]
}
```

### Example 2: Audio with Word-Finding Difficulty

**Input:** Audio recording saying "I can't find the word for... um... the thing that... you know..."

**Output:**
```json
{
  "suggestions": [
    {
      "text": "I heard you struggling to find a word. Try describing what the thing looks like or what it does.",
      "confidence": "high",
      "reasoning": "Clear audio shows word-finding difficulty. Feature description is an effective strategy."
    },
    {
      "text": "Take your time - it's okay to pause while you think of the right word.",
      "confidence": "medium",
      "reasoning": "Audio shows hesitation patterns typical of word-finding difficulties."
    }
  ]
}
```

## Error Handling Examples

### Example 1: Invalid JSON Response

**Input:** "Help me with communication"

**Model Response:** "Here are some tips for better communication..."

**Error Handling:**
```json
{
  "success": false,
  "error": "Invalid JSON response: Expected structured format",
  "fallback_suggestions": [
    {
      "text": "I'm having trouble processing your request right now. Please try again.",
      "confidence": "low",
      "reasoning": "Technical error occurred during processing"
    }
  ],
  "model": "gemma-3n-e2b-it"
}
```

### Example 2: Missing Fields

**Input:** "I need help"

**Model Response:** `{"suggestions": [{"text": "Try this approach"}]}`

**Error Handling:**
```json
{
  "success": false,
  "error": "Suggestion 0 missing required field: confidence",
  "fallback_suggestions": [
    {
      "text": "I'm having trouble processing your request right now. Please try again.",
      "confidence": "low",
      "reasoning": "Technical error occurred during processing"
    }
  ],
  "model": "gemma-3n-e2b-it"
}
```

## Confidence Level Examples

### String Buckets
- `"low"` - Limited confidence in the suggestion
- `"medium"` - Moderate confidence in the suggestion  
- `"high"` - High confidence in the suggestion

### Percentages
- `"75%"` - 75% confidence level
- `"85%"` - 85% confidence level
- `"92%"` - 92% confidence level

### Decimals
- `"0.7"` - 70% confidence level
- `"0.85"` - 85% confidence level
- `"0.92"` - 92% confidence level

## CLI Output Examples

### Successful Response
```bash
$ python inference.py --text "I'm feeling anxious about my presentation"

🤖 CLARITY RESPONSE
============================================================

💡 Suggestion 1:
   Text: Practice your presentation out loud several times to build confidence.
   Confidence: high
   Reasoning: Repeated practice reduces anxiety and improves performance.
----------------------------------------

💡 Suggestion 2:
   Text: Try deep breathing exercises before you start speaking.
   Confidence: medium
   Reasoning: Controlled breathing can help calm your nervous system.
----------------------------------------

📊 Model: gemma-3n-e2b-it
============================================================

🔒 PRIVACY GUARANTEE
All processing happened locally on your device.
No data was transmitted or stored externally.
```

### Error Response
```bash
$ python inference.py --text "Help me"

❌ Error occurred during processing:
   Invalid JSON response: Expected structured format

🔄 Fallback suggestions:
   1. I'm having trouble processing your request right now. Please try again.

============================================================

🔒 PRIVACY GUARANTEE
All processing happened locally on your device.
No data was transmitted or stored externally.
```

## Why Structured Output Matters

1. **Transparency**: Users understand why each suggestion is made
2. **Trust Building**: Confidence levels show Clarity's self-awareness
3. **Empowerment**: Users can make informed decisions about which suggestions to follow
4. **Accessibility**: Clear reasoning helps users with cognitive challenges
5. **Privacy**: All reasoning happens locally on your device

## Testing the Structured Output

Run the validation tests to ensure all outputs follow the required schema:

```bash
python scripts/tests/validate_output.py
```

This will verify:
- ✅ All responses are valid JSON
- ✅ Required fields (text, confidence, reasoning) are present
- ✅ Error handling works correctly
- ✅ Prompt templates include JSON instructions
- ✅ Sample outputs follow the schema 