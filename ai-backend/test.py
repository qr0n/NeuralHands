# Gemini Live Video Interpretation - Proof of Concept Framework
# -------------------------------------------------------------
# This PoC streams webcam frames to a backend, which sends each frame to Gemini for interpretation.
# The backend returns live predictions (e.g., 'signing A', 'signing Hello') to the frontend.

# ---- Backend (Python / FastAPI) ----
# Run this with: uvicorn server:app --reload

from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai
import base64, io, json, re
from PIL import Image
from pydantic import BaseModel

app = FastAPI()
client = genai.Client(api_key="")


def sanitize_gemini_response(text: str) -> str:
    """
    Sanitize Gemini API response by removing markdown code blocks and extra whitespace.

    Args:
        text: Raw response text from Gemini

    Returns:
        Cleaned text ready for JSON parsing
    """
    if not text:
        return text

    text = text.strip()

    # Remove markdown code blocks with language identifier (e.g., ```json)
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```python"):
        text = text[9:]
    elif text.startswith("```javascript"):
        text = text[13:]
    elif text.startswith("```typescript"):
        text = text[13:]
    elif text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    # Strip any remaining whitespace
    text = text.strip()

    # Remove any leading/trailing newlines
    text = re.sub(r"^\n+|\n+$", "", text)

    return text


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VideoAnalysisRequest(BaseModel):
    frames: list[str]  # Base64 encoded images


@app.post("/analyze")
async def analyze_video(request: VideoAnalysisRequest):
    """Analyze a sequence of video frames for ASL gesture feedback"""
    try:
        # Convert base64 frames to PIL Images
        images = []
        for frame_data in request.frames[
            :30
        ]:  # Limit to 30 frames to avoid rate limits
            try:
                image_bytes = base64.b64decode(frame_data.split(",")[1])
                img = Image.open(io.BytesIO(image_bytes))
                images.append(img)
            except Exception:
                continue

        if not images:
            return JSONResponse(
                status_code=400, content={"error": "No valid frames provided"}
            )

        # Create prompt for detailed analysis
        prompt = """Analyze the ASL signing shown in these sequential video frames carefully. The user may be performing ONE sign/gesture OR MULTIPLE signs/gestures in sequence.

Your task:
1. Carefully examine the frame sequence to identify ALL distinct signs, letters, or gestures performed
2. For EACH identified sign, provide:
   - What sign/letter/gesture it is
   - Timing/position in the sequence (e.g., "first sign", "second sign")
   - Specific feedback on form, hand position, orientation, and movement quality
   - What they did well
   - Specific improvements needed

IMPORTANT: 
- If you see multiple distinct signs/gestures, list ALL of them
- Look for transitions between signs (hand repositioning, pauses, changes in hand shape)
- Each sign in fingerspelling or a sequence should be identified separately
- Pay attention to the ENTIRE video sequence, not just one moment

Provide your response in the following JSON format:
{
    "signs_detected": [
        {
            "sign": "name of the sign/letter/gesture",
            "sequence_position": "first/second/third/etc or 'only sign detected'",
            "feedback": "specific feedback for this sign including hand position, movement, orientation"
        }
    ],
    "detailed_feedback": "comprehensive overall feedback (150-200 words) covering all signs detected, flow between signs, and general technique",
    "summary": "brief 2-3 sentence summary highlighting key points across all signs performed"
}

Be encouraging, specific, and constructive. Analyze the COMPLETE sequence."""

        # Send all images with the prompt
        contents = images + [prompt]

        response = client.models.generate_content(
            model="gemini-2.5-pro", contents=contents
        )

        # Parse JSON response with sanitization
        response_text = sanitize_gemini_response(response.text)

        feedback_data = json.loads(response_text)

        return JSONResponse(content=feedback_data)

    except json.JSONDecodeError:
        # Fallback if JSON parsing fails
        return JSONResponse(
            content={
                "identified_sign": "Unknown",
                "detailed_feedback": (
                    response.text
                    if "response" in locals()
                    else "Error processing feedback"
                ),
                "summary": "Please try again with clearer signing.",
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": f"Analysis error: {str(e)}"}
        )


# ---- Frontend (HTML + JS) ----
# Save this as index.html and open in browser. It streams webcam frames via WebSocket.

"""
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Gemini Live Sign Interpreter (PoC)</title>
    <style>
      body { background:#000; color:#fff; text-align:center; font-family:sans-serif; }
      video { border-radius: 12px; width: 480px; height: 360px; margin-top: 20px; }
      #output { margin-top: 20px; font-size: 1.4rem; }
    </style>
  </head>
  <body>
    <h1>Gemini Live Sign Interpreter</h1>
    <video id="video" autoplay muted></video>
    <div id="output">Waiting for stream...</div>
    <script>
      const video = document.getElementById('video');
      const output = document.getElementById('output');
      const ws = new WebSocket('ws://localhost:8000/stream');

      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
      });

      ws.onmessage = (msg) => {
        output.innerText = msg.data;
      };

      function captureAndSend() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const frame = canvas.toDataURL('image/jpeg', 0.6);
        ws.send(frame);
      }

      setInterval(captureAndSend, 1000); // 1 FPS for PoC
    </script>
  </body>
</html>
"""

# -------------------------------------------------------------
# ✅ How to Run This Proof of Concept
# 1. Save the backend as `server.py` and run it with Uvicorn.
# 2. Save the frontend as `index.html` and open it in a browser.
# 3. Allow camera access.
# 4. Watch Gemini interpret frames in real time.
# -------------------------------------------------------------
