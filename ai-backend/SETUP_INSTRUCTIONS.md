# 🚀 Gemini AI Feedback Backend Setup

## Prerequisites

1. **Python 3.10+** installed
2. **Google Gemini API Key** (already in `test.py`)
3. **FastAPI & dependencies**

## Installation Steps

### 1. Install Python Dependencies

```bash
cd /Users/iron/Desktop/hackathon

# Install required packages
pip install fastapi uvicorn google-generativeai pillow python-multipart
```

### 2. Start the Backend Server

```bash
uvicorn test:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

### 3. Test the Backend (Optional)

Open a new terminal and test the API:

```bash
curl http://localhost:8000/
```

## Running the Frontend

### 1. Navigate to the Neural Hands project

```bash
cd /Users/iron/Desktop/frontend-hackathon/neural_hands
```

### 2. Install dependencies (if not already done)

```bash
npm install
```

### 3. Start the Next.js development server

```bash
npm run dev
```

### 4. Open in browser

Navigate to: http://localhost:3000

## How to Use the Feature

1. **Login or use Guest Mode** → Click "Translator (no sign-in)"
2. **Select Camera** → Choose your webcam
3. **Select Model** → Choose "Cloud (Google AI)" from the dropdown
4. **Two new buttons will appear:**
   - 🟢 **Toggle Live Feedback** - Starts recording your signing
   - 🔵 **Summary of Feedback** - Toggles between detailed and summary view

### Using Live Feedback:

1. Click **"Toggle Live Feedback"** (button turns red and shows "Stop Recording")
2. Perform your ASL sign(s) in front of the camera
3. The button will show frame count: "Stop Recording (25 frames)"
4. Click **"Stop Recording"** when done
5. Wait for analysis (button shows "Analyzing...")
6. Results appear below with:
   - **Signs Detected** - Each sign you performed with specific feedback
   - **Overall Feedback** - Comprehensive analysis

### Toggling Summary:

1. After getting feedback, click **"Summary of Feedback"**
2. Toggles between:
   - Detailed (150-200 word comprehensive feedback)
   - Summary (2-3 sentence brief overview)

## Troubleshooting

### ❌ "Network error: Failed to fetch"

**Problem:** Backend is not running or wrong URL

**Solution:**
```bash
# Make sure backend is running on port 8000
uvicorn test:app --reload --port 8000
```

### ❌ "CORS error"

**Problem:** CORS middleware not configured

**Solution:** Already configured in `test.py` with:
```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
```

### ❌ "Too few frames captured"

**Problem:** Camera not capturing frames or stopped too quickly

**Solution:**
- Make sure camera is active (green "Stop Camera" button)
- Record for at least 1-2 seconds before stopping
- Check browser console for errors

### ❌ Button disabled after error

**Problem:** Error occurred during analysis

**Solution:**
- Check backend logs for errors
- Refresh the page
- Try recording again

## API Endpoint Details

### POST /analyze

**Request:**
```json
{
  "frames": ["data:image/jpeg;base64,...", "data:image/jpeg;base64,..."]
}
```

**Response:**
```json
{
  "signs_detected": [
    {
      "sign": "A",
      "sequence_position": "first sign",
      "feedback": "Good hand position..."
    }
  ],
  "detailed_feedback": "Overall analysis...",
  "summary": "Brief summary..."
}
```

## Notes

- Frame capture rate: ~3 FPS (333ms intervals)
- Max frames sent to Gemini: 30 (to avoid rate limits)
- Minimum frames required: 3
- Image quality: 70% JPEG compression

## Next Steps

After testing this works:

1. Add authentication to backend API
2. Store feedback history in database
3. Create user progress tracking
4. Add more detailed sign-by-sign analysis
5. Implement real-time streaming (WebSocket) for instant feedback

## Support

If you encounter issues:
1. Check backend is running: `curl http://localhost:8000`
2. Check browser console for errors (F12)
3. Check backend logs in terminal
4. Verify API key is valid in `test.py`
