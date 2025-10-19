# 🤟 ASL Sign Interpreter - Live Feedback System

An AI-powered American Sign Language (ASL) interpreter that provides real-time feedback on your signing using Google's Gemini AI.

## ✨ Features

### 📹 Video Recording Mode
- **Toggle Recording**: Click "Start Live Feedback" to begin recording your signing
- **Smart Capture**: Automatically captures frames at 3 FPS during recording
- **Visual Feedback**: Recording indicator with frame counter

### 🤖 AI-Powered Analysis
- **Gemini 2.5 Pro**: Uses Google's latest multimodal AI model
- **Multi-Gesture Recognition**: Detects and analyzes ALL signs in a sequence
- **Comprehensive Feedback**: 
  - Identifies each sign/letter/word performed
  - Shows sequence position (first, second, third, etc.)
  - Analyzes hand position, orientation, and movement for each
  - Provides constructive corrections per sign
  - Highlights what you did well
  - Overall feedback on flow and transitions
  
### 📊 Dual View Modes
- **Detailed Feedback**: In-depth analysis with specific improvements (150-200 words)
- **Summary View**: Quick 2-3 sentence overview of key points
- **Toggle Button**: Switch between views with one click

### 🎨 Modern UI
- Beautiful gradient design
- Smooth animations and transitions
- Loading indicators during processing
- Responsive layout

## 🚀 How to Use

### Setup
1. **Install Dependencies**:
   ```bash
   pip install fastapi uvicorn google-generativeai pillow
   ```

2. **Start the Server**:
   ```bash
   uvicorn test:app --reload --port 8000
   ```

3. **Open the Interface**:
   - Open `index.html` in your browser
   - Allow camera access when prompted

### Recording & Feedback Flow

1. **Start Recording**
   - Click "Start Live Feedback" button
   - Button turns animated and shows "Stop & Analyze"
   - Perform your ASL sign(s) - you can do multiple signs in sequence!
   - Watch the frame counter increase

2. **Stop & Analyze**
   - Click "Stop & Analyze" when done
   - See "Your signing is being processed" message
   - Wait for AI analysis (typically 3-10 seconds)

3. **View Feedback**
   - See ALL signs detected with individual feedback for each
   - Each sign shows its position in the sequence
   - Read detailed overall feedback by default
   - Click "Show Summary" to toggle to brief view
   - Click "Show Detailed Feedback" to return

4. **Practice Again**
   - Click "Start Live Feedback" to record another sequence
   - Try single signs or multiple signs in a row
   - Previous feedback remains visible until new analysis

## 🎯 Feedback Quality

The system provides feedback at an appropriate skill level:
- Assumes working knowledge of ASL basics
- Focuses on refinement and precision
- Encourages proper form and technique
- Never segregates by skill level in messaging

## 🛠️ Technical Details

### Backend (`test.py`)
- **Framework**: FastAPI with async support
- **Endpoint**: `POST /analyze`
- **Rate Limit Handling**: Limits to 30 frames per analysis
- **Error Handling**: Graceful fallbacks and detailed error messages

### Frontend (`index.html`)
- **Pure JavaScript**: No external dependencies
- **Frame Capture**: Canvas API for image extraction
- **State Management**: Clean recording/analysis state flow
- **Responsive Design**: Works on desktop and tablet

### AI Integration
- **Model**: Gemini 2.5 Pro
- **Input**: Sequence of JPEG frames (base64 encoded)
- **Output**: Structured JSON with per-sign and overall feedback
- **Prompt Engineering**: Optimized for multi-gesture ASL sequence analysis

## 📝 Response Format

The AI returns feedback in JSON format:
```json
{
  "signs_detected": [
    {
      "sign": "Letter 'A'",
      "sequence_position": "first sign",
      "feedback": "Specific feedback for this sign..."
    },
    {
      "sign": "Letter 'B'",
      "sequence_position": "second sign",
      "feedback": "Specific feedback for this sign..."
    }
  ],
  "detailed_feedback": "Comprehensive overall analysis...",
  "summary": "Brief 2-3 sentence summary..."
}
```

## ⚡ Performance Tips

- **Optimal Recording Time**: 
  - Single sign: 2-3 seconds
  - Multiple signs: 5-10 seconds (allows clear transitions)
- **Clear Transitions**: Pause briefly between signs for better detection
- **Lighting**: Ensure good lighting for better hand detection
- **Camera Position**: Position camera to show full hand movements
- **Sign Speed**: Perform signs at natural pace (not too fast)
- **Fingerspelling**: Each letter will be detected separately if performed clearly

## 🔧 Configuration

### Adjust Frame Rate
In `index.html`, modify the capture interval:
```javascript
}, 333); // 333ms = ~3 FPS, change for different rates
```

### Change Frame Limit
In `test.py`, adjust max frames sent to AI:
```python
for frame_data in request.frames[:30]:  # Change 30 to desired limit
```

## 🔐 Security Note

⚠️ The API key in `test.py` should be moved to environment variables for production:
```python
import os
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
```

## 🐛 Troubleshooting

### "Camera access denied"
- Check browser permissions for camera
- Reload page and allow when prompted

### "Network error"
- Ensure server is running on port 8000
- Check CORS settings if accessing from different domain

### "Too few frames captured"
- Record for at least 1 second (3+ frames)
- Ensure camera feed is active

### Slow Analysis
- Gemini API may have rate limits
- Consider reducing frame count or resolution
- Check internet connection

## 📄 License

This is a Proof of Concept for educational purposes.

## 🙏 Acknowledgments

- Google Gemini AI for multimodal capabilities
- ASL community for inspiration
- FastAPI and modern web standards
