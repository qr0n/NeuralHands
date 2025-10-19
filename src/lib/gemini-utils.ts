/**
 * Gemini AI Utilities
 * Helper functions for sanitizing and processing Gemini API responses
 */

/**
 * Sanitize raw text response from Gemini API
 * Removes markdown code blocks, extra whitespace, and other artifacts
 * 
 * @param text - Raw response text from Gemini
 * @returns Cleaned text ready for JSON parsing or display
 */
export function sanitizeGeminiResponse(text: string): string {
  if (!text) {
    return text;
  }

  let cleaned = text.trim();

  // Remove markdown code blocks with language identifier (e.g., ```json, ```python)
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```python")) {
    cleaned = cleaned.slice(9);
  } else if (cleaned.startsWith("```javascript")) {
    cleaned = cleaned.slice(13);
  } else if (cleaned.startsWith("```typescript")) {
    cleaned = cleaned.slice(13);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }

  // Strip any remaining whitespace
  cleaned = cleaned.trim();

  // Remove any leading/trailing newlines
  cleaned = cleaned.replace(/^\n+|\n+$/g, '');

  return cleaned;
}

/**
 * Safely parse JSON from Gemini response
 * Applies sanitization before parsing
 * 
 * @param text - Raw JSON string from Gemini
 * @returns Parsed JSON object or null if parsing fails
 */
export function parseGeminiJSON<T = any>(text: string): T | null {
  try {
    const sanitized = sanitizeGeminiResponse(text);
    return JSON.parse(sanitized) as T;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Raw text:', text);
    return null;
  }
}

/**
 * Validate and sanitize Gemini feedback structure
 * Ensures the response has the expected structure for ASL feedback
 * 
 * @param data - Parsed Gemini response data
 * @returns Validated and sanitized feedback object or null if invalid
 */
export function validateGeminiFeedback(data: any): {
  signs_detected: Array<{
    sign: string;
    sequence_position: string;
    feedback: string | {
      what_they_did_well?: string;
      improvements_needed?: string;
    };
  }>;
  detailed_feedback: string;
  summary: string;
} | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  // Check required fields
  if (!data.signs_detected || !Array.isArray(data.signs_detected)) {
    return null;
  }

  if (!data.detailed_feedback || typeof data.detailed_feedback !== 'string') {
    return null;
  }

  if (!data.summary || typeof data.summary !== 'string') {
    return null;
  }

  // Sanitize signs_detected array
  const sanitizedSigns = data.signs_detected.map((sign: any) => ({
    sign: String(sign.sign || 'Unknown'),
    sequence_position: String(sign.sequence_position || 'unknown'),
    feedback: sign.feedback || 'No feedback provided',
  }));

  return {
    signs_detected: sanitizedSigns,
    detailed_feedback: String(data.detailed_feedback),
    summary: String(data.summary),
  };
}
