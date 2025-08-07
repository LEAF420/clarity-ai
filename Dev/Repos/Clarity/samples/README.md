# Sample Files for Clarity Testing

This directory contains sample input files for testing the Clarity Gemma 3n-only inference engine.

## Files

### `sample_text.txt`
Contains various test prompts covering different use cases:
- Word-finding difficulties
- Social anxiety scenarios
- Communication challenges
- Confidence building
- Conversation skills

### `sample_audio.wav` (to be added)
A 16kHz WAV file for testing audio transcription capabilities.

## Usage

### Text Testing
```bash
# Test with a specific prompt
python inference.py --text "I'm having trouble finding the right word"

# Test with a sample from the file
python inference.py --text "$(head -n 1 samples/sample_text.txt)"
```

### Audio Testing
```bash
# Test audio transcription
python inference.py --audio samples/sample_audio.wav
```

## Creating Your Own Samples

### Text Samples
- Keep prompts under 200 characters for optimal performance
- Focus on real-world communication challenges
- Include various difficulty levels and scenarios

### Audio Samples
- Use 16kHz WAV format for best compatibility
- Keep files under 30 seconds for reasonable processing time
- Include clear speech with minimal background noise
- Test with different accents and speaking speeds

## Privacy Note
All sample files are processed locally on your device. No data is transmitted to external servers. 