#!/bin/bash

# Gemini AI Feedback Backend Starter Script
# Usage: ./start_backend.sh

echo "🚀 Starting Gemini AI Feedback Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if uvicorn is installed
if ! command -v uvicorn &> /dev/null; then
    echo "❌ uvicorn not found. Installing dependencies..."
    pip install fastapi uvicorn google-generativeai pillow python-multipart
fi

echo "✅ Starting server on http://neuralhands.ir0n.xyz:8000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 API Endpoint:"
echo "   POST http://neuralhands.ir0n.xyz:8000/analyze"
echo ""
echo "🌐 Frontend should connect to:"
echo "   http://neuralhands.ir0n.xyz:8000"
echo ""
echo "⚠️  Press CTRL+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start the server
uvicorn test:app --reload --host 0.0.0.0 --port 8000
