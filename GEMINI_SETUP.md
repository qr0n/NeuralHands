# Gemini Cloud Integration Setup

## Overview
The Cloud (Google AI) model in the Translator page uses Gemini 2.5 Pro to analyze ASL signing sequences and provide detailed feedback.

## Features
- **Toggle Live Feedback**: Records 3-10 seconds of signing, captures frames at ~3 FPS, and sends to Gemini for analysis
- **Show Summary**: Toggles between detailed feedback (150-200 words) and brief summary (2-3 sentences)
- **Multi-sign Detection**: Gemini can identify multiple signs in a sequence
- **Detailed Per-Sign Feedback**: Provides specific guidance on hand position, orientation, and movement quality

## Backend Setup

### 1. Start the FastAPI Backend

The backend is already configured in `/Users/iron/Desktop/hackathon/test.py`

```bash
cd /Users/iron/Desktop/hackathon
uvicorn test:app --reload --port 8000
```

### 2. Verify Backend is Running

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

## Frontend Usage

### 1. Start the Frontend

```bash
cd /Users/iron/Desktop/frontend-hackathon
npm run dev
```

### 2. Navigate to Translator Page

1. Go to the homepage
2. Click "Try the Translator Without Signing Up" OR login/signup
3. You'll be on the Translator page

### 3. Using Cloud Mode

1. In the toolbar, select **Model: Cloud (Google AI)**
2. Two new buttons will appear:
   - **Toggle Live Feedback**: Start/stop recording
   - **Show Summary**: Toggle feedback view (disabled until analysis complete)

### 4. Recording & Analysis Flow

1. Click "Start Camera" to enable your webcam
2. Click "Toggle Live Feedback" to start recording
   - Button will pulse and show "Stop & Analyze"
   - Frame count will update in real-time
3. Perform your ASL sign(s) for 3-10 seconds
4. Click "Stop & Analyze"
5. Wait for Gemini analysis (~5-15 seconds depending on frame count)
6. View detailed feedback below the camera

### 5. Feedback Display

The feedback shows:
- **Signs Detected**: Each identified sign with:
  - Sign name (e.g., "Letter A", "Hello")
  - Position in sequence ("first sign", "second sign", etc.)
  - Specific feedback on form and technique
- **Overall Feedback**: 
  - Detailed: 150-200 word comprehensive analysis
  - Summary: 2-3 sentence brief overview

## API Endpoint

### POST `/analyze`

**Request:**
```json
{
  "frames": ["data:image/jpeg;base64,...", "..."]
}
```

**Response:**
```json
{
  "signs_detected": [
    {
      "sign": "Letter A",
      "sequence_position": "first sign",
      "feedback": "Great thumb position! Try keeping fingers tighter..."
    }
  ],
  "detailed_feedback": "You performed two signs in this sequence...",
  "summary": "Good overall technique with minor improvements needed."
}
```

## Troubleshooting

### "Network error: Failed to fetch"
- Make sure backend is running on port 8000
- Check browser console for CORS errors
- Verify `uvicorn test:app --reload --port 8000` is active

### "Too few frames captured"
- Make sure camera is started before recording
- Keep recording for at least 1 second (3+ frames needed)

### "Analysis taking too long"
- Normal for first request (cold start)
- Subsequent requests should be faster
- Max 30 frames are sent (10 seconds at 3 FPS)

### Camera not working
- Check browser permissions
- Try refreshing the page
- Verify camera isn't in use by another app

## Technical Details

### Frame Capture
- Resolution: Native video resolution
- Quality: 70% JPEG compression
- Rate: ~3 FPS (one frame every 333ms)
- Format: Base64-encoded data URLs

### Gemini Model
- Model: `gemini-2.5-pro`
- Max frames: 30 (to stay under rate limits)
- Prompt: Structured JSON response format
- Analysis: Multi-sign detection with detailed feedback

## Local vs Cloud Comparison

| Feature | Local (Offline) | Cloud (Google AI) |
|---------|----------------|-------------------|
| Internet Required | ❌ No | ✅ Yes |
| Real-time | ✅ Instant | ⚠️ 5-15s delay |
| Sign Detection | Single letters | Multiple signs + words |
| Feedback Detail | Basic | Highly detailed |
| Training Data | ASL keypoints | Gemini's visual knowledge |
| Cost | Free | API costs apply |

## Next Steps

- [ ] Add confidence scoring to Gemini responses
- [ ] Implement caching for similar signs
- [ ] Add progress history for cloud analyses
- [ ] Support for continuous live streaming (instead of batch)
